"use strict";

require('babel-register');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var assign = require('lodash.assign');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var glob = require('glob');
var istanbul = require('browserify-istanbul');
var shim = require('browserify-shim');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var watchify = require('watchify');

var Server = require('karma').Server;

var config = typeof $.util.env['configFile'] === 'string'? require($.util.env['configFile']) : {};



gulp.task('clean', function() {
    del(['dist', 'test/build', 'opendolphin/build', 'opendolphin/test/build', 'coverage']);
});



gulp.task('lint', function() {
    return gulp.src(['./src/**/*.js', '!./src/polyfills.js', './test/src/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('lint-tc', function() {
    return gulp.src(['./src/**/*.js', '!./src/polyfills.js', './test/src/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-teamcity'));
});


gulp.task('build-test:od', ['build:od'], function() {
    var bundle = browserify({debug: true})
        .add(glob.sync('./opendolphin/test*/**/*.ts'))
        .add('./opendolphin/testrunner/tsUnitKarmaAdapter.js')
        .plugin(tsify);

    return bundle.bundle()
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source('test-bundle.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./opendolphin/test/build'));
});

var testBundler = browserify(assign({}, watchify.args, {
    entries: glob.sync('./test/src/**/test-*.js'),
    debug: true
}));

function rebundleTest(bundler) {
    return bundler
        .transform(istanbul({
            ignore: ['**/src/polyfills.js', '**/opendolphin/**/*.js']
        }))
        .bundle()
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source('test-bundle.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./test/build'))
}

gulp.task('build-test', ['build:od'], function() {
    return rebundleTest(testBundler);
});

gulp.task('test:od', ['build-test:od'], function(done) {
    new Server({
        configFile: __dirname + '/opendolphin/testrunner/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('test', ['build-test'], function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('verify', ['lint', 'test']);



gulp.task('build:od', function() {
    return gulp.src('opendolphin/js/dolphin/*.ts')
      .pipe($.typescript({
          module: 'commonjs'
      }))
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('opendolphin/build/'));
});

var mainBundler = browserify(assign({}, watchify.args, {
    entries: './src/dolphin.js',
    standalone: 'dolphin',
    debug: true
}));

function rebundle(bundler) {
    return bundler
        .transform('babelify')
        .bundle()
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source('dolphin.js'))
        .pipe($.derequire())
        .pipe(gulp.dest('./dist'))
        .pipe(buffer())
        .pipe($.rename({extname: '.min.js'}))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
}

gulp.task('build', ['build:od'], function() {
    return rebundle(mainBundler);
});



gulp.task('watch', function() {
    gulp.watch(['src/**', 'test/**'], ['test']);

    var watchedMainBundler = watchify(mainBundler);
    watchedMainBundler.on('update', function() {rebundle(watchedMainBundler)});

    var watchedTestBundler = watchify(testBundler);
    watchedTestBundler.on('update', function() {rebundleTest(watchedTestBundler)});
});

gulp.task('default', ['verify', 'build', 'watch']);



gulp.task('sonar', ['ci'], function () {

    var options = {
        sonar: {
            host: {
                url: config.sonar.host.url
            },
            jdbc: {
                url: config.sonar.jdbc.url,
                username: config.sonar.jdbc.username,
                password: config.sonar.jdbc.password
            },
            projectKey: 'dolphin-js',
            projectName: 'Dolphin Platform JS',
            projectVersion: '0.8.5',
            sources: 'src',
            language: 'js',
            sourceEncoding: 'UTF-8',
            javascript: {
                lcov: {
                    reportPath: 'coverage/lcov.info'
                }
            },
            exec: {
                // All these properties will be send to the child_process.exec method (see: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback )
                // Increase the amount of data allowed on stdout or stderr (if this value is exceeded then the child process is killed, and the gulp-sonar will fail).
                maxBuffer : 1024*1024
            }
        }
    };

    return gulp.src([])
        .pipe($.sonar(options))
        .on('error', $.util.log);
});



gulp.task('ci-common', ['build', 'build-test', /* 'build-test:od', */ 'lint-tc']);

gulp.task('ci-test:od', ['ci-common'], function(done) {
    new Server({
        configFile: __dirname + '/opendolphin/testrunner/karma.conf.js',
        reporters: ['teamcity', 'coverage'],
        singleRun: true
    }, done).start();
});

gulp.task('ci-test', ['ci-common'], function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        reporters: ['teamcity', 'coverage'],
        coverageReporter: {
            reporters: [
                {type: 'lcovonly', subdir: '.'},
                {type: 'teamcity', subdir: '.'}
            ]
        },
        singleRun: true
    }, done).start();
});

gulp.task('ci', ['ci-common', 'ci-test' /*, 'ci-test:od' */]);


function createSauceLabsTestStep(customLaunchers, browsers, done) {
    return function() {
        new Server({
            configFile: __dirname + '/karma.conf.js',
            customLaunchers: customLaunchers,
            browsers: browsers,
            reporters: ['saucelabs', 'teamcity'],
            singleRun: true
        }, done).start();
    }
}

function createSauceLabsTestPipe(customLaunchers, step) {
    // We cannot run too many instances at Sauce Labs in parallel, thus we need to run it several times
    // with only a few environments set
    var numSauceLabsVMs = 3;
    var allBrowsers = Object.keys(customLaunchers);

    while (allBrowsers.length > 0) {
        var browsers = [];
        for (var i=0; i<numSauceLabsVMs && allBrowsers.length > 0; i++) {
            browsers.push(allBrowsers.shift());
        }

        step = createSauceLabsTestStep(customLaunchers, browsers, step);
    }

    step();
}

gulp.task('ci:nightly', ['ci-common'], function(done) {
    var customLaunchers = require('./sauce.launchers.js').daily;
    return createSauceLabsTestPipe(customLaunchers, done);
});

gulp.task('ci:weekly', ['ci-common'], function(done) {
    var customLaunchers = require('./sauce.launchers.js').weekly;
    return createSauceLabsTestPipe(customLaunchers, done);
});

gulp.task('ci:manual', ['ci-common'], function(done) {
    var customLaunchers = require('./sauce.launchers.js').manual;
    return createSauceLabsTestPipe(customLaunchers, done);
});

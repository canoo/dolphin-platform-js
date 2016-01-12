"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserify = require('browserify');
var istanbul = require('browserify-istanbul');
var shim = require('browserify-shim');
var del = require('del');
var glob = require('glob');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

var Server = require('karma').Server;

var config = typeof $.util.env['configFile'] === 'string'? require($.util.env['configFile']) : {};



gulp.task('clean', function() {
    del(['dist', 'test/build', 'coverage']);
});



gulp.task('lint', function() {
    return gulp.src(['./src/**/*.js', '!./src/polyfills.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

gulp.task('lint-tc', function() {
    return gulp.src(['./src/**/*.js', '!./src/polyfills.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-teamcity'))
});



var testBundler = browserify(assign({}, watchify.args, {
    entries: glob.sync('./test/src/**/test-*.js')
}));

function rebundleTest(bundler) {
    return bundler
        .transform(istanbul({
            ignore: ['**/src/polyfills.js', '**/libsrc/**/*.js']
        }))
        .bundle()
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source('test-bundle.js'))
        .pipe(gulp.dest('./test/build'))
}

gulp.task('build-test', function() {
    return rebundleTest(testBundler);
});

gulp.task('test', ['build-test'], function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('verify', ['lint', 'test']);



var mainBundler = browserify(assign({}, watchify.args, {
    entries: './src/dolphin.js',
    standalone: 'dolphin',
    debug: true
}));

function rebundle(bundler) {
    return bundler
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

gulp.task('build', function() {
    return rebundle(mainBundler);
});



gulp.task('watch', function() {
    gulp.watch(['src/**', 'test/**'], ['test']);

    var watchedMainBundler = watchify(mainBundler);
    watchedMainBundler.on('update', function() {rebundle(watchedMainBundler)});

    var watchedTestBundler = watchify(testBundler);
    watchedTestBundler.on('update', function() {rebundle(watchedTestBundler)});
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
            projectVersion: '0.7.1',
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



gulp.task('ci-common', ['build', 'build-test', 'lint-tc']);

gulp.task('ci', ['ci-common'], function(done) {
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

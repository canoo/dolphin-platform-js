"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserify = require('browserify');
var shim = require('browserify-shim');
var del = require('del');
var glob = require('glob');
var istanbul = require('browserify-istanbul');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

var Server = require('karma').Server;



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
            ignore: ['**/src/polyfills.js']
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



gulp.task('ci-common', ['build', 'build-test', 'lint-tc']);

gulp.task('ci', ['ci-common'], function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        reporters: ['teamcity', 'coverage'],
        coverageReporter: {
            reporters: [
                {type: 'lcovonly'},
                {type: 'teamcity'}
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

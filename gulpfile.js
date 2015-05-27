"use strict";

var browserify = require('browserify');
var shim = require('browserify-shim');
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var karma = require('gulp-karma');
var assign = require('lodash.assign');
var merge = require('merge-stream');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('clean', function() {
    del(['dist']);
});

gulp.task('lint', function() {
    return gulp.src(['./src/**/*.js', '!./src/polyfills.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//// TODO: Test other files
//var testBundler = browserify(assign({}, watchify.args, {
//    entries: glob.sync('./test/src/**/test-utils.js'),
//    debug: true
//}));
//
//function rebundleTest(bundler) {
//    return bundler
//        .bundle()
//        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
//        .pipe(source('test-bundle.js'))
//        .pipe(gulp.dest('./test/build'))
//}
//
//gulp.task('build-test', function() {
//    return rebundleTest(testBundler);
//});

//gulp.task('test', ['build-test'], function () {
//    return gulp.src('test/runner.html')
//        .pipe(mochaPhantomJS({reporter: 'min'}));
//});
gulp.task('test', function() {
    // Be sure to return the stream
    return gulp.src([])
        .pipe(karma({
            configFile: 'karma.conf.js',
            reporters: 'progress',
            action: 'run'
        }))
        .on('error', function(err) {
            throw err;
        });
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
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('dolphin.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(buffer())
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
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

gulp.task('default', ['test', 'build', 'watch']);



// TODO: Do CI setup
gulp.task('ci', ['build', 'build-test'], function() {
    return merge(
        gulp.src(['./src/**/*.js', '!./src/polyfills.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-teamcity')),
        gulp.src('test/runner.html')
            .pipe(mochaPhantomJS({reporter: 'mocha-teamcity-reporter'}))
    );
});

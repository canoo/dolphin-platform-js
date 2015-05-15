"use strict";

var browserify = require('browserify');
var shim = require('browserify-shim');
var del = require('del');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
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

gulp.task('unit-test', function() {
    return gulp.src(['test/**/test-*.js', '!test/integration/**/test-*.js'], { read: false })
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('integration-test', ['build'], function() {
    return gulp.src(['test/integration/**/test-*.js'], { read: false })
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('test', ['lint', 'unit-test', 'integration-test']);

gulp.task('build', function() {

    var bundler = watchify(browserify(assign({}, watchify.args, {
        entries: './src/dolphin.js',
        standalone: 'dolphin',
        debug: true
    })));

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler
            .bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('dolphin.js'))
            .pipe(buffer())
            .pipe(rename({extname: '.min.js'}))
            .pipe(sourcemaps.init({loadMaps: true}))
            //.pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));
    }

    return rebundle();
});

gulp.task('watch', function() {
    gulp.watch(['src/**', 'test/**'], ['test']);
});

gulp.task('default', ['test', 'build', 'watch']);

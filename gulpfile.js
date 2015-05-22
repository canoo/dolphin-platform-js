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

gulp.task('unit-test', function() {
    return gulp.src(['test/**/test-*.js', '!test/integration/**/test-*.js'], { read: false })
        .pipe(mocha({reporter: 'Min'}));
});

gulp.task('integration-test', ['build'], function() {
    return gulp.src(['test/integration/**/test-*.js'], { read: false })
        .pipe(mocha({reporter: 'Min'}));
});

gulp.task('test', ['lint', 'unit-test', 'integration-test']);

var bundler = browserify(assign({}, watchify.args, {
    entries: './src/dolphin.js',
    standalone: 'dolphin',
    debug: true
}));

function rebundle(bundler) {
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

gulp.task('build', function() {
    return rebundle(bundler);
});

gulp.task('watch', function() {
    gulp.watch(['src/**', 'test/**'], ['test']);

    var watchedBundle = watchify(bundler);

    bundler.on('update', function() {rebundle(watchedBundle)});
});

gulp.task('ci', ['build'], function() {
    return merge(
        gulp.src(['./src/**/*.js', '!./src/polyfills.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-teamcity')),
        gulp.src(['test/**/test-*.js'], { read: false })
            .pipe(mocha({reporter: 'mocha-teamcity-reporter'}))
    );
});

gulp.task('default', ['test', 'build', 'watch']);

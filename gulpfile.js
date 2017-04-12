"use strict";

require('babel-register');
var os = require('os');
os.tmpDir = os.tmpdir;
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var assign = require('lodash.assign');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var glob = require('glob');
var istanbul = require('browserify-istanbul');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var watchify = require('watchify');

var Server = require('karma').Server;

var config = typeof $.util.env['configFile'] === 'string' ? require($.util.env['configFile']) : {};


gulp.task('clean', function () {
    del(['dist', 'test/build', 'opendolphin/build', 'opendolphin/test/build', 'coverage']);
});

/* START: lint */
//local report
gulp.task('lint:js', function () {
    return gulp.src(['./src/**/*.js', './test/src/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.jshint.reporter('fail'));
});

//local report
gulp.task('lint:es', function () {
    return gulp.src(['./src/**/*.es6', './test/src/**/*.es6'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});

gulp.task('lint', ['lint:js', 'lint:es']);


/* END: lint */

/* START : build dolphin-platform related tests */

function rebundleTest(bundler) {
    return bundler
        .transform('babelify')
        .transform(istanbul({
            ignore: ['**/src/polyfills.js', '**/opendolphin/**/*.js']
        }))
        .bundle()
        .on('error', function (err) {
            $.util.log.bind($.util, 'Browserify Error: ' + err.toString());
            process.exit(1)
        })
        .pipe(source('test-bundle.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./test/build'))
}

var testBundler = browserify(assign({}, watchify.args, {
    entries: glob.sync('./test/src/**/test-*.js'),
    debug: true
}));

gulp.task('build-test:dp', ['build:od'], function () {
    return rebundleTest(testBundler);
});

/* END : build dolphin-platform related tests */

gulp.task('verify', ['lint', 'test']);

/* START: Building opendolphin and dolphin-platform.js */

//build opendolphin
gulp.task('build:od', function () {
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
        .on('error', function (err) {
            $.util.log.bind($.util, 'Browserify Error: ' + err.toString());
            process.exit(1)
        })
        .pipe(source('dolphin-platform.js'))
        .pipe($.derequire())
        .pipe(gulp.dest('./dist'))
        .pipe(buffer())
        .pipe($.rename({extname: '.min.js'}))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
}
//build dolphin-platform
gulp.task('build', ['build:od'], function () {
    return rebundle(mainBundler);
});
/* END: Building opendolphin and dolphin-platform.js */


//Watching for changes
gulp.task('watch', function () {
    gulp.watch(['src/**', 'test/**'], ['test']);

    var watchedMainBundler = watchify(mainBundler);
    watchedMainBundler.on('update', function () {
        rebundle(watchedMainBundler)
    });

    var watchedTestBundler = watchify(testBundler);
    watchedTestBundler.on('update', function () {
        rebundleTest(watchedTestBundler)
    });
});

gulp.task('default', ['verify', 'build', 'watch']);


/* START: build opendolphin tests  */
gulp.task('build-test:od', function () {
    var bundler = browserify({debug: true})
        .add(glob.sync('./opendolphin/test/src/**/*.ts'))
        .plugin(tsify);
    return bundler
        .transform('babelify')
        .transform(istanbul({
            ignore: ['**/src/polyfills.js', '**/opendolphin/**/*.js']
        }))
        .bundle()
        .on('error', function (err) {
            console.log("Error:: "+err.toString());
            $.util.log.bind($.util, 'Browserify Error: ' + err.toString());
            process.exit(1)
        })
        .pipe(source('test-bundle.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./opendolphin/test/build'));
});

gulp.task('test:od', ['build-test:od'], function (done) {
    new Server({
        configFile: __dirname + '/opendolphin/test/karma.conf.js',
        reporters: ['coverage'],
            coverageReporter: {
                reporters: [
                    {type: 'lcovonly', subdir: '.'},
                    {type: 'html', subdir: 'report-html'},
                ]
            },
        singleRun: true
    },
    function (result) {
        if (result === 0) {
            done();
        } else {
            done('Karma test failed for opendolphin: ' + result);
            process.exit(1)
        }
    }).start();
});

//Test dolphin-platform
gulp.task('test:dp', ['build-test:dp'], function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        reporters: ['coverage'],
        coverageReporter: {
            reporters: [
                {type: 'lcovonly', subdir: '.'},
                {type: 'html', subdir: 'report-html'},
            ]
        },
        singleRun: true
    } ,
    function (result) {
        if (result === 0) {
            done();
        } else {
            done('Karma test failed for dolphin-platform: ' + result);
            process.exit(1)
        }
    }).start();
});

gulp.task('test', ['test:dp', 'test:od']);


// START: Saucelabs
gulp.task('common', ['build', 'build-test:dp', 'build-test:od']);

function createSauceLabsTestStep(customLaunchers, browsers, done) {
    return function () {
        new Server({
                configFile: __dirname + '/karma.conf.js',
                customLaunchers: customLaunchers,
                browsers: browsers,
                reporters: ['saucelabs'],
                singleRun: true
            }
            , function (result) {
                if (result === 0) {
                    done();
                } else {
                    done('Karma test failed on Saucelabs: ' + result);
                    process.exit(1)
                }
            }).start();
    }
}

function createSauceLabsTestPipe(customLaunchers, step) {
    // We cannot run too many instances at Sauce Labs in parallel, thus we need to run it several times
    // with only a few environments set
    var numSauceLabsVMs = 5;
    var allBrowsers = Object.keys(customLaunchers);

    while (allBrowsers.length > 0) {
        var browsers = [];
        for (var i = 0; i < numSauceLabsVMs && allBrowsers.length > 0; i++) {
            browsers.push(allBrowsers.shift());
        }

        step = createSauceLabsTestStep(customLaunchers, browsers, step);
    }

    step();
}

gulp.task('saucelabs', ['common'], function (done) {
    var customLaunchers = require('./sauce.launchers.js').browsers;
    return createSauceLabsTestPipe(customLaunchers, done);
});

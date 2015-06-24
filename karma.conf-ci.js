var fs = require('fs');


module.exports = function (config) {

    // Use ENV vars on Travis and sauce.json locally to get credentials
    if (!process.env.SAUCE_USERNAME) {
        if (!fs.existsSync('sauce.json')) {
            console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
            process.exit(1);
        } else {
            process.env.SAUCE_USERNAME = require('./sauce').username;
            process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
        }
    }

    // Browsers to run on Sauce Labs
    var customLaunchers = {
        sl_win7_ie9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9.0'
        },
        sl_win7_ie10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '10.0'
        },
        //sl_win7_ie11: {
        //    base: 'SauceLabs',
        //    browserName: 'internet explorer',
        //    platform: 'Windows 7',
        //    version: '11.0'
        //},
        sl_win8_ie10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8',
            version: '10.0'
        },
        sl_win81_ie11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11.0'
        },
        //sl_winXP_chrome: {
        //    base: 'SauceLabs',
        //    browserName: 'chrome',
        //    platform: 'Windows XP',
        //    version: '43.0'
        //},
        //sl_winXP_firefox: {
        //    base: 'SauceLabs',
        //    browserName: 'firefox',
        //    platform: 'Windows XP',
        //    version: '38.0'
        //},
        //sl_win7_chrome: {
        //    base: 'SauceLabs',
        //    browserName: 'chrome',
        //    platform: 'Windows 7',
        //    version: '43.0'
        //},
        //sl_win7_firefox: {
        //    base: 'SauceLabs',
        //    browserName: 'firefox',
        //    platform: 'Windows 7',
        //    version: '38.0'
        //},
        //sl_win8_chrome: {
        //    base: 'SauceLabs',
        //    browserName: 'chrome',
        //    platform: 'Windows 8',
        //    version: '43.0'
        //},
        //sl_win8_firefox: {
        //    base: 'SauceLabs',
        //    browserName: 'firefox',
        //    platform: 'Windows 8',
        //    version: '38.0'
        //},
        //sl_win81_chrome: {
        //    base: 'SauceLabs',
        //    browserName: 'chrome',
        //    platform: 'Windows 8.1',
        //    version: '43.0'
        //},
        //sl_win81_firefox: {
        //    base: 'SauceLabs',
        //    browserName: 'firefox',
        //    platform: 'Windows 81',
        //    version: '38.0'
        //},
        sl_mac10_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'OSX 10.10',
            version: '43.0'
        },
        //sl_mac10_firefox: {
        //    base: 'SauceLabs',
        //    browserName: 'firefox',
        //    platform: 'OSX 10.10',
        //    version: '38.0'
        //},
        //sl_mac10_safari: {
        //    base: 'SauceLabs',
        //    browserName: 'safari',
        //    platform: 'OS X 10.10',
        //    version: '8.0'
        //},
        sl_mac9_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'OSX 10.9',
            version: '43.0'
        },
        //sl_mac9_firefox: {
        //    base: 'SauceLabs',
        //    browserName: 'firefox',
        //    platform: 'OSX 10.9',
        //    version: '38.0'
        //},
        //sl_mac9_safari: {
        //    base: 'SauceLabs',
        //    browserName: 'safari',
        //    platform: 'OS X 10.9',
        //    version: '7.0'
        //},
        //sl_linux_chrome: {
        //    base: 'SauceLabs',
        //    browserName: 'chrome',
        //    platform: 'Linux',
        //    version: '43.0'
        //},
        sl_linux_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux',
            version: '38.0'
        },
        sl_linux_opera: {
            base: 'SauceLabs',
            browserName: 'opera',
            platform: 'Linux',
            version: '12.15'
        }
    };


    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [
            './lib/opendolphin/opendolphin-0.11.js',
            './bower_components/observe-js/src/observe.js',
            './test/build/**/test-*.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['saucelabs', 'teamcity'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,


        sauceLabs: {
            testName: 'dolphin-js Unit Tests',
            //startConnect: true
            recordScreenshots: false,
            recordVideo: false
        },
        captureTimeout: 120000,
        browserDisconnectTimeout: 10 * 1000,
        browserDisconnectTolerance: 3,
        browserNoActivityTimeout: 20 * 1000,


        customLaunchers: customLaunchers,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: Object.keys(customLaunchers)

    });
};

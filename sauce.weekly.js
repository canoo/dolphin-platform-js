var customLaunchers = require('./sauce.nightly.js').customLaunchers;

customLaunchers.sl_ipad_8_1 = {
    base: 'SauceLabs',
    browserName: 'Safari',
    appiumVersion: '1.4.3',
    deviceName: 'iPad Simulator',
    deviceOrientation: 'portrait',
    platformName: 'iOS',
    platformVersion: '8.1'
};
customLaunchers.sl_ipad_8_0 = {
    base: 'SauceLabs',
    browserName: 'Safari',
    appiumVersion: '1.4.3',
    deviceName: 'iPad Simulator',
    deviceOrientation: 'portrait',
    platformName: 'iOS',
    platformVersion: '8.0'
};
customLaunchers.sl_ipad_7_1 = {
    base: 'SauceLabs',
    browserName: 'Safari',
    appiumVersion: '1.4.3',
    deviceName: 'iPad Simulator',
    deviceOrientation: 'portrait',
    platformName: 'iOS',
    platformVersion: '7.1'
};
customLaunchers.sl_ipad_7_0 = {
    base: 'SauceLabs',
    browserName: 'Safari',
    appiumVersion: '1.4.3',
    deviceName: 'iPad Simulator',
    deviceOrientation: 'portrait',
    platformName: 'iOS',
    platformVersion: '7.0'
};

customLaunchers.sl_android_5_0 = {
    base: 'SauceLabs',
    browserName: 'Android',
    platform: 'Linux',
    version: '5.0',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait'
};
customLaunchers.sl_android_4_4 = {
    base: 'SauceLabs',
    browserName: 'Android',
    platform: 'Linux',
    version: '4.4',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait'
};

exports.customLaunchers = customLaunchers;
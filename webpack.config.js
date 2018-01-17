const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        'dolphin-platform': './src/dolphinPlatform.js',
        'dolphin-platform.min': './src/dolphinPlatform.js'
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'dolphin',
        libraryTarget: 'umd',
        //umdNamedDefine: true
    },
    plugins: [
        new UglifyJsPlugin({
            include: /\.min\.js$/,
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            DOLPHIN_PLATFORM_VERSION: JSON.stringify(require("./package.json").version)
        })
    ]
};

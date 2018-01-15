const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        'dolphin-platform': './src/clientContextFactory.js',
        'dolphin-platform.min': './src/clientContextFactory.js'
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
            include: /\.min\.js$/
        })
    ]
};

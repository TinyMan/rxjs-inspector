const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const webpack = require('webpack');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const production = {
  panel: {},
  extension: {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [new ChromeExtensionReloader()],
  },
};
module.exports = Object.keys(common).map(k => merge(common[k], production[k]));

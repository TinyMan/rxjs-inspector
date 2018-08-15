const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.base.js');
const production = {
  panel: {
    mode: 'production',
  },
  extension: {
    mode: 'production',
  },
};
module.exports = Object.keys(common).map(k => merge(common[k], production[k]));

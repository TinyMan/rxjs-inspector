const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const version = require('../package.json').version;

function setManifestVersion(content) {
  const manifest = JSON.parse(content);
  manifest.version = version.split('-')[0];
  return JSON.stringify(manifest, null, 2);
}

module.exports = {
  entry: {
    devtools: path.join(__dirname, '../src/devtools.ts'),
    // popup: path.join(__dirname, '../src/popup.ts'),
    // options: path.join(__dirname, '../src/options.ts'),
    background: path.join(__dirname, '../src/background.ts'),
    content_script: path.join(__dirname, '../src/content_script.ts'),
  },
  output: {
    path: path.join(__dirname, '/../lib'),
    filename: 'js/[name].js',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      '@rxjs-inspector/devtools': '../../devtools/src',
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin(
      [
        {
          from: '../manifest.json',
          to: 'manifest.json',
          transform(content, path) {
            return setManifestVersion(content);
          },
        },
        {
          context: '../assets',
          from: '**/*',
        },
        {
          context: '../node_modules/@rxjs-inspector/panel/lib',
          from: '**/*',
          to: '../lib/panel',
        },
      ],
      { context: __dirname }
    ),
  ],
};

const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const version = require('../package.json').version;
const fs = require('fs');
const panelWebpackConfig = require('../../panel/webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

function setManifestVersion(content) {
  const manifest = JSON.parse(content);
  manifest.version = version.split('-')[0];
  return JSON.stringify(manifest, null, 2);
}
function comparePlugins(a, b) {
  return !!(
    a.constructor &&
    b.constructor &&
    a.constructor.name === b.constructor.name
  );
}
function replacePlugins(a, b, key) {
  if (key === 'plugins') {
    return a.map(p1 => {
      const match = b.find(p2 => comparePlugins(p1, p2));
      if (match) return match;
      else return p1;
    });
  } else return a.concat(b);
}

const projectRoot = path.resolve(__dirname, '../');
const outputRoot = path.resolve(projectRoot, 'lib');
const panelOutput = path.resolve(outputRoot, 'panel');

module.exports = {
  panel: merge({
    customizeArray: replacePlugins,
  })(panelWebpackConfig, {
    output: {
      path: panelOutput,
    },
    plugins: [new CleanWebpackPlugin(panelOutput, { root: outputRoot })],
  }),
  extension: {
    entry: {
      devtools: path.resolve(projectRoot, 'src/devtools.ts'),
      background: path.resolve(projectRoot, 'src/background.ts'),
      content_script: path.resolve(projectRoot, 'src/content_script.ts'),
    },
    output: {
      path: outputRoot,
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
        ],
        { context: __dirname }
      ),
    ],
  },
};

const ngToolsWebpack = require('@ngtools/webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const workspaceRoot = path.resolve(__dirname, './');
const projectRoot = path.resolve(__dirname, './');
const outputRoot = path.resolve(projectRoot, 'lib');

module.exports = {
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry: {
    polyfills: path.resolve(projectRoot, './src/polyfills.ts'),
    main: path.resolve(projectRoot, './src/main.ts'),
  },
  output: {
    path: outputRoot,
    filename: `[name].js`,
  },
  plugins: [
    new ngToolsWebpack.AngularCompilerPlugin({
      tsConfigPath: path.resolve(projectRoot, './src/tsconfig.app.json'),
      entryModule: path.resolve(projectRoot, './src/app/app.module#AppModule'),
      sourceMap: true,
    }),
    new CleanWebpackPlugin(outputRoot),
    new HtmlWebpackPlugin({
      template: __dirname + '/src/index.html',
      inject: 'body',
    }),
  ],
  module: {
    rules: [
      { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader'] },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.html$/, loader: 'raw-loader' },
      // require.resolve is required only because of the monorepo structure here.
      { test: /\.ts$/, loader: require.resolve('@ngtools/webpack') },
    ],
  },
};

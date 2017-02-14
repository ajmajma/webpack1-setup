const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const StyleLintPlugin = require('stylelint-webpack-plugin');


const nodeEnv = 'development';
const isProd = nodeEnv === 'production';

const sourcePath = path.join(__dirname, './client');
const staticsPath = path.join(__dirname, './build');


const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv)
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor.bundle.js'
  }),
  new HtmlWebpackPlugin({
      template: 'client/index.html',
      inject: 'body',
      hash: false,
      filename: 'index.html'
  }),
  new StyleLintPlugin(),
  new ExtractTextPlugin("styles.css"),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js'
    }),

    new webpack.HotModuleReplacementPlugin()
];

module.exports = {
  devtool: isProd ? 'source-map' : 'eval',
  devServer: {
    historyApiFallback: true,
    contentBase: sourcePath,
    hot: isProd ? false : true
  },
  entry: [
    './client/app.jsx'
  ],
  output: {
    path: staticsPath,
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ],
    loaders: [
     {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        include: __dirname,
        query: {
          presets: [ 'es2015', 'react', 'react-hmre' ]
        }
    },{
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(
        "style-loader",
        "css-loader!" +
        "autoprefixer-loader?browsers=last 3 version" +
        "!sass-loader?outputStyle=expanded&" +
        "includePaths[]=" + path.resolve(__dirname, './node_modules'))
    },{
        test: /\.json$/,
        loader: 'json'
    }]
  },
  eslint: {
    fix: true,
    quiet: true
  },
   postcss: function() {
    return [autoprefixer];
  },
  plugins: plugins
}

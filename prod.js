'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');


module.exports = {
    entry: {
        js: [
            path.join(__dirname, 'client/app.jsx')
        ],
        vendor: [
          'react',
          'react-dom',
          'lodash',
          'react-redux',
          'redux',
          'immutable',
          'react-intl'
        ]
    },
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: 'bundle.min.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production")
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new HtmlWebpackPlugin({
            template: 'client/index.html',
            inject: 'body',
            hash: false,
            filename: 'index.html'
        }),
        new ExtractTextPlugin('styles.css'),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
          },
          output: {
            comments: false
          },
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'vendor.bundle.js'
        }),
        new CopyWebpackPlugin([
            { from: 'client/vendor', to: 'vendor'  },
            { from: 'client/images', to: 'images'  }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],

    eslint: {
        configFile: '.eslintrc',
        failOnWarning: false,
        failOnError: false
    },

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint'
            }
        ],
        loaders: [
        {
            test:  /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            include: __dirname,
            query: {
              presets: [ 'es2015', 'react']
            }
        },{
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
        },{
            test: /\.json$/,
            loader: 'json'
        }]
    },
    postcss: [
        require('autoprefixer')
    ]
};

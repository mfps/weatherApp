var webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: './styles.css'
});

let babelOptions = {
  presets: [
    [
      'env',
      {
        targets: {
          browsers: ['last 2 versions', 'IE >= 9']
        }
      }
    ]
  ]
};

const config = {
  devtool: 'inline-source-map',
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, './js/script.js'),
    path.resolve(__dirname, './styles/styles.scss')
  ],
  output: {
    filename: './bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          }
        ]
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                minimize: true
              }
            }
          ]
        })
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        use: [{ loader: 'url-loader' }]
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [extractSass]
};

module.exports = config;
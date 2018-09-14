var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './client/App.js',
  output: {
    path: path.resolve(__dirname, 'public/javascripts'),
    filename: 'client.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};

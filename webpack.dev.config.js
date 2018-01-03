const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {

  entry: {
    pages: `${__dirname}/src/app.js`,
    vendor: ['react', 'react-dom', 'react-router', 'babel-polyfill', 'react-css-modules'],
  },
  output: {
    path: `${__dirname}/build/dist_new`,
    filename: 'bundle.js',
    publicPath: 'dist_new/',
    chunkFilename: '[name].[chunkhash:5].chunk.js',
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local]-[hash:base64:6]',
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local]-[hash:base64:6]!less-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader?modules!sass-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=6400&name=images/[hash:8].[name].[ext]',
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'url-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],

  },
  resolve: {
    extensions: ['.', '.js', '.jsx'],
    alias: {
      utils: `${__dirname}/src/utils`,
      service: `${__dirname}/src/service`,
      component: `${__dirname}/src/component`,
      reducer: `${__dirname}/src/redux/reducer`,
      action: `${__dirname}/src/redux/action`,
      json: `${__dirname}/src/json`,
    },
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: Infinity,
      filename: 'common.js',
    }),
    new webpack.ProvidePlugin({$: 'jquery'}),
    new webpack.DefinePlugin({
      'process.env': {
        HOST: JSON.stringify('https://api-dev.beichoo.com'),
        HOST_B: JSON.stringify('https://dev.beichoo.com'),
        NODE_ENV: JSON.stringify('production'),
        H5HOST: JSON.stringify('https://promotion-dev.beichoo.com'),
        TEMP: JSON.stringify('https://lie-dev.beichoo.com/#/'),
      },
    }),

    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'build/index.html'),
      template: path.resolve(__dirname, 'index.html'),
      hash: true,
    }),

    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false, // remove all comments
      },
      compress: {
        warnings: false,
      },
    }),
  ],
}

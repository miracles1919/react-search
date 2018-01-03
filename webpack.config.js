const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin') // 抽取CSS文件插件
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    pages: `${__dirname}/src/app.js`,
  },
  output: {
    path: `${__dirname}/static/`,
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: __dirname,
    publicPath: '/',
    hot: true,
    inline: true,
    historyApiFallback: true,
    port: 8088,
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
    new webpack.DefinePlugin({

    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
}

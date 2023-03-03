const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 8008,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    compress: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  entry: [
    'babel-polyfill',
    './src/index.js',
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: [
          // The `injectType`  option can be avoided because it is default behaviour
          { loader: "style-loader", options: { injectType: "styleTag" } },
          "css-loader",
        ],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: './src/index.html'
    }),    
    new webpack.IgnorePlugin({
      resourceRegExp: /@blueprintjs\/(core|icons)/, // ignore optional UI framework dependencies
    }),
  ],
  resolve: {
    fallback: { url: require.resolve('url/') }
  },
  optimization: {
    runtimeChunk: 'single',
  },
}

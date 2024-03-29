const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    polyfill: 'babel-polyfill',
    viewer: './sass/viewer.scss',
    books: './js/viewer.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
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
        test: /\.(sa|sc|c)ss$/i,
        use: [          
          process.env.NODE_ENV !== 'production'
          ? 'style-loader'
          : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',          
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sourceMap: true,
            },
          },

        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset',
      },
    ]
  }
}

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    'babel-polyfill',
    // 'react-hot-loader/patch', // for react-hot-loader
    './src/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    })
    // new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    alias: {
      App: path.resolve(__dirname, 'src/components/App.js')
    },
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.json', '.jsx', '.css', 'scss', '*']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'bower_components')
        ],
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015', 'stage-0']
          // plugins: ['react-hot-loader/babel'] // for react-hot-loader
        }
      },
      {
        test: /\.css$/,
        use: [
          // OR: 'style-loader', 'css-loader'
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve(__dirname, 'src/styles')
              ]
            }
          }
        ]
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader'
      }
      // {
      //   test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
      //   loader: 'url-loader?limit=100000@name=[name][ext]'
      // }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'), // or "dist" or "build"
    compress: true,
    port: 7031, // 9000, default: 8080
    // hot: true,
    clientLogLevel: 'info' // none, error, warning or info (default)
  },
  devtool: 'source-map'
};

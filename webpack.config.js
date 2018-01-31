const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// rename to "env" ?
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

console.log('nodeEnv', nodeEnv);
console.log('isProduction', isProduction);

const extractStyles = new ExtractTextPlugin({
  // filename: '[name].css',
  filename: 'styles.css',
  allChunks: true,
  // inline loading in development is recommended for HMR and build speed
  disable: nodeEnv === 'development' // OR !isProduction
});

module.exports = {
  entry: [
    // 'babel-polyfill', // can load specific core-js polyfills separately
    './src/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  plugins: [
    extractStyles,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
    // TODO: disable in development
    // new UglifyJSPlugin({
    //   parallel: true, // default === os.cpus().length -1
    //   sourceMap: true
    // })
    new CleanWebpackPlugin(
      ['public'], // OR 'build' OR 'dist', removes folder
      { exclude: ['index.html'] }
    )
  ],
  resolve: {
    alias: {
      App: path.resolve(__dirname, 'src/containers/App.js')
    },
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.json', '.jsx', '*']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        options: {
          plugins: ['transform-class-properties'],
          presets: [
            ['env', {
              // useBuiltIns: 'entry', // or 'usage'
              debug: true
            }],
            'react',
            'stage-3'
          ]
        }
      },
      {
        test: /\.(scss|css)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules')
        ],
        use: extractStyles.extract({
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1, sourceMap: true }
            },
            'resolve-url-loader',
            { loader: 'sass-loader', options: { sourceMap: true } }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  devServer: {
    progress: true,
    contentBase: path.resolve(__dirname, 'public'), // or "dist" or "build"
    compress: true,
    historyApiFallback: true,
    port: 7031 // 9000, default: 8080
  },
  devtool: 'source-map'
  // devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map'
};

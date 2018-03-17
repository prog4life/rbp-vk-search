const webpack = require('webpack');
const path = require('path');
// const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const VisualizerPlugin = require('webpack-visualizer-plugin');
const DuplPkgCheckrPlugin = require('duplicate-package-checker-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// rename to "env" ?
// const nodeEnv = process.env.NODE_ENV || 'development';
const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv === 'production';

console.log('nodeEnv', nodeEnv);
console.log('isProduction', isProduction);

const extractStyles = new ExtractTextPlugin({
  // filename: 'css/styles.[contenthash].css',
  filename: 'styles.css', // TODO: change to func or add 'styles' entry
  allChunks: true,
  // inline loading in development is recommended for HMR and build speed
  disable: nodeEnv === 'development' // OR !isProduction
});

module.exports = {
  entry: {
    // polyfills: './src/config/polyfills.js',
    bundle: [
      './src/config/polyfills.js',
      // 'babel-polyfill',
      // 'normalize.css/normalize.css',
      // './src/styles/index.scss',
      './src/index.js'
    ]
  },
  output: {
    filename: '[name].js',
    // filename: '[name].[chunkhash].js',
    // chunkFilename: '[name].bundle.js',
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
    // new UglifyJSPlugin({ // NOTE: disable in development
    //   parallel: true, // default === os.cpus().length -1
    //   sourceMap: true
    // })
    new CleanWebpackPlugin(
      ['public'], // OR 'build' OR 'dist', removes folder
      { exclude: ['index.html'] }
    ),
    // new HTMLWebpackPlugin({
    //   title: 'vk-search with reactbootstrap',
    //   favicon: path.resolve(__dirname, 'src/assets/favicon-32x32.png'),
    //   inject: false,
    //   template: path.resolve(__dirname, 'src/assets/template-index.html'),
    //   chunksSortMode(a, b) {
    //     const chunks = ['manifest', 'polyfills', 'vendors', 'bundle'];
    //     return chunks.indexOf(a.names[0]) - chunks.indexOf(b.names[0]);
    //   },
    //   appMountId: 'app',
    //   mobile: true
    //   // excludeChunks: ['common']
    //   // filename: 'assets/custom.html'
    //   // hash: true // usefull for cache busting
    // }),
    // new CompressionPlugin({
    //   deleteOriginalAssets: true,
    //   test: /\.js/
    // }),
    // useful during development for more readable output, if compare with
    // new webpack.NamedModulesPlugin(), // HashedModuleIdsPlugin
    // new webpack.HashedModuleIdsPlugin(), // better for production
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: ['bundle'],
      minChunks(module) { // 1st arg: 'module', 2nd: count
        // This prevents stylesheet resources with the .css or .scss extension
        // from being moved from their original chunk to the vendor chunk
        if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        } // eslint-disable-next-line
        return module.context && module.context.includes('node_modules');
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   minChunks: 2
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   minChunks: Infinity
    // }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    // new VisualizerPlugin(),
    new DuplPkgCheckrPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  resolve: {
    alias: {
      App: path.resolve(__dirname, 'src/containers/App.js'),
      Components: path.resolve(__dirname, 'src/components'),
      Utilities: path.resolve(__dirname, 'src/utils')
    },
    modules: [
      // path.resolve(__dirname, 'src/components'),
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
          plugins: [
            'fast-async',
            'transform-class-properties',
            [require('babel-plugin-transform-imports'), {
              'react-bootstrap': {
                transform(importName) {
                  return `react-bootstrap/lib/${importName.toUpperCase()}`;
                },
                preventFullImport: true
              }
            }]
          ],
          presets: [
            ['env', {
              modules: false,
              useBuiltIns: 'usage', // 'entry' OR false
              debug: true,
              targets: {
                // browsers: ['defaults', 'firefox 52', 'not ie <= 11'],
                browsers: ['last 2 versions']
              },
              exclude: [
                'transform-regenerator',
                'transform-async-to-generator'
              ]
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
            // 'resolve-url-loader',
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

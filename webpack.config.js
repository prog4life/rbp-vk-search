const webpack = require('webpack');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DuplPkgCheckrPlugin = require('duplicate-package-checker-webpack-plugin');
const BabelPluginTransformImports = require('babel-plugin-transform-imports');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
// const VisualizerPlugin = require('webpack-visualizer-plugin');
// const autoprefixer = require('autoprefixer');
// const scssSyntax = require('postcss-scss');
// const cssnano = require('cssnano');

process.traceDeprecation = true; // or run process with --trace-deprecation flag

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

console.log('env', env);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

// const extractStyles = new ExtractTextPlugin({
//   // filename: 'css/styles.[contenthash].css',
//   filename: 'styles.css', // TODO: change to func or add 'styles' entry
//   allChunks: true,
//   // inline loading in development is recommended for HMR and build speed
//   disable: !isProduction, // OR env === 'development'
// });

module.exports = {
  mode: env,
  entry: {
    // polyfills: './src/config/polyfills.js',
    main: [ // OR "app"
      // 'babel-polyfill',
      // 'normalize.css/normalize.css',
      // './src/styles/index.scss',
      // './src/config/polyfills.js',
      './src/index.js',
    ],
  },
  output: {
    filename: isProduction ? 'js/[name].[chunkhash:4].js' : '[name].[id].js',
    chunkFilename: isProduction ? 'js/[name].[chunkhash:4].js' : '[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  optimization: {
    minimizer: [ // setting this overrides webpack 4 defaults
      new UglifyJSPlugin({
        cache: true,
        parallel: 2, // if "true": os.cpus().length -1 (default)
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCssAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all', // to work for not only async chunks too
      // name: false, // switch off name generation
      cacheGroups: {
        // polyfills: {
        //   test: /polyfills/,
        //   name: 'polyfills',
        //   chunks: 'initial',
        //   // reuseExistingChunk: false,
        //   // enforce: true,
        // },
        'react-bootstrap': {
          test: /react-bootstrap/,
        },
        // 'react-dom': {
        //   test: /react-dom/,
        // },
        // commons: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name: 'vendors',
        //   // chunks: 'initial',
        // },
        // styles: { // to extract css to one file
        //   name: 'styles',
        //   test: /\.css$/,
        //   chunks: 'all',
        //   enforce: true,
        // },
      },
    },
    // adds an additonal chunk to each entrypoint containing only the runtime
    // runtimeChunk: true, // something like extracting a manifest
    runtimeChunk: {
      name: 'manifest',
    },
  },
  plugins: [
    // extractStyles,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isProduction ? 'css/styles.[contenthash:4].css' : '[name].css',
      chunkFilename: isProduction ? 'css/[name].[contenthash:4].css' : '[id].css',
    }),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify(env),
    //   },
    // }),
    new CleanWebpackPlugin(
      ['build'], // OR 'build' OR 'dist', removes folder
      { exclude: ['index.html'] },
    ),
    new HTMLWebpackPlugin({
      title: 'vk-search with reactbootstrap',
      favicon: path.resolve(__dirname, 'src/assets/favicon.png'),
      // meta: {
      //   viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      // },
      inject: false,
      template: path.resolve(__dirname, 'src/assets/template.html'),
      // chunksSortMode(a, b) {
      //   const order = ['polyfills', 'react-bootstrap', 'vendors', 'main'];
      //   return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
      // },
      appMountId: 'app',
      mobile: true,
      // minify: false,
      // filename: 'assets/custom.html'
      // hash: true // usefull for cache busting
    }),
    // new CompressionPlugin({
    //   deleteOriginalAssets: true,
    //   test: /\.js/
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendors',
    //   chunks: ['main'],
    //   minChunks(module) { // 1st arg: 'module', 2nd: count
    //     // This prevents stylesheet resources with the .css or .scss extension
    //     // from being moved from their original chunk to the vendor chunk
    //     if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
    //       return false;
    //     } // eslint-disable-next-line
    //     return module.context && module.context.includes('node_modules');
    //   },
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['react-bootstrap'],
    //   chunks: ['vendors'],
    //   minChunks: ({ resource }) => resource && (/react-bootstrap/).test(resource),
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   minChunks: 2
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   // minChunks: Infinity
    // }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      // reportFilename: '../temp', // relative to output.path
      openAnalyzer: false,
    }),
    new DuplPkgCheckrPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new VisualizerPlugin(),
    ...isProduction ? [] : [new webpack.HotModuleReplacementPlugin()],
  ],
  resolve: {
    alias: {
      // components: path.resolve(__dirname, 'src/components'),
      // containers: path.resolve(__dirname, 'src/containers'),
      // utils: path.resolve(__dirname, 'src/utils'),
      // store: path.resolve(__dirname, 'src/store'),
      // styles: path.resolve(__dirname, 'src/styles'),
    },
    modules: [
      path.resolve(__dirname, 'src'),
      // path.resolve(__dirname, 'src/components'),
      'node_modules',
    ],
    extensions: ['.js', '.json', '.jsx', '*'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')],
        options: {
          plugins: [
            'react-hot-loader/babel',
            // 'fast-async',
            'syntax-dynamic-import',
            'transform-class-properties',
            [BabelPluginTransformImports, { // TODO: try "transform-imports"
              'react-bootstrap': {
                transform(importName) {
                  return `react-bootstrap/lib/${importName}`;
                },
                preventFullImport: true,
              },
              'redux-form': {
                transform(importName) {
                  return `redux-form/es/${importName}`;
                },
                preventFullImport: true,
              },
            }],
          ].concat(isProduction ? [] : ['transform-react-jsx-source']),
          presets: [
            ['env', {
              modules: false,
              useBuiltIns: 'usage', // 'entry' OR false
              debug: true,
              targets: {
                // browsers: ['defaults', 'firefox 52', 'not ie <= 11'],
                browsers: [
                  'last 2 versions',
                  'not ie <= 11',
                  'not android <= 62',
                ],
              },
              exclude: [
                // 'transform-regenerator',
                // 'transform-async-to-generator',
              ],
            }],
            'react',
            'stage-3',
          ],
          cacheDirectory: true,
        },
      },
      {
        test: /\.(scss|css)$/, // OR /\.s?[ac]ss$/,
        include: [
          // path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'src/styles'),
          path.resolve(__dirname, 'src/components'),
          path.resolve(__dirname, 'node_modules'),
        ],
        // use: extractStyles.extract({
        //   use: [
        //     {
        //       loader: 'css-loader',
        //       options: { importLoaders: 1, sourceMap: true },
        //     },
        //     // 'resolve-url-loader',
        //     { loader: 'sass-loader', options: { sourceMap: true } },
        //   ],
        //   fallback: 'style-loader',
        // }),
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          { // not translates url() that starts with "/"
            loader: 'css-loader',
            // options: { importLoaders: 3, url: false }
            options: { minimize: true, sourceMap: true },
          },
          // 'resolve-url-loader',
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        // TODO: consider to remove include
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isProduction ? '[name].[hash:4].[ext]' : '[name].[ext]',
              // outputPath: 'assets/', // custom output path
              useRelativePath: true, // isProd
            },
          },
          // {
          //   loader: 'image-webpack-loader',
          //   query: {
          //     progressive: true,
          //     optimizationLevel: 7,
          //     interlaced: false,
          //     pngquant: {
          //       quality: '65-90',
          //       speed: 4
          //     }
          //   }
          // }
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  devServer: {
    progress: true,
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    port: 7031, // 9000, default: 8080
  },
  devtool: 'source-map',
  // devtool: isProduction ? 'source-map' : 'eval-source-map',
};

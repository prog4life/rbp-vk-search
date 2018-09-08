const webpack = require('webpack');
const path = require('path');
const os = require('os');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DuplPkgCheckrPlugin = require('duplicate-package-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const BabelPluginTransformImports = require('babel-plugin-transform-imports');
// const CompressionPlugin = require('compression-webpack-plugin');
// const VisualizerPlugin = require('webpack-visualizer-plugin');
// const autoprefixer = require('autoprefixer');
// const cssnano = require('cssnano');
// const scssSyntax = require('postcss-scss');

process.traceDeprecation = true; // or run process with --trace-deprecation flag

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
// const devMode = env !== 'production';

console.log('env: ', env);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

module.exports = {
  mode: env,
  entry: {
    // polyfills: './src/config/polyfills.js',
    main: [ // OR "app"
      // 'babel-polyfill',
      // 'normalize.css/normalize.css',
      // 'sanitize.css/sanitize.css',
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
  // ========================== OPTIMIZATION ==================================
  optimization: {
    minimizer: [ // setting this overrides webpack 4 defaults
      new UglifyJSPlugin({
        cache: true,
        parallel: os.cpus().length || 2, // "true": os.cpus().length - 1 (def)
        sourceMap: true, // set to true if you want JS source maps
      }),
      // use this or 'cssnano' or 'optimize-cssnano-plugin'
      new OptimizeCSSAssetsPlugin({}), // source maps are not created
    ],
    // ------------------------ SPLIT CHUNKS ----------------------------------
    splitChunks: {
      chunks: 'all', // to work for not only async chunks too
      // name: false, // switch off name generation
      cacheGroups: {
        // 'react-bootstrap': {
        //   test: /react-bootstrap/,
        // },
        // commons: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name: 'vendors',
        //   // chunks: 'initial',
        // },
        base: {
          // test: /(react|react-dom|react-router|react-router-dom)/,
          test(module, chunks) {
            const name = module.nameForCondition && module.nameForCondition();
            // TODO: use new RegExp(`re`) for multiline, but remember about
            // backslash in string
            const re = /[\\/](react|react-dom|react-router|react-router-dom|react-bootstrap|core-js|whatwg-fetch)[\\/]/;
            const result = re.test(name);

            // console.log(`module.nameForCondition: ${name}`);
            // console.log(`RegExp .test() RESULT: ${result}`);

            return result;
          },
        },
        // to extract css to single file
        // 'common-styles': {
        //   name: 'styles',
        //   test: /\.css$/,
        //   chunks: 'all',
        //   enforce: true,
        // },
      },
    },
    // adds an additonal chunk to each entrypoint containing only the runtime
    // something like extracting a manifest
    runtimeChunk: 'single', // boolean | 'multiple' | {
    //   name: entrypoint => `runtime~${entrypoint.name}`,
    // },
  },
  // =============================== PLUGINS ==================================
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isProduction ? 'css/styles.[contenthash:4].css' : '[name].css',
      chunkFilename: isProduction ? 'css/[name].[contenthash:4].css' : '[id].css',
    }),
    new CleanWebpackPlugin(
      ['build'], // OR 'build' OR 'dist', removes folder
      { exclude: ['index.html'] }, // TEMP
    ),
    new HTMLWebpackPlugin({
      title: 'vk-search with reactbootstrap',
      favicon: path.resolve(__dirname, 'src/assets/favicon.png'),
      // meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      inject: false,
      template: path.resolve(__dirname, 'src/assets/template.html'),
      // chunksSortMode(a, b) {
      //   const order = ['polyfills', 'react-bootstrap', 'vendors', 'main'];
      //   return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
      // },
      appMountId: 'app',
      mobile: true,
    }),
    // new CompressionPlugin({
    //   cache: true, // default: false, enable file caching
    //   deleteOriginalAssets: true,
    //   test: /\.js/
    // }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      // reportFilename: '../temp', // relative to output.path
      openAnalyzer: false,
    }),
    new CircularDependencyPlugin({
      exclude: /temp|node_modules/i, // exclude detection of files
      failOnError: true, // add errors to webpack instead of warnings
      // allow import cycles that include an asyncronous import, e.g. via
      allowAsyncCycles: false, // import(/* webpackMode: "weak" */ './file.js')
      cwd: process.cwd(), // for displaying module paths
    }),
    new DuplPkgCheckrPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new VisualizerPlugin(),
    ...isProduction ? [] : [new webpack.HotModuleReplacementPlugin()],
  ],
  // =============================== RESOLVE ==================================
  resolve: {
    alias: {
      // components: path.resolve(__dirname, 'src/components'),
      // containers: path.resolve(__dirname, 'src/containers'),
      // utils: path.resolve(__dirname, 'src/utils'),
      // store: path.resolve(__dirname, 'src/store'),
      // styles: path.resolve(__dirname, 'src/styles'),
    },
    modules: [
      // path.resolve(__dirname, 'src/components'),
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
    extensions: ['.js', '.json', '.jsx', '*'],
  },
  // ============================ MODULE (lOADERS) ============================
  module: {
    rules: [
      // -------------------- JS/JSX BABEL-LOADER -----------------------------
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')],
        options: {
          // babelrc: false, // default: true
          cacheDirectory: true,
          // ------------------------ BABEL PLUGINS ---------------------------
          // plugins: [
          //   'react-hot-loader/babel', // consider replacing if not in dev mode
          //   // 'fast-async',
          //   'syntax-dynamic-import',
          //   'transform-class-properties',
          //   // 'transform-flow-strip-types',
          //   [BabelPluginTransformImports, { // TODO: try "transform-imports"
          //     'react-bootstrap': {
          //       transform(importName) {
          //         return `react-bootstrap/lib/${importName}`;
          //       },
          //       preventFullImport: true,
          //     },
          //     'redux-form': {
          //       transform(importName) {
          //         return `redux-form/es/${importName}`;
          //       },
          //       preventFullImport: true,
          //     },
          //   }],
          // // TODO: replace next concat by .filter(Boolean)
          // ].concat(isProduction ? [] : ['transform-react-jsx-source']),
          // // ------------------------ BABEL PRESETS ---------------------------
          // presets: [
          //   ['env', {
          //     // need to be turned on for Jest testing
          //     // modules: env === 'development' ? false : 'commonjs',
          //     modules: false,
          //     useBuiltIns: 'usage', // 'entry' OR false
          //     debug: true,
          //     targets: {
          //       // external config in package.json or .browserslistrc will
          //       // be supported in 7.0
          //       browsers: [
          //         "defaults", // > 0.5%, last 2 versions, Firefox ESR, not dead
          //         // "not Firefox ESR", // requires few polyfills
          //         "not ie <= 11",
          //         "not android <= 62",
          //         // "not chrome <= 49",
          //       ],
          //     },
          //     exclude: [
          //       // 'transform-regenerator',
          //       // 'transform-async-to-generator',
          //     ],
          //   }],
          //   // 'flow',
          //   'react',
          //   'stage-3',
          // ],
        },
      },
      // --------------------- CSS/SCSS LOADERS -------------------------------
      {
        test: /\.(scss|css)$/, // OR /\.s?[ac]ss$/, OR /\.(sa|sc|c)ss$/,
        include: [
          // path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'src/styles'),
          path.resolve(__dirname, 'src/components'),
          path.resolve(__dirname, 'node_modules'),
        ],
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          { // not translates url() that starts with "/"
            loader: 'css-loader',
            // options: { importLoaders: 3, url: false }
            options: { sourceMap: true },
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
          // --------------------- FILE-LOADER --------------------------------
          {
            loader: 'file-loader',
            options: {
              name: isProduction ? '[name].[hash:4].[ext]' : '[name].[ext]',
              // outputPath: 'assets/', // custom output path
              useRelativePath: true, // isProd
            },
          },
          // --------------------- IMAGE-WEBPACK-LOADER -----------------------
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
      // --------------------------- URL-LOADER -------------------------------
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  // ============================= DEV-SERVER =================================
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

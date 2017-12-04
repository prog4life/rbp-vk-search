const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    // 'babel-polyfill',
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
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'babel-loader',
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
          // plugins: ['react-hot-loader/babel'] // for react-hot-loader
        }
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     // OR: 'style-loader', 'css-loader'
      //     { loader: 'style-loader' },
      //     { loader: 'css-loader' }
      //   ]
      // },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     ident: 'postcss',
          //     syntax: scssSyntax,
          //     plugins: [
          //       autoprefixer
          //       // postcss-normalize,
          //       // cssnano
          //     ],
          //     sourceMap: true
          //   }
          // },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
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
    historyApiFallback: true,
    port: 7031 // 9000, default: 8080
    // hot: true
  },
  devtool: 'source-map'
};

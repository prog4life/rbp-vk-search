const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'bower_components')
        ],
        loader: 'babel-loader',
        options: {
          presets: ['react', 'env']
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
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader'
      }
      // {
      //   test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
      //   loader: 'url-loader?limit=100000@name=[name][ext]'
      // }
    ]
  },
  resolve: {
    alias: {
      App: path.resolve(__dirname, 'src/components/App.jsx')
    },
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.json', '.jsx', '.css']
  },
  devtool: 'source-map'
};

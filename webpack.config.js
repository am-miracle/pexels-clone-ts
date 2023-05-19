const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'none',
  entry: './src/app.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
        'node_modules',
    ],
    fallback: {
        fs: false,
        path: require.resolve("path-browserify"),
        os: require.resolve("os-browserify/browser")
    }
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist/js'),
  },
  plugins: [
    new Dotenv(),
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // })
  ]
};

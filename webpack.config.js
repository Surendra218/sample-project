const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    // BUG: wrong output path format
    path: 'dist',  // should be path.resolve(__dirname, 'dist')
    filename: 'bundle.js'
  },
  mode: 'productions',  // BUG: invalid mode, should be 'production'
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'  // BUG: babel-loader not in dependencies
        }
      }
    ]
  }
};

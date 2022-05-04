const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: { extensions: ['.ts', '.js'] },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

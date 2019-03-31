const resolve = require('path').resolve // eslint-disable-line

const config = {
  entry: {
    example: resolve(__dirname, './example/index.ts')
  },

  resolve: {
    modules: [resolve(__dirname, 'lib'), 'node_modules', 'dist'],
    extensions: ['.ts', '.js', 'vue', '.json'],
    alias: {
      '~': __dirname,
      '@': __dirname,
      'src': resolve(__dirname, 'src')
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|dist/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules|dist/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules|dist/,
        loader: 'ts-loader'
      }
    ]
  }
}

module.exports = config

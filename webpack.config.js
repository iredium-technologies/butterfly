const resolve = require('path').resolve // eslint-disable-line

module.exports = {
  entry: {
    example: resolve(__dirname, './example/index.ts')
  },

  resolve: {
    modules: [resolve(__dirname, 'lib'), 'node_modules'],
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
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  }
}

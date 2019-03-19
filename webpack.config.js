const resolve = require('path').resolve // eslint-disable-line

const config = {
  entry: {
    example: resolve(__dirname, './example/index.ts')
  },

  resolve: {
    modules: [resolve(__dirname, 'lib'), 'node_modules', 'build'],
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
        exclude: /node_modules|build/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules|build/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules|build/,
        loader: 'ts-loader'
      }
    ]
  }
}

if (process.env.BUILD_ENV) {
  config.entry.butterfly = resolve(__dirname, './src/butterfly.ts')
  config.entry.controllers = resolve(__dirname, './src/controllers/index.ts')
  config.entry.errors = resolve(__dirname, './src/errors/index.ts')
  config.entry.events = resolve(__dirname, './src/events/index.ts')
  config.entry.helpers = resolve(__dirname, './src/helpers/index.ts')
  config.entry.jobs = resolve(__dirname, './src/jobs/index.ts')
  config.entry.jobs = resolve(__dirname, './src/jobs/index.ts')
  config.entry.listeners = resolve(__dirname, './src/listeners/index.ts')
  config.entry.middlewares = resolve(__dirname, './src/middlewares/index.ts')
  config.entry.models = resolve(__dirname, './src/models/index.ts')
  config.entry.notifiers = resolve(__dirname, './src/notifiers/index.ts')
  config.entry.policies = resolve(__dirname, './src/policies/index.ts')
  config.entry.routes = resolve(__dirname, './src/routes/index.ts')
  config.entry.services = resolve(__dirname, './src/services/index.ts')
}

module.exports = config

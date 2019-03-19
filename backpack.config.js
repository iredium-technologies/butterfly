const resolve = require('path').resolve // eslint-disable-line
const webpackConfig = require('./webpack.config')

module.exports = {
  webpack: (config, options, webpack) => {
    return Object.assign(config, webpackConfig)
  }
}

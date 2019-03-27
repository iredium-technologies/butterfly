/* eslint-disable */

const resolve = require('path').resolve
const webpackConfig = require('./webpack.config')

module.exports = {
  webpack: (config, options, webpack) => {
    config.output.path = resolve(__dirname, 'dist')
    return Object.assign(config, webpackConfig)
  }
}

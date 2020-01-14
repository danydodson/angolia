const morgan = require('morgan')
const chalk = require('chalk')

const reqlogs = () => morgan(function (tokens, req, res) {
  return [
    chalk.magenta(tokens.method(req, res)),
    chalk.yellow(tokens.status(req, res)),
    chalk.hex('#EC7063')(tokens.url(req, res)),
    chalk.cyan(tokens.res(req, res, 'content-length')),
    chalk.cyan('in'),
    chalk.green(tokens['response-time'](req, res) + 'ms'),
    chalk.hex('#fffa65')(tokens['remote-addr'](req, res)),
    chalk.cyan('from'),
    chalk.yellow(tokens.referrer(req, res)),
  ].join(' ')
})

module.exports = reqlogs
var Runner = require('./lib/Runner'),
    web = require('./web')

module.exports.start = options => new Runner(options)
module.exports.web = options => web(options)

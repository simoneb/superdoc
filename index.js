module.exports.start = options => new require('./lib/Runner')(options)
module.exports.web = options => require('./web')(options)

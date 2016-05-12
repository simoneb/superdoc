var url = require('url'),
    querystring = require('querystring'),
    supertest = require('supertest'),
    Test = supertest.Test,
    _assert,
    methods = [],
    _options

function doc (options) {
  _options = options || {
        apiPrefix: '/'
      }

  methods.length = 0

  _assert = Test.prototype.assert
  Test.prototype.assert = function () {
    map(this)
    _assert.apply(this, arguments)
  }

  Test.prototype.describe = function (description) {
    this.description = description
    return this
  }

  return stop
}

function stop () {
  Test.prototype.assert = _assert
  delete Test.prototype.describe
}

function map (test) {
  var request = test.request(),
      response = test.response,
      requestUrl = url.parse(request.path)

  methods.push({
    // trim leading slash
    name: requestUrl.pathname.replace(new RegExp('^' + escapeRegExp(_options.apiPrefix)), ''),
    description: test.description || '',
    arguments: (requestUrl.query && querystring.parse(requestUrl.query)) || test._data,
    response: /text/.test(response.type) ? response.text : response.body
  })
}

// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = supertest

module.exports.doc = doc
module.exports.methods = methods

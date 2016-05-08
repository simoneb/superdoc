var url = require('url'),
    querystring = require('querystring'),
    supertest = require('supertest'),
    Test = supertest.Test,
    _assert,
    methods = [],
    _reduce


function doc (reduce) {
  methods.length = 0
  _reduce = reduce || function (i) {
        return i
      }

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

  _reduce(methods)
}

function map (test) {
  var request = test.request(),
      response = test.response,
      requestUrl = url.parse(request.path)

  console.log(request.body)

  methods.push({
    // trim leading slash
    name: requestUrl.path.substring(1),
    description: test.description || '',
    arguments: requestUrl.query && querystring.parse(requestUrl.query) || request.body,
    response: /text/.test(response.type) ? response.text : response.body
  })
}

module.exports = supertest

module.exports.doc = doc
module.exports.methods = methods

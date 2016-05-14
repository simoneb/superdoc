var url = require('url'),
    _ = require('lodash'),
    querystring = require('querystring'),
    supertest = require('supertest'),
    Test = supertest.Test,
    Augmenter = require('./Augmenter'),
    Stopper = require('./Stopper')

function Runner (options) {
  var self = this

  this.methods = []
  this.options = _.merge({
    apiPrefix: '/',
    output: './data.json'
  }, options)

  var augmenter = new Augmenter(Test)

  augmenter.augment('assert', function (original) {
    return function () {
      self.map(this)
      original.apply(this, arguments)
    }
  })

  augmenter.augment('describe', function () {
    return function (description) {
      this._superdoc_description = description
      return this
    }
  })

  augmenter.augment('describeArgs', function () {
    return function (description) {
      this._superdoc_argumentDescription = description
      return this
    }
  })

  return new Stopper(this, augmenter)
}

Runner.prototype.map = function (test) {
  var request = test.request(),
      response = test.response,
      requestUrl = url.parse(request.path)

  this.methods.push({
    name: requestUrl.pathname.replace(new RegExp('^' + escapeRegExp(this.options.apiPrefix)), ''),
    description: test._superdoc_description || '',
    arguments: (requestUrl.query && querystring.parse(requestUrl.query)) || test._data,
    argumentDescription: test._superdoc_argumentDescription || {},
    response: /text/.test(response.type) ? response.text : response.body
  })
}

// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = Runner
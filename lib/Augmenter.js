function Augmenter (constructor) {
  this.constructor = constructor
  this.originals = {}
}

Augmenter.prototype.augment = function (key, augment) {
  var original = this.constructor.prototype[key]

  this.originals[key] = original
  this.constructor.prototype[key] = augment(original)
}

Augmenter.prototype.reset = function () {
  var self = this

  Object.keys(this.originals).forEach(function (key) {
    var original = self.originals[key]

    if (original) {
      self.constructor.prototype[key] = original
    } else {
      delete self.constructor.prototype[key]
    }
  })
}

module.exports = Augmenter

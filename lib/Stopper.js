var _ = require('lodash'),
    writeFileSync = require('fs').writeFileSync

function Stopper (runner, augmenter) {
  var stop = function () {
    augmenter.reset()
    reduce()
  }

  stop.methods = runner.methods

  return stop

  function reduce () {
    let data = _(runner.methods)
        .groupBy(method => method.name.split('.')[0])
        .mapValues(methods => _(methods)
            .groupBy('name')
            .mapValues(methods => {
              let argumentExample = _.mapValues(_.merge.apply({}, _(methods)
                  .filter(m => m.response.ok)
                  .map('arguments')
                  .valueOf()), value => ({example: value}))

              let argumentDescription = _.mapValues(_.merge.apply({}, _(methods)
                  .map('argumentDescription')
                  .valueOf()), value => ({description: value}))

              return {
                description: _(methods).map('description').compact().first() || '',
                arguments: _.merge({}, argumentExample, argumentDescription),
                response: _.merge.apply({}, _(methods).map('response').filter({ok: true}).valueOf()),
                errors: _(methods).map('response.error').compact().uniq().valueOf(),
                warnings: _(methods).map('response.warning').compact().uniq().valueOf()
              }
            })
            .valueOf())
        .valueOf()

    // console.log(JSON.stringify(data, null, 1))

    writeFileSync(runner.options.output, JSON.stringify(data, null, 1))
  }
}

module.exports = Stopper

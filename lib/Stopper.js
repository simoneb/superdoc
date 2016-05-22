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
    let methods = _(runner.methods)
        .groupBy('name')
        .mapValues((methods, name) => {
          let argumentExample = _.mapValues(
              _.merge.apply({}, _(methods)
                  .filter(m => m.response.ok)
                  .map('arguments')
                  .value()),
              value => ({example: value}))

          let argumentDescription = _.mapValues(
              _.merge.apply({}, _(methods)
                  .map('argumentDescription')
                  .value()),
              value => ({description: value}))

          let argumentRequired = _.mapValues(
              _.merge.apply({}, _(methods)
                  .map('arguments')
                  .value()),
              (value, key) => ({
                required: _(methods)
                    .filter(m => m.response.ok)
                    .map('arguments')
                    .every(args => _.has(args, key))
              }))

          let errorDescription = _.merge.apply({}, _(methods)
              .map('errorDescription')
              .value())

          return {
            name,
            description: _(methods).map('description').compact().first() || '',
            responseDescription: _(methods).map('responseDescription').compact().first() || '',
            arguments: _.merge({}, argumentExample, argumentDescription, argumentRequired),
            response: _.merge.apply({}, _(methods).map('response').filter({ok: true}).value()),
            errors: _(methods)
                .map('response.error').compact().uniq()
                .map(e => [e, errorDescription[e] || ''])
                .fromPairs()
                .value(),
            warnings: _(methods).map('response.warning').compact().uniq().value()
          }
        })
        .values()
        .sortBy('name')
        .value()

    writeFileSync(
        runner.options.output,
        JSON.stringify({options: runner.options, methods: methods}, null, 1)
    )
  }
}

module.exports = Stopper

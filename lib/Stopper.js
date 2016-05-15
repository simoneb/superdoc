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

          return {
            name,
            description: _(methods).map('description').compact().first() || '',
            arguments: _.merge({}, argumentExample, argumentDescription, argumentRequired),
            response: _.merge.apply({}, _(methods).map('response').filter({ok: true}).value()),
            errors: _(methods).map('response.error').compact().uniq().value(),
            warnings: _(methods).map('response.warning').compact().uniq().value()
          }
        })
        .values()
        .value()

    writeFileSync(
        runner.options.output,
        JSON.stringify({options: runner.options, methods: data}, null, 1)
    )
  }
}

module.exports = Stopper

let _ = require('lodash')
let app = require('express')()

app.set('view engine', 'ejs')
app.set('views', __dirname)

app.use((req, res, next) => {
  req.methods = require(app.get('fileName'))
  next()
})

app.get('/', (req, res) => {
  let groups = _.groupBy(req.methods, method => method.name.split('.')[0])

  res.render('index', {groups})
})

app.get('/:method', (req, res) => {
  let method = _.find(req.methods, {name: req.params.method})

  res.render('method', {method})
})

module.exports = function (options) {
  Object.keys(options).forEach(key => {
    app.set(key, options[key])
  })

  return app
}

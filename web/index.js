let app = require('express')()

app.set('view engine', 'ejs')
app.set('views', __dirname)

app.use((req, res, next) => {
  req.methods = require(app.get('fileName'))
  next()
})

app.get('/', (req, res) => res.render('index', {methods: req.methods}))

app.get('/:method', (req, res) => {
  let group = req.params.method.split('.')[0]

  res.render('method', {
    name: req.params.method,
    method: req.methods[group][req.params.method]
  })
})

module.exports = function (options) {
  Object.keys(options).forEach(key => {
    app.set(key, options[key])
  })

  return app
}

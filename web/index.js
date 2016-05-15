let path = require('path')
let livereload = require('livereload')
let _ = require('lodash')
let readFileSync = require('fs').readFileSync
let express = require('express')

function makeApp (options) {
  let app = express()

  app.set('view engine', 'ejs')
  app.set('views', __dirname)

  app.use((req, res, next) => {
    req.methods = JSON.parse(readFileSync(options.fileName))
    next()
  })

  if (options.liveReload) {
    app.use(require('connect-livereload')())
  }

  app.get('/', (req, res) => {
    let groups = _.groupBy(req.methods, method => method.name.split('.')[0])

    res.render('index', {groups})
  })

  app.get('/:method', (req, res) => {
    let method = _.find(req.methods, {name: req.params.method})

    res.render('method', {method})
  })

  if (options.liveReload) {
    livereload.createServer({
      exts: ['json']
    }).watch(path.dirname(options.fileName))
  }

  return app
}

module.exports = makeApp

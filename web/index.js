let path = require('path')
let livereload = require('livereload')
let _ = require('lodash')
let readFileSync = require('fs').readFileSync
let express = require('express')
let ejsLayouts = require("express-ejs-layouts")

function makeApp (options) {
  let app = express()

  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))

  app.use(ejsLayouts)
  app.use(express.static(path.join(__dirname, 'public')))

  app.use((req, res, next) => {
    res.locals.docs = JSON.parse(readFileSync(options.fileName))
    next()
  })

  if (options.liveReload) {
    app.use(require('connect-livereload')())
  }

  app.get('/', (req, res) => {
    let groups = _.groupBy(res.locals.docs.methods, method => method.name.split('.')[0])

    res.render('index', {options: res.locals.docs.options, groups})
  })

  app.get('/:method', (req, res) => {
    let method = _.find(res.locals.docs.methods, {name: req.params.method})

    res.render('method', {
      mountpath: app.mountpath,
      options: res.locals.docs.options,
      method
    })
  })

  if (options.liveReload) {
    livereload.createServer({
      exts: ['json']
    }).watch(path.dirname(options.fileName))
  }

  return app
}

module.exports = makeApp

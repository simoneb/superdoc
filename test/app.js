var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    web = require('../').web,
    app = express()

app.use('/docs', web({
  fileName: path.join(__dirname, '..', 'data.json'),
  liveReload: true
}))

app.use(bodyParser.json())

app.get('/hello', (req, res) => res.send('hello'))
app.get('/json', (req, res) => res.json({hello: 'world'}))
app.post('/json', (req, res) => res.json(req.body))

module.exports = app

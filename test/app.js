var express = require('express'),
    app = express()

app.get('/hello', (req, res) => res.send('hello'))
app.get('/json', (req, res) => res.json({ hello: 'world' }))
app.post('/json', (req, res) => res.json(req.body))

module.exports = app

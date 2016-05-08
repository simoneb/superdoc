var app = require('./app'),
    superdoc = require('..'),
    request = superdoc(app),
    resetDoc

beforeEach(function () {
  resetDoc = superdoc.doc()
})

afterEach(function () {
  resetDoc()
})

describe('methods', function () {

  it('should track name', function (done) {
    request
        .get('/hello')
        .expect('hello')
        .end(function (err) {
          if (err) return done(err)
          superdoc.methods.length.should.equal(1)
          superdoc.methods[0].name.should.equal('hello')
          done()
        })
  })

  it('should track description', function (done) {
    request
        .get('/hello')
        .describe('whatever')
        .expect('hello')
        .end(function (err) {
          if (err) return done(err)
          superdoc.methods.length.should.equal(1)
          superdoc.methods[0].description.should.equal('whatever')
          done()
        })
  })

  it('should track arguments in querystring', function (done) {
    request
        .get('/hello?hello=world')
        .describe('whatever')
        .expect('hello')
        .end(function (err) {
          if (err) return done(err)
          superdoc.methods.length.should.equal(1)
          superdoc.methods[0].arguments.should.deepEqual({ hello: 'world' })
          done()
        })
  })

  it.skip('should track arguments in body', function (done) {
    request
        .post('/json')
        .send({ hello: 'world' })
        .describe('whatever')
        .expect('hello')
        .end(function (err) {
          if (err) return done(err)
          superdoc.methods.length.should.equal(1)
          superdoc.methods[0].arguments.should.deepEqual({ hello: 'world' })
          done()
        })
  })

  it('should track text response', function (done) {
    request
        .get('/hello')
        .describe('whatever')
        .expect('hello')
        .end(function (err) {
          if (err) return done(err)
          superdoc.methods.length.should.equal(1)
          superdoc.methods[0].response.should.equal('hello')
          done()
        })
  })

  it('should track json response', function (done) {
    request
        .get('/json')
        .describe('whatever')
        .expect({ hello: 'world' })
        .end(function (err) {
          if (err) return done(err)
          superdoc.methods.length.should.equal(1)
          superdoc.methods[0].response.should.deepEqual({ hello: 'world' })
          done()
        })
  })

})

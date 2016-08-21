var should = require('should'),
    app = require('./../utils/app'),
    superdoc = require('..'),
    request = require('supertest')(app),
    docs

beforeEach(function () {
  docs = superdoc.start()
})

afterEach(function () {
  docs()
})

describe('methods', function () {

  it('should track name', function (done) {
    request
        .get('/hello')
        .expect('hello')
        .end(function (err) {
          if (err) return done(err)
          docs.methods.length.should.equal(1)
          docs.methods[0].name.should.equal('hello')
          done()
        })
  })

  it('should track name with querystring', function (done) {
    request
        .get('/hello?world=1')
        .expect('hello')
        .end(function (err) {
          if (err) return done(err)
          docs.methods.length.should.equal(1)
          docs.methods[0].name.should.equal('hello')
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

          docs.methods.length.should.equal(1)
          docs.methods[0].description.should.equal('whatever')
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

          should.config.checkProtoEql = false;
          docs.methods.should.have.length(1)
          should(docs.methods[0].arguments).be.eql({hello: 'world'})
          done()
        })
  })

  it('should track arguments in body', function (done) {
    request
        .post('/json')
        .send({hello: 'world'})
        .describe('whatever')
        .expect({hello: 'world'})
        .end(function (err) {
          if (err) return done(err)

          docs.methods.should.have.length(1)
          docs.methods[0].arguments.should.deepEqual({hello: 'world'})
          done()
        })
  })

  it('should track arguments descriptions', function (done) {
    request
        .post('/json')
        .send({hello: 'world'})
        .describeArgs({hello: 'some argument'})
        .expect({hello: 'world'})
        .end(function (err) {
          if (err) return done(err)

          docs.methods.length.should.equal(1)
          docs.methods[0].argumentDescription.should.deepEqual({hello: 'some argument'})
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
          docs.methods.length.should.equal(1)
          docs.methods[0].response.should.equal('hello')
          done()
        })
  })

  it('should track json response', function (done) {
    request
        .get('/json')
        .describe('whatever')
        .expect({hello: 'world'})
        .end(function (err) {
          if (err) return done(err)
          docs.methods.length.should.equal(1)
          docs.methods[0].response.should.deepEqual({hello: 'world'})
          done()
        })
  })

})

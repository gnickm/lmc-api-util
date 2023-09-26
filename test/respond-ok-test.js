// --------------------------------------------------------------------------
// Copyright (C) 2016-2023 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
'use strict'

const express = require('express')
const request = require('supertest')
const status = require('http-status-codes').StatusCodes
const expect = require('chai').expect

const api = require('..')
const helper = require('./helper')

// --------------------------------------------------------------------------

const app = express()

describe('lmc-api-util - respondOk() and children', function () {
  describe('respondOk()', function () {
    before(function () {
      app.get('/ok', function (req, res) {
        if (req.query.resultobj) {
          api.respondOk(res, 'OK result with object', { foo: 'bar' })
        } else if (req.query.nomessage) {
          api.respondOk(res)
        } else {
          api.respondOk(res, 'OK result')
        }
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondOk)
    })
    it('should return OK result with message', function (done) {
      request(app)
        .get('/ok')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('OK')
          expect(res.body.message).to.equal('OK result')
          done()
        })
    })
    it('should return OK result with no message', function (done) {
      request(app)
        .get('/ok?nomessage=true')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('OK')
          expect(res.body.message).to.be.undefined
          done()
        })
    })
    it('should return OK result with message and additional object', function (done) {
      request(app)
        .get('/ok?resultobj=true')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('OK')
          expect(res.body.message).to.equal('OK result with object')
          expect(res.body.foo).to.equal('bar')
          done()
        })
    })
  })
  describe('respondFound()', function () {
    before(function () {
      app.get('/found', function (req, res) {
        if (req.query.type === 'object') {
          api.respondFound(res, 'Thing 123', { thing: { stuff: 'junk' } })
        } else if (req.query.type === 'array') {
          api.respondFound(res, 'Thing 123', {
            things: [
              { id: 1 },
              { id: 2 },
              { id: 3 }
            ]
          })
        } else {
          api.respondFound(res, 'Thing 123', { thing: 'junk' })
        }
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondFound)
    })
    it('should return OK with "Found" message and extra params', function (done) {
      request(app)
        .get('/found')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('OK')
          expect(res.body.message).to.equal('Found Thing 123')
          expect(res.body.thing).to.equal('junk')
          done()
        })
    })
    it('should return OK with "Found" message and deep object', function (done) {
      request(app)
        .get('/found?type=object')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('OK')
          expect(res.body.message).to.equal('Found Thing 123')
          expect(res.body.thing).to.be.an('object')
          expect(res.body.thing.stuff).to.equal('junk')
          done()
        })
    })
    it('should return OK with "Found" message and array of objects', function (done) {
      request(app)
        .get('/found?type=array')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('OK')
          expect(res.body.message).to.equal('Found Thing 123')
          expect(res.body.things).to.be.an('array')
          expect(res.body.things).to.have.length(3)
          expect(res.body.things[0].id).to.equal(1)
          expect(res.body.things[1].id).to.equal(2)
          expect(res.body.things[2].id).to.equal(3)
          done()
        })
    })
  })
  describe('respondFoundZero()', function () {
    before(function () {
      app.get('/foundzero', function (req, res) {
        api.respondFoundZero(res, 'Things', { stuff: 'junk' })
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondFoundZero)
    })
    it('should return OK with "Found zero" message', function (done) {
      request(app)
        .get('/foundzero')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('OK')
          expect(res.body.message).to.equal('Found zero Things')
          expect(res.body.stuff).to.equal('junk')
          done()
        })
    })
  })
  describe('respondCreated()', function () {
    before(function () {
      app.get('/created', function (req, res) {
        api.respondCreated(res, 'Thing 123', {
          location: '/created/123',
          stuff: 'junk'
        })
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondCreated)
    })
    it('should return CREATED status with "Created new" message and location header', function (done) {
      request(app)
        .get('/created')
        .set('Accept', 'application/json')
        .expect(status.CREATED)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.header.location).to.equal('/created/123')
          expect(res.body.result).to.equal('OK')
          expect(res.body.message).to.equal('Created new Thing 123')
          expect(res.body.location).to.equal('/created/123')
          expect(res.body.stuff).to.equal('junk')
          done()
        })
    })
  })
  describe('respondUpdated()', function () {
    before(function () {
      app.get('/updated', function (req, res) {
        api.respondUpdated(res, 'Thing 123', {
          location: '/updated/123',
          stuff: 'junk'
        })
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondUpdated)
    })
    it('should return OK status with "Updated" message and location header', function (done) {
      request(app)
        .get('/updated')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.header.location).to.equal('/updated/123')
          expect(res.body.result).to.equal('OK')
          expect(res.body.message).to.equal('Updated Thing 123')
          expect(res.body.location).to.equal('/updated/123')
          expect(res.body.stuff).to.equal('junk')
          done()
        })
    })
  })
  describe('respondDeleted()', function () {
    before(function () {
      app.get('/deleted', function (req, res) {
        api.respondDeleted(res, 'Thing 123', { stuff: 'junk' })
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondDeleted)
    })
    it('should return OK with "Deleted" message', function (done) {
      request(app)
        .get('/deleted')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('OK')
          expect(res.body.message).to.equal('Deleted Thing 123')
          expect(res.body.stuff).to.equal('junk')
          done()
        })
    })
  })
})

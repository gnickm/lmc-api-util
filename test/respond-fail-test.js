// --------------------------------------------------------------------------
// Copyright (c) 2016-2023 Nick Mitchell - MIT Licensed
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

describe('lmc-api-util - respondFail() and children', function () {
  describe('respondFail()', function () {
    before(function () {
      app.get('/fail', function (req, res) {
        if (req.query.resultobj) {
          api.respondFail(res, 'FAIL result with object', { foo: 'bar' })
        } else if (req.query.nomessage) {
          api.respondFail(res)
        } else {
          api.respondFail(res, 'FAIL result')
        }
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondFail)
    })
    it('should return FAIL result with message', function (done) {
      request(app)
        .get('/fail')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.equal('FAIL result')
          done()
        })
    })
    it('should return FAIL result with no message', function (done) {
      request(app)
        .get('/fail?nomessage=true')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.be.undefined
          done()
        })
    })
    it('should return FAIL result with message and additional object', function (done) {
      request(app)
        .get('/fail?resultobj=true')
        .set('Accept', 'application/json')
        .expect(status.OK)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.equal('FAIL result with object')
          expect(res.body.foo).to.equal('bar')
          done()
        })
    })
  })
  describe('respondNotFound()', function () {
    before(function () {
      app.get('/notfound', function (req, res) {
        api.respondNotFound(res, 'Thing 123')
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondNotFound)
    })
    it('should return Not Found (404) status with FAIL result', function (done) {
      request(app)
        .get('/notfound')
        .set('Accept', 'application/json')
        .expect(status.NOT_FOUND)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.equal('Could not find Thing 123')
          done()
        })
    })
  })
  describe('respondBadRequest()', function () {
    before(function () {
      app.get('/badreq', function (req, res) {
        api.respondBadRequest(res, 'Invalid Request')
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondBadRequest)
    })
    it('should return Bad Request (400) status with FAIL result', function (done) {
      request(app)
        .get('/badreq')
        .set('Accept', 'application/json')
        .expect(status.BAD_REQUEST)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.equal('Invalid Request')
          done()
        })
    })
  })
  describe('respondUnauthorized()', function () {
    before(function () {
      app.get('/unauth', function (req, res) {
        api.respondUnauthorized(res, 'Invalid credentials')
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondUnauthorized)
    })
    it('should return Unauthorized (401) status with FAIL result', function (done) {
      request(app)
        .get('/unauth')
        .set('Accept', 'application/json')
        .expect(status.UNAUTHORIZED)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.equal('Invalid credentials')
          done()
        })
    })
  })
  describe('respondForbidden()', function () {
    before(function () {
      app.get('/forbid', function (req, res) {
        api.respondForbidden(res, 'Thing 123')
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondForbidden)
    })
    it('should return Forbidden (403) status with FAIL result', function (done) {
      request(app)
        .get('/forbid')
        .set('Accept', 'application/json')
        .expect(status.FORBIDDEN)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.equal('Not authorized to access Thing 123')
          done()
        })
    })
  })
  describe('respondServerError()', function () {
    before(function () {
      app.get('/servererror', function (req, res) {
        api.respondServerError(res, 'Something exploded')
      })
    })
    it('should throw an error if passed something besides a result object', function () {
      helper.expectErrorWithBadResultObject(api.respondServerError)
    })
    it('should return 500 status with FAIL result', function (done) {
      request(app)
        .get('/servererror')
        .set('Accept', 'application/json')
        .expect(status.INTERNAL_SERVER_ERROR)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.equal('Something exploded')
          done()
        })
    })
  })
})

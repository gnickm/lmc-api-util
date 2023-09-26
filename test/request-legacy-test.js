// --------------------------------------------------------------------------
// Copyright (C) 2016-2023 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */

'use strict'

const express = require('express')
const request = require('supertest')
const status = require('http-status-codes')
const expect = require('chai').expect

const api = require('../')

// --------------------------------------------------------------------------

const app = express()

describe('lmc-api-util - checkRequired() [legacy function]', function () {
  before(function () {
    app.get('/checkreq', function (req, res) {
      if (api.checkRequired(res, req.query, ['foo', 'bar', 'baz'])) {
        api.makeOk(res, 'Params OK')
      }
    })
  })
  it('should return OK if has all required params', function (done) {
    request(app)
      .get('/checkreq?foo=1&bar=2&baz=3')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res.body.result).to.equal('OK')
        expect(res.body.message).to.equal('Params OK')
        done()
      })
  })
  it('should return Bad Request (400) if missing one param', function (done) {
    request(app)
      .get('/checkreq?bar=2&baz=3')
      .set('Accept', 'application/json')
      .expect(status.BAD_REQUEST)
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res.body.result).to.equal('FAIL')
        expect(res.body.message).to.equal('Missing required parameter: foo')
        done()
      })
  })
  it('should return all missing params in message', function (done) {
    request(app)
      .get('/checkreq')
      .set('Accept', 'application/json')
      .expect(status.BAD_REQUEST)
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res.body.result).to.equal('FAIL')
        expect(res.body.message).to.have.string('Missing required parameters:')
        expect(res.body.message).to.have.string('foo')
        expect(res.body.message).to.have.string('bar')
        expect(res.body.message).to.have.string('baz')
        done()
      })
  })
})

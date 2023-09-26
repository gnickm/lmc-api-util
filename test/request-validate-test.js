// --------------------------------------------------------------------------
// Copyright (C) 2016-2021 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
'use strict'

const express = require('express')
const request = require('supertest')
const status = require('http-status-codes').StatusCodes
const _ = require('lodash')
const expect = require('chai').expect
const Chance = require('chance')

const api = require('..')

// --------------------------------------------------------------------------

const app = express()
const chance = new Chance()

describe('lmc-api-util - validateRequest()', function () {
  describe('Call Type Checking', function () {
    it('should return true with no requirements', function () {
      expect(api.validateRequest({})).to.be.true
    })

    it('should throw an Error if the request values are not set', function () {
      expect(function () {
        api.validateRequest()
      }).to.throw('Request values must be specified as an object')
    })

    it('should throw an Error if the request values are not an object', function () {
      expect(function () {
        api.validateRequest(123)
      }).to.throw('Request values must be specified as an object')
      expect(function () {
        api.validateRequest(true)
      }).to.throw('Request values must be specified as an object')
      expect(function () {
        api.validateRequest('foo')
      }).to.throw('Request values must be specified as an object')
      expect(function () {
        api.validateRequest(_.noop)
      }).to.throw('Request values must be specified as an object')
    })
  })

  describe('Required Values', function () {
    it('should return true if request has all the requirements', function () {
      expect(api.validateRequest({
        foo: 'bar',
        baz: 'zip',
        stuff: 'woo'
      }, ['foo', 'baz'])).to.be.true
    })

    it('should throw an error if request does not have all the requirements', function () {
      expect(function () {
        api.validateRequest({ foo: 'bar' }, ['foo', 'baz'])
      }).to.throw('Missing required parameter')
    })

    it('should throw an error if request does not have any of the requirements', function () {
      expect(function () {
        api.validateRequest({}, ['foo', 'baz'])
      }).to.throw('Missing required parameters')
    })

    it('should throw an error if request does not validated requirements', function () {
      expect(function () {
        api.validateRequest({}, { foo: api.VALIDATE_EMAIL })
      }).to.throw('Missing required parameter')
    })
  })

  describe('Validation', function () {
    it('should throw an error if validation type is unknown', function () {
      expect(function () {
        api.validateRequest({ foo: chance.email() }, { foo: 'bogus validation' })
      }).to.throw('Unknown parameter validator')
    })

    it('should return true if request has requirements and correct email type', function () {
      expect(api.validateRequest({ foo: chance.email() }, { foo: api.VALIDATE_EMAIL })).to.be.true
    })

    it('should throw an error if request has requirements and incorrect email type', function () {
      expect(function () {
        api.validateRequest({ foo: '*** not an email address ***' }, { foo: api.VALIDATE_EMAIL })
      }).to.throw('must be a valid email address')
    })

    it('should return true if request has requirements and correct UUID type', function () {
      expect(api.validateRequest({ bar: chance.guid() }, { bar: api.VALIDATE_UUID })).to.be.true
    })

    it('should throw an error if request has requirements and incorrect UUID type', function () {
      expect(function () {
        api.validateRequest({ bar: '*** not a UUID ***' }, { bar: api.VALIDATE_UUID })
      }).to.throw('must be a valid UUID')
    })

    it('should return true if request has requirements and correct UUID type', function () {
      expect(api.validateRequest({ notempty: chance.string() }, { notempty: api.VALIDATE_NOT_EMPTY })).to.be.true
    })

    it('should throw an error if request has requirements and incorrect UUID type', function () {
      expect(function () {
        api.validateRequest({ notempty: '' }, { notempty: api.VALIDATE_NOT_EMPTY })
      }).to.throw('must not be empty')
    })
  })

  describe('End-to-End Functionality', function () {
    before(function () {
      app.get('/validate', function (req, res) {
        try {
          api.validateRequest(req.query, {
            email: api.VALIDATE_EMAIL,
            uuid: api.VALIDATE_UUID,
            notnull: api.VALIDATE_NOT_EMPTY
          })
          api.makeOk(res, 'Params OK')
        } catch (err) {
          api.respondBadRequest(res, err.message)
        }
      })
    })

    it('should return OK if query validates', function (done) {
      request(app)
        .get('/validate?email=' + chance.email() + '&uuid=' + chance.guid() + '&notnull=whatever')
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
        .get('/validate?email=' + chance.email() + '&notnull=whatever')
        .set('Accept', 'application/json')
        .expect(status.BAD_REQUEST)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.have.string('Missing required parameter:')
          expect(res.body.message).to.have.string('uuid')
          done()
        })
    })

    it('should return all missing params in message', function (done) {
      request(app)
        .get('/validate')
        .set('Accept', 'application/json')
        .expect(status.BAD_REQUEST)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.have.string('Missing required parameters:')
          expect(res.body.message).to.have.string('email')
          expect(res.body.message).to.have.string('uuid')
          expect(res.body.message).to.have.string('notnull')
          done()
        })
    })

    it('should return bad request if value is invalid', function (done) {
      request(app)
        .get('/validate?email=bogus&uuid=' + chance.guid() + '&notnull=whatever')
        .set('Accept', 'application/json')
        .expect(status.BAD_REQUEST)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.have.string('must be a valid email address')
          done()
        })
    })

    it('should return bad request if value empty', function (done) {
      request(app)
        .get('/validate?email=' + chance.email() + '&uuid=' + chance.guid() + '&notnull=')
        .set('Accept', 'application/json')
        .expect(status.BAD_REQUEST)
        .end(function (err, res) {
          expect(err).to.be.null
          expect(res.body.result).to.equal('FAIL')
          expect(res.body.message).to.have.string('must not be empty')
          done()
        })
    })
  })
})

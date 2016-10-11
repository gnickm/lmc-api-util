// --------------------------------------------------------------------------
// Copyright (C) 2016 Nick Mitchell
// MIT Licensed
// --------------------------------------------------------------------------
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
'use strict';

const express    = require('express');
const request    = require('supertest');
const HttpStatus = require('http-status-codes');
const expect     = require('chai').expect;

const api = require('../');

// --------------------------------------------------------------------------

var app = express();

describe('lmc-api-util', function() {
	describe('makeOk()', function() {
		before(function() {
			app.get('/ok', function(req, res) {
				if(req.query.resultobj) {
					api.makeOk(res, 'OK result with object', {foo: 'bar'});
				} else {
					api.makeOk(res, 'OK result');
				}
			});
		});
		it('should return OK result with message', function(done) {
			request(app)
				.get('/ok')
				.set('Accept', 'application/json')
				.expect(HttpStatus.OK)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('OK');
					expect(res.body.message).to.equal('OK result');
					done();
				});
		});
		it('should return OK result with message and additional object', function(done) {
			request(app)
				.get('/ok?resultobj=true')
				.set('Accept', 'application/json')
				.expect(HttpStatus.OK)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('OK');
					expect(res.body.message).to.equal('OK result with object');
					expect(res.body.foo).to.equal('bar');
					done();
				});
		});
	});
	describe('makeFail()', function() {
		before(function() {
			app.get('/fail', function(req, res) {
				if(req.query.resultobj) {
					api.makeFail(res, 'FAIL result with object', {foo: 'bar'});
				} else {
					api.makeFail(res, 'FAIL result');
				}
			});
		});
		it('should return FAIL result with message', function(done) {
			request(app)
				.get('/fail')
				.set('Accept', 'application/json')
				.expect(HttpStatus.OK)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('FAIL');
					expect(res.body.message).to.equal('FAIL result');
					done();
				});
		});
		it('should return FAIL result with message and additional object', function(done) {
			request(app)
				.get('/fail?resultobj=true')
				.set('Accept', 'application/json')
				.expect(HttpStatus.OK)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('FAIL');
					expect(res.body.message).to.equal('FAIL result with object');
					expect(res.body.foo).to.equal('bar');
					done();
				});
		});
	});
	describe('makeBadRequest()', function() {
		before(function() {
			app.get('/badreq', function(req, res) {
				api.makeBadRequest(res, 'Invalid Request');
			});
		});
		it('should return Bad Request (400) status with FAIL result', function(done) {
			request(app)
				.get('/badreq')
				.set('Accept', 'application/json')
				.expect(HttpStatus.BAD_REQUEST)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('FAIL');
					expect(res.body.message).to.equal('Invalid Request');
					done();
				});
		});
	});
	describe('checkRequired()', function() {
		before(function() {
			app.get('/checkreq', function(req, res) {
				if(api.checkRequired(res, req.query, ['foo', 'bar', 'baz'])) {
					api.makeOk(res, 'Params OK');
				}
			});
		});
		it('should return OK if has all required params', function(done) {
			request(app)
				.get('/checkreq?foo=1&bar=2&baz=3')
				.set('Accept', 'application/json')
				.expect(HttpStatus.OK)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('OK');
					expect(res.body.message).to.equal('Params OK');
					done();
				});
		});
		it('should return Bad Request (400) if missing one param', function(done) {
			request(app)
				.get('/checkreq?bar=2&baz=3')
				.set('Accept', 'application/json')
				.expect(HttpStatus.BAD_REQUEST)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('FAIL');
					expect(res.body.message).to.equal('Missing required parameter: foo');
					done();
				});
		});
		it('should return all missing params in message', function(done) {
			request(app)
				.get('/checkreq')
				.set('Accept', 'application/json')
				.expect(HttpStatus.BAD_REQUEST)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('FAIL');
					expect(res.body.message).to.have.string('Missing required parameters:');
					expect(res.body.message).to.have.string('foo');
					expect(res.body.message).to.have.string('bar');
					expect(res.body.message).to.have.string('baz');
					done();
				});
		});
	});
});

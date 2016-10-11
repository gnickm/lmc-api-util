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

describe('lmc-api-util - make() functions', function() {
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
	describe('makeFound()', function() {
		before(function() {
			app.get('/found', function(req, res) {
				api.makeFound(res, 'Thing 123', {stuff: 'junk'});
			});
		});
		it('should return OK with "Found" message', function(done) {
			request(app)
				.get('/found')
				.set('Accept', 'application/json')
				.expect(HttpStatus.OK)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('OK');
					expect(res.body.message).to.equal('Found Thing 123');
					expect(res.body.stuff).to.equal('junk');
					done();
				});
		});
	});
	describe('makeFoundZero()', function() {
		before(function() {
			app.get('/foundzero', function(req, res) {
				api.makeFoundZero(res, 'Things', {stuff: 'junk'});
			});
		});
		it('should return OK with "Found zero" message', function(done) {
			request(app)
				.get('/foundzero')
				.set('Accept', 'application/json')
				.expect(HttpStatus.OK)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('OK');
					expect(res.body.message).to.equal('Found zero Things');
					expect(res.body.stuff).to.equal('junk');
					done();
				});
		});
	});
	describe('makeCreated()', function() {
		before(function() {
			app.get('/created', function(req, res) {
				api.makeCreated(res, 'Thing 123', {
					location: '/created/123',
					stuff: 'junk'
				});
			});
		});
		it('should return CREATED status with "Created new" message and location header', function(done) {
			request(app)
				.get('/created')
				.set('Accept', 'application/json')
				.expect(HttpStatus.CREATED)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.header.location).to.equal('/created/123');
					expect(res.body.result).to.equal('OK');
					expect(res.body.message).to.equal('Created new Thing 123');
					expect(res.body.location).to.equal('/created/123');
					expect(res.body.stuff).to.equal('junk');
					done();
				});
		});
	});
	describe('makeUpdated()', function() {
		before(function() {
			app.get('/updated', function(req, res) {
				api.makeUpdated(res, 'Thing 123', {
					location: '/updated/123',
					stuff: 'junk'
				});
			});
		});
		it('should return OK status with "Updated" message and location header', function(done) {
			request(app)
				.get('/updated')
				.set('Accept', 'application/json')
				.expect(HttpStatus.OK)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.header.location).to.equal('/updated/123');
					expect(res.body.result).to.equal('OK');
					expect(res.body.message).to.equal('Updated Thing 123');
					expect(res.body.location).to.equal('/updated/123');
					expect(res.body.stuff).to.equal('junk');
					done();
				});
		});
	});
	describe('makeDeleted()', function() {
		before(function() {
			app.get('/deleted', function(req, res) {
				api.makeDeleted(res, 'Thing 123', {stuff: 'junk'});
			});
		});
		it('should return OK with "Deleted" message', function(done) {
			request(app)
				.get('/deleted')
				.set('Accept', 'application/json')
				.expect(HttpStatus.OK)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('OK');
					expect(res.body.message).to.equal('Deleted Thing 123');
					expect(res.body.stuff).to.equal('junk');
					done();
				});
		});
	});
	describe('makeNotFound()', function() {
		before(function() {
			app.get('/notfound', function(req, res) {
				api.makeNotFound(res, 'Thing 123');
			});
		});
		it('should return Not Found (404) status with FAIL result', function(done) {
			request(app)
				.get('/notfound')
				.set('Accept', 'application/json')
				.expect(HttpStatus.NOT_FOUND)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('FAIL');
					expect(res.body.message).to.equal('Could not find Thing 123');
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
	describe('makeServerError()', function() {
		before(function() {
			app.get('/servererror', function(req, res) {
				api.makeServerError(res, 'Something exploded');
			});
		});
		it('should return 500 status with FAIL result', function(done) {
			request(app)
				.get('/servererror')
				.set('Accept', 'application/json')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.body.result).to.equal('FAIL');
					expect(res.body.message).to.equal('Something exploded');
					done();
				});
		});
	});
});

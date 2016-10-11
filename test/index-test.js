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
	describe('makeOkResult()', function() {
		before(function() {
			app.get('/ok', function(req, res) {
				if(req.query.resultobj) {
					api.makeOkResult(res, 'OK result with object', {foo: 'bar'});
				} else {
					api.makeOkResult(res, 'OK result');
				}
			});
		});
		it('should return OK result with message', function(done) {
			request(app)
				.get('/ok')
				.set('Accept', 'application/json')
				.expect(200)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.status).to.equal(HttpStatus.OK);
					expect(res.body.result).to.equal('OK');
					expect(res.body.message).to.equal('OK result');
					done();
				});
		});
		it('should return OK result with message and additional object', function(done) {
			request(app)
				.get('/ok?resultobj=true')
				.set('Accept', 'application/json')
				.expect(200)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.status).to.equal(HttpStatus.OK);
					expect(res.body.result).to.equal('OK');
					expect(res.body.message).to.equal('OK result with object');
					expect(res.body.foo).to.equal('bar');
					done();
				});
		});
	});
	describe('makeFailResult()', function() {
		before(function() {
			app.get('/fail', function(req, res) {
				if(req.query.resultobj) {
					api.makeFailResult(res, 'FAIL result with object', {foo: 'bar'});
				} else {
					api.makeFailResult(res, 'FAIL result');
				}
			});
		});
		it('should return FAIL result with message', function(done) {
			request(app)
				.get('/fail')
				.set('Accept', 'application/json')
				.expect(200)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.status).to.equal(HttpStatus.OK);
					expect(res.body.result).to.equal('FAIL');
					expect(res.body.message).to.equal('FAIL result');
					done();
				});
		});
		it('should return FAIL result with message and additional object', function(done) {
			request(app)
				.get('/fail?resultobj=true')
				.set('Accept', 'application/json')
				.expect(200)
				.end(function(err, res) {
					expect(err).to.be.null;
					expect(res.status).to.equal(HttpStatus.OK);
					expect(res.body.result).to.equal('FAIL');
					expect(res.body.message).to.equal('FAIL result with object');
					expect(res.body.foo).to.equal('bar');
					done();
				});
		});
	});
});

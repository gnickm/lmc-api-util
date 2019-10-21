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

describe('lmc-api-util - makeFail() and children', function() {
    describe('makeFail()', function() {
        before(function() {
            app.get('/fail', function(req, res) {
                if(req.query.resultobj) {
                    api.makeFail(res, 'FAIL result with object', {foo: 'bar'});
                } else if(req.query.nomessage) {
                    api.makeFail(res);
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
        it('should return FAIL result with no message', function(done) {
            request(app)
                .get('/fail?nomessage=true')
                .set('Accept', 'application/json')
                .expect(HttpStatus.OK)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.result).to.equal('FAIL');
                    expect(res.body.message).to.be.undefined;
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
    describe('makeUnauthorized()', function() {
        before(function() {
            app.get('/unauth', function(req, res) {
                api.makeUnauthorized(res, 'Invalid credentials');
            });
        });
        it('should return Unauthorized (401) status with FAIL result', function(done) {
            request(app)
                .get('/unauth')
                .set('Accept', 'application/json')
                .expect(HttpStatus.UNAUTHORIZED)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.result).to.equal('FAIL');
                    expect(res.body.message).to.equal('Invalid credentials');
                    done();
                });
        });
    });
    describe('makeForbidden()', function() {
        before(function() {
            app.get('/forbid', function(req, res) {
                api.makeForbidden(res, 'Thing 123');
            });
        });
        it('should return Forbidden (403) status with FAIL result', function(done) {
            request(app)
                .get('/forbid')
                .set('Accept', 'application/json')
                .expect(HttpStatus.FORBIDDEN)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.result).to.equal('FAIL');
                    expect(res.body.message).to.equal('Not authorized to access Thing 123');
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

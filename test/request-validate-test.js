// --------------------------------------------------------------------------
// Copyright (C) 2016-2021 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
'use strict';

const _      = require('lodash');
const expect = require('chai').expect;

const api = require('..');

// --------------------------------------------------------------------------

describe('lmc-api-util - validateRequest()', function() {
    describe('Base functionality', function() {
        it('should return true with no requirements', function() {
            expect(api.validateQuery({})).to.be.true;
        });

        it('should throw an Error if the request values are not set', function() {
            expect(function() {
                api.validateQuery();
            }).to.throw('Request values must be specified as an object');
        });

        it('should throw an Error if the request values are not an object', function() {
            expect(function() {
                api.validateQuery(123);
            }).to.throw('Request values must be specified as an object');
            expect(function() {
                api.validateQuery(true);
            }).to.throw('Request values must be specified as an object');
            expect(function() {
                api.validateQuery('foo');
            }).to.throw('Request values must be specified as an object');
            expect(function() {
                api.validateQuery(_.noop);
            }).to.throw('Request values must be specified as an object');
        });
    });

    describe('Required values using array', function() {
        it('should return true if request has all the requirements', function() {
            expect(api.validateQuery({
                foo: 'bar',
                baz: 'zip',
                stuff: 'woo'
            }, ['foo', 'baz'])).to.be.true;
        });

        it('should throw an error if request does not have all the requirements', function() {
            expect(function() {
                api.validateQuery({foo: 'bar'}, ['foo', 'baz']);
            }).to.throw('Missing required parameter');
        });

        it('should throw an error if request does not have any of the requirements', function() {
            expect(function() {
                api.validateQuery({}, ['foo', 'baz']);
            }).to.throw('Missing required parameters');
        });
    });

    describe('Validation', function() {
        it('should return true if request has requirements and correct email type', function() {
            expect(api.validateQuery({foo: 'foo@bar.com'}, {foo: api.VALIDATE_EMAIL})).to.be.true;
        });

        it('should throw an error if request has requirements and incorrect email type', function() {
            expect(function() {
                api.validateQuery({foo: '*** not an email address ***'}, {foo: api.VALIDATE_EMAIL});
            }).to.throw('must be a valid email address');
        });
    });
});

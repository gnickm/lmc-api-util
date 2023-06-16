// --------------------------------------------------------------------------
// Copyright (C) 2016-2023 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
'use strict';

const _      = require('lodash');
const expect = require('chai').expect;
const Chance = require('chance');

const api = require('..');

// --------------------------------------------------------------------------

const chance = new Chance();

/* eslint-disable object-property-newline */

const TEST_OBJS = [
    {id: 1, group: 1, order: 'b', feels: 'bad', bool: true, uniq: chance.string()},
    {id: 2, group: 1, order: 'd', feels: 'bad', bool: 0, uniq: chance.string()},
    {id: 3, group: '2', order: 'f', feels: 'bad', bool: 'true', uniq: chance.string()},
    {id: 4, group: 2, order: 'a', feels: 'good', bool: 'false', uniq: chance.string()},
    {id: 5, group: 3, order: 'c', feels: 'good', bool: 1, uniq: chance.string()},
    {id: 6, group: '3', order: 'e', feels: 'good', bool: false, uniq: chance.string()}
];

/* eslint-enable object-property-newline */

const TEST_ATTRS = ['id', 'group', 'order', 'feels', 'bool', 'uniq'];

describe('lmc-api-util - Object Sort & Paging tests', function() {
    describe('sortObjects()', function() {
        it('should return natural order if empty query', function(done) {
            var objs = api.sortObjects(TEST_OBJS, TEST_ATTRS, {});

            expect(objs).to.have.lengthOf(6);
            expect(objs[0].id).to.equal(1);
            expect(objs[1].id).to.equal(2);
            expect(objs[2].id).to.equal(3);
            expect(objs[3].id).to.equal(4);
            expect(objs[4].id).to.equal(5);
            expect(objs[5].id).to.equal(6);
            done();
        });
        it('should return natural order if no order in query', function(done) {
            var objs = api.sortObjects(TEST_OBJS, TEST_ATTRS, {
                foo: 1,
                bar: 2,
                baz: 'zip',
                iam: null
            });

            expect(objs).to.have.lengthOf(6);
            expect(objs[0].id).to.equal(1);
            expect(objs[1].id).to.equal(2);
            expect(objs[2].id).to.equal(3);
            expect(objs[3].id).to.equal(4);
            expect(objs[4].id).to.equal(5);
            expect(objs[5].id).to.equal(6);
            done();
        });
        it('should return ascending order if specified', function(done) {
            var objs = api.sortObjects(TEST_OBJS, TEST_ATTRS, {'sort|order': 'asc'});

            expect(objs).to.have.lengthOf(6);
            expect(objs[0].id).to.equal(4);
            expect(objs[1].id).to.equal(1);
            expect(objs[2].id).to.equal(5);
            expect(objs[3].id).to.equal(2);
            expect(objs[4].id).to.equal(6);
            expect(objs[5].id).to.equal(3);
            done();
        });
        it('should return descending order if specified', function(done) {
            var objs = api.sortObjects(TEST_OBJS, TEST_ATTRS, {'sort|id': 'desc'});

            expect(objs).to.have.lengthOf(6);
            expect(objs[0].id).to.equal(6);
            expect(objs[1].id).to.equal(5);
            expect(objs[2].id).to.equal(4);
            expect(objs[3].id).to.equal(3);
            expect(objs[4].id).to.equal(2);
            expect(objs[5].id).to.equal(1);
            done();
        });
        it('should return order if several sorters specified', function(done) {
            var objs = api.sortObjects(TEST_OBJS, TEST_ATTRS, {
                'sort|id': 'desc|1',
                'sort|group': 'asc|2'
            });

            expect(objs).to.have.lengthOf(6);
            expect(objs[0].id).to.equal(2);
            expect(objs[1].id).to.equal(1);
            expect(objs[2].id).to.equal(4);
            expect(objs[3].id).to.equal(3);
            expect(objs[4].id).to.equal(6);
            expect(objs[5].id).to.equal(5);
            done();
        });
    });

    describe('pageObjects()', function() {
        it('should return single page for large page', function(done) {
            var paging = {
                pageSize: 10,
                page: 1
            };
            var objs = api.pageObjects(TEST_OBJS, paging);

            expect(objs).to.have.lengthOf(6);
            expect(paging.total).to.equal(6);
            expect(paging.hasMore).to.be.false;
            done();
        });
        it('should return multiple pages for medium page', function(done) {
            var paging = {
                pageSize: 5,
                page: 1
            };
            var objs = api.pageObjects(TEST_OBJS, paging);

            expect(objs).to.have.lengthOf(5);
            expect(paging.total).to.equal(6);
            expect(paging.hasMore).to.be.true;

            paging.page = 2;
            objs = api.pageObjects(TEST_OBJS, paging);

            expect(objs).to.have.lengthOf(1);
            expect(paging.total).to.equal(6);
            expect(paging.hasMore).to.be.false;

            done();
        });
        it('should return multiple pages for small page', function(done) {
            var paging = {
                pageSize: 2,
                page: 1
            };
            var objs = api.pageObjects(TEST_OBJS, paging);

            expect(objs).to.have.lengthOf(2);
            expect(paging.total).to.equal(6);
            expect(paging.hasMore).to.be.true;

            paging.page = 2;
            objs = api.pageObjects(TEST_OBJS, paging);

            expect(objs).to.have.lengthOf(2);
            expect(paging.total).to.equal(6);
            expect(paging.hasMore).to.be.true;

            paging.page = 3;
            objs = api.pageObjects(TEST_OBJS, paging);

            expect(objs).to.have.lengthOf(2);
            expect(paging.total).to.equal(6);
            expect(paging.hasMore).to.be.false;

            done();
        });
        it('should return correct pages for big page and dataset', function(done) {
            const BIG_TEST_OBJS = _.times(1234, Object);
            var paging = {};
            var objs = [];

            for(var page = 1; page < 7; page += 1) {
                paging = {
                    pageSize: 200,
                    page
                };
                objs = api.pageObjects(BIG_TEST_OBJS, paging);

                expect(objs).to.have.lengthOf(200);
                expect(paging.total).to.equal(1234);
                expect(paging.hasMore).to.be.true;
            }

            paging = {
                pageSize: 200,
                page: 7
            };
            objs = api.pageObjects(BIG_TEST_OBJS, paging);

            expect(objs).to.have.lengthOf(34);
            expect(paging.total).to.equal(1234);
            expect(paging.hasMore).to.be.false;

            done();
        });
    });
});

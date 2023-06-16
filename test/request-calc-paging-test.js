// --------------------------------------------------------------------------
// Copyright (C) 2016-2021 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */

'use strict';

const expect = require('chai').expect;

const api = require('../');

// --------------------------------------------------------------------------

describe('lmc-api-util - calcPaging()', function() {
    it('should return basic paging with no params', function(done) {
        const paging = api.calcPaging({});

        expect(paging.page).to.equal(1);
        expect(paging.pageSize).to.equal(50);
        expect(paging.offset).to.equal(0);
        expect(paging.limit).to.equal(50);

        done();
    });
    it('should return correct offset for paging', function(done) {
        const paging = api.calcPaging({page: 3});

        expect(paging.page).to.equal(3);
        expect(paging.pageSize).to.equal(50);
        expect(paging.offset).to.equal(100);
        expect(paging.limit).to.equal(50);

        done();
    });
    it('should return correct offset for paging and page size', function(done) {
        const paging = api.calcPaging({
            page: 3,
            pageSize: 75
        });

        expect(paging.page).to.equal(3);
        expect(paging.pageSize).to.equal(75);
        expect(paging.offset).to.equal(150);
        expect(paging.limit).to.equal(75);

        done();
    });
    it('should adjust page size to default max', function(done) {
        const paging = api.calcPaging({pageSize: 999});

        expect(paging.page).to.equal(1);
        expect(paging.pageSize).to.equal(200);
        expect(paging.offset).to.equal(0);
        expect(paging.limit).to.equal(200);

        done();
    });
    it('should adjust page size to defined max', function(done) {
        const paging = api.calcPaging({pageSize: 999}, {maxPageSize: 500});

        expect(paging.page).to.equal(1);
        expect(paging.pageSize).to.equal(500);
        expect(paging.offset).to.equal(0);
        expect(paging.limit).to.equal(500);

        done();
    });
    it('should ignore zero values', function(done) {
        const paging = api.calcPaging({
            page: 0,
            pageSize: 0
        });

        expect(paging.page).to.equal(1);
        expect(paging.pageSize).to.equal(50);
        expect(paging.offset).to.equal(0);
        expect(paging.limit).to.equal(50);

        done();
    });
    it('should ignore negative values', function(done) {
        const paging = api.calcPaging({
            page: -5,
            pageSize: -3
        });

        expect(paging.page).to.equal(1);
        expect(paging.pageSize).to.equal(50);
        expect(paging.offset).to.equal(0);
        expect(paging.limit).to.equal(50);

        done();
    });
    it('should convert strings to integers', function(done) {
        const paging = api.calcPaging({
            page: '2',
            pageSize: '75'
        });

        expect(paging.page).to.equal(2);
        expect(paging.pageSize).to.equal(75);
        expect(paging.offset).to.equal(75);
        expect(paging.limit).to.equal(75);

        done();
    });
    it('should ignore bad string values', function(done) {
        const paging = api.calcPaging({
            page: 'foo',
            pageSize: 'bar'
        });

        expect(paging.page).to.equal(1);
        expect(paging.pageSize).to.equal(50);

        done();
    });
    it('should allow offset and limit to be directly passed', function(done) {
        const paging = api.calcPaging({
            offset: 24,
            limit: 12
        });

        expect(paging.offset).to.equal(24);
        expect(paging.limit).to.equal(12);
        expect(paging.pageSize).to.equal(12);

        // Best guess of this value
        expect(paging.page).to.equal(2);

        done();
    });
    it('should ignore offset and limit if pageSize and page are also passed in', function(done) {
        const paging = api.calcPaging({
            offset: 24,
            limit: 12,
            page: 3,
            pageSize: 25
        });

        expect(paging.page).to.equal(3);
        expect(paging.pageSize).to.equal(25);
        expect(paging.offset).to.equal(50);
        expect(paging.limit).to.equal(25);

        done();
    });
    it('should allow json-server _page and _limit values', function(done) {
        const paging = api.calcPaging({
            _page: 3,
            _limit: 12
        });

        expect(paging.page).to.equal(3);
        expect(paging.offset).to.equal(24);
        expect(paging.limit).to.equal(12);
        expect(paging.pageSize).to.equal(12);

        done();
    });
});

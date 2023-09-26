// --------------------------------------------------------------------------
// Copyright (c) 2023 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-undefined */
/* eslint-disable no-invalid-this */
'use strict'

const _ = require('lodash')
const expect = require('chai').expect
const moment = require('moment')

const { Op } = require('sequelize')

const api = require('..')

// --------------------------------------------------------------------------

const TEST_ATTRS = ['id', 'group', 'order', 'feels', 'bool', 'uniq', 'uuid', 'uuId']

const expectMomentsEqual = function (mom1, mom2) {
  expect(moment(mom1).unix()).to.equal(moment(mom2).unix())
}

describe('manager/api', function () {
  describe('appendFilterToQuery()', function () {
    it('should return empty where for empty query', function (done) {
      const query = api.appendFilterToQuery({}, TEST_ATTRS, {})

      expect(query.where).to.not.be.undefined
      expect(_.isEmpty(query.where)).to.be.true
      done()
    })
    it('should return empty where if no filter in query', function (done) {
      const query = api.appendFilterToQuery({}, TEST_ATTRS, {
        foo: 1,
        bar: 2,
        baz: 'zip',
        iam: null
      })

      expect(query.where).to.not.be.undefined
      expect(_.isEmpty(query.where)).to.be.true
      done()
    })
    it('should ignore filters not in attributes list', function (done) {
      const query = api.appendFilterToQuery({}, TEST_ATTRS, {
        'filter|foo': 1,
        'filter|bar': 2,
        'filter|baz': 'zip'
      })

      expect(query.where).to.not.be.undefined
      expect(_.isEmpty(query.where)).to.be.true
      done()
    })
    it('should return where for filters', function (done) {
      let query = api.appendFilterToQuery({}, TEST_ATTRS, { 'filter|group': 2 })

      expect(query.where).to.not.be.undefined
      expect(query.where.group).to.equal(2)

      // Shouldn't wreck existing filters
      query = api.appendFilterToQuery(query, TEST_ATTRS, { 'filter|feels': 'good' })
      expect(query.where).to.not.be.undefined
      expect(query.where.group).to.equal(2)
      expect(query.where.feels).to.equal('good')
      done()
    })
    it('should return combined list for multiple filters', function (done) {
      const query = api.appendFilterToQuery({}, TEST_ATTRS, { 'filter|group': [1, 2] })

      expect(query.where).to.not.be.undefined
      expect(query.where.group[Op.or]).to.deep.equal([1, 2])
      done()
    })
    it('should convert booleans / boolean strings to 1 and 0', function (done) {
      let query = api.appendFilterToQuery({}, TEST_ATTRS, { 'filter|bool': false })

      expect(query.where.bool).to.equal(0)

      query = api.appendFilterToQuery({}, TEST_ATTRS, { 'filter|bool': 'true' })
      expect(query.where.bool).to.equal(1)

      done()
    })
  })

  describe('appendDateRangeToQuery()', function () {
    it('should return empty where for empty query', function (done) {
      const query = api.appendDateRangeToQuery({}, 'dateTime', {})

      expect(query.where).to.not.be.undefined
      expect(_.isEmpty(query.where)).to.be.true
      done()
    })
    it('should return a greater that for the specified startDate', function (done) {
      const DATE = moment('2020-02-20', 'YYYY-MM-DD')
      const query = api.appendDateRangeToQuery({}, 'dateTime', { startDate: '2020-02-20' })

      expect(query.where).to.not.be.undefined
      expectMomentsEqual(query.where.dateTime[Op.gte], DATE.startOf('day'))
      done()
    })
    it('should return a between for the specified for forDate', function (done) {
      const DATE = moment('2020-02-20', 'YYYY-MM-DD')
      const query = api.appendDateRangeToQuery({}, 'dateTime', { forDate: '2020-02-20' })

      expect(query.where).to.not.be.undefined
      expectMomentsEqual(query.where.dateTime[Op.between][0], DATE.startOf('day'))
      expectMomentsEqual(query.where.dateTime[Op.between][1], DATE.endOf('day'))
      done()
    })
    it('should return a between for the specified for forMonth', function (done) {
      const MONTH_START = moment('2022-07-01', 'YYYY-MM-DD').startOf('day')
      const MONTH_END = moment('2022-07-31', 'YYYY-MM-DD').endOf('day')
      const query = api.appendDateRangeToQuery({}, 'dateTime', { forMonth: '2022-07' })

      expect(query.where).to.not.be.undefined
      expectMomentsEqual(query.where.dateTime[Op.between][0], MONTH_START)
      expectMomentsEqual(query.where.dateTime[Op.between][1], MONTH_END)
      done()
    })
    it('should return a between for the specified for range', function (done) {
      const START = moment('2020-02-20', 'YYYY-MM-DD').startOf('day')
      const END = moment('2020-02-27', 'YYYY-MM-DD').endOf('day')
      const query = api.appendDateRangeToQuery({}, 'dateTime', {
        startDate: '2020-02-20',
        endDate: '2020-02-27'
      })

      expect(query.where).to.not.be.undefined
      expectMomentsEqual(query.where.dateTime[Op.between][0], START)
      expectMomentsEqual(query.where.dateTime[Op.between][1], END)
      done()
    })
    it('should handle startDateTime/endDateTime as well', function (done) {
      const START = moment('2020-02-20 12:34:56', 'YYYY-MM-DD HH:mm:ss')
      const END = moment('2020-02-27 01:23:45', 'YYYY-MM-DD HH:mm:ss')
      const query = api.appendDateRangeToQuery({}, 'dateTime', {
        startDateTime: '2020-02-20 12:34:56',
        endDateTime: '2020-02-27 01:23:45'
      })

      expect(query.where).to.not.be.undefined
      expectMomentsEqual(query.where.dateTime[Op.between][0], START)
      expectMomentsEqual(query.where.dateTime[Op.between][1], END)
      done()
    })
  })

  describe('appendSearchToQuery()', function () {
    it('should return empty where for empty query', function (done) {
      const query = api.appendSearchToQuery({}, TEST_ATTRS, {})

      expect(query.where).to.not.be.undefined
      expect(_.isEmpty(query.where)).to.be.true
      done()
    })
    it('should return empty where if no search in query', function (done) {
      const query = api.appendSearchToQuery({}, TEST_ATTRS, {
        foo: 1,
        bar: 2,
        baz: 'zip',
        iam: null
      })

      expect(query.where).to.not.be.undefined
      expect(_.isEmpty(query.where)).to.be.true
      done()
    })
    it('should return where for search term', function (done) {
      const query = api.appendSearchToQuery({}, ['order', 'feels'], { search: 'thing' })

      expect(query.where).to.be.an('object')
      expect(query.where[Op.or]).to.be.an('array')
      expect(query.where[Op.or][0].order[Op.iLike]).to.equal('%thing%')
      expect(query.where[Op.or][1].feels[Op.iLike]).to.equal('%thing%')
      done()
    })
  })

  describe('appendSortToQuery()', function () {
    it('should return natural order if empty query', function (done) {
      const query = api.appendSortToQuery({}, TEST_ATTRS, {})

      expect(query.order).to.be.undefined
      done()
    })
    it('should return natural order if no order in query', function (done) {
      const query = api.appendSortToQuery({}, TEST_ATTRS, {
        foo: 1,
        bar: 2,
        baz: 'zip',
        iam: null
      })

      expect(query.order).to.be.undefined
      done()
    })
    it('should return ascending order if specified', function (done) {
      const query = api.appendSortToQuery({}, TEST_ATTRS, { 'sort|order': 'asc' })

      expect(query.order).to.have.lengthOf(1)
      expect(query.order[0][0]).to.equal('order')
      expect(query.order[0][1]).to.equal('ASC')
      done()
    })

    it('should overwrite order in query', function (done) {
      const query = api.appendSortToQuery({ order: [] }, TEST_ATTRS, { 'sort|id': 'desc' })

      expect(query.order).to.have.lengthOf(1)
      expect(query.order[0][0]).to.equal('id')
      expect(query.order[0][1]).to.equal('DESC')
      done()
    })
    it('should return order if several sorters specified', function (done) {
      const query = api.appendSortToQuery({}, TEST_ATTRS, {
        'sort|group': 'asc|2',
        'sort|id': 'desc|1'
      })

      expect(query.order).to.have.lengthOf(2)
      expect(query.order[0][0]).to.equal('id')
      expect(query.order[0][1]).to.equal('DESC')
      expect(query.order[1][0]).to.equal('group')
      expect(query.order[1][1]).to.equal('ASC')
      done()
    })
  })
})

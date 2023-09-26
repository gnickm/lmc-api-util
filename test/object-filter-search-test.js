// --------------------------------------------------------------------------
// Copyright (C) 2016-2023 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
'use strict'

const expect = require('chai').expect
const Chance = require('chance')

const api = require('..')

// --------------------------------------------------------------------------

const chance = new Chance()

/* eslint-disable object-property-newline */

const TEST_OBJS = [
  { id: 1, group: 1, order: 'b', feels: 'bad', bool: true, uniq: chance.string(), obj: { val: 'a' } },
  { id: 2, group: 1, order: 'd', feels: 'bad', bool: 0, uniq: chance.string(), obj: { val: 'b' } },
  { id: 3, group: '2', order: 'f', feels: 'bad', bool: 'true', uniq: chance.string(), obj: { val: 'a' } },
  { id: 4, group: 2, order: 'a', feels: 'good', bool: 'false', uniq: chance.string(), obj: { val: 'b' } },
  { id: 5, group: 3, order: 'c', feels: 'good', bool: 1, uniq: chance.string(), obj: { val: 'a' } },
  { id: 6, group: '3', order: 'e', feels: 'good', bool: false, uniq: chance.string(), obj: { val: 'b' } }
]

/* eslint-enable object-property-newline */

const TEST_ATTRS = ['id', 'group', 'order', 'feels', 'bool', 'uniq', 'obj.val']

describe('lmc-api-util - Object Filter & Search tests', function () {
  describe('filterObjects()', function () {
    it('should return full list if empty query and attributes', function (done) {
      const objs = api.filterObjects(TEST_OBJS, null, {})

      expect(objs).to.have.lengthOf(6)
      done()
    })
    it('should return full list if no filter in query', function (done) {
      const objs = api.filterObjects(TEST_OBJS, TEST_ATTRS, {
        foo: 1,
        bar: 2,
        baz: 'zip',
        iam: null
      })

      expect(objs).to.have.lengthOf(6)
      done()
    })
    it('should ignore filters not in attributes list', function (done) {
      const objs = api.filterObjects(TEST_OBJS, TEST_ATTRS, {
        'filter|foo': 1,
        'filter|bar': 2,
        'filter|baz': 'zip'
      })

      expect(objs).to.have.lengthOf(6)
      done()
    })
    it('should apply filters if attributes list is empty', function (done) {
      const objs = api.filterObjects(TEST_OBJS, null, {
        'filter|foo': 1,
        'filter|bar': 2,
        'filter|baz': 'zip'
      })

      expect(objs).to.have.lengthOf(0)
      done()
    })
    it('should return filtered list for single filter', function (done) {
      let objs = api.filterObjects(TEST_OBJS, TEST_ATTRS, { 'filter|group': 2 })

      expect(objs).to.have.lengthOf(2)

      objs = api.filterObjects(TEST_OBJS, TEST_ATTRS, { 'filter|id': 2 })
      expect(objs).to.have.lengthOf(1)

      objs = api.filterObjects(TEST_OBJS, TEST_ATTRS, { 'filter|feels': 'good' })
      expect(objs).to.have.lengthOf(3)

      done()
    })
    it('should return combined list for multiple filters', function (done) {
      const objs = api.filterObjects(TEST_OBJS, TEST_ATTRS, { 'filter|group': [1, 2] })

      expect(objs).to.have.lengthOf(4)

      done()
    })
    it('should handle booleans as native or string filters', function (done) {
      let objs = api.filterObjects(TEST_OBJS, TEST_ATTRS, { 'filter|bool': false })

      expect(objs).to.have.lengthOf(3)

      objs = api.filterObjects(TEST_OBJS, TEST_ATTRS, { 'filter|bool': 'true' })
      expect(objs).to.have.lengthOf(3)

      done()
    })
    it('should handle deep searches with and without attributes', function (done) {
      let objs = api.filterObjects(TEST_OBJS, null, { 'filter|obj.val': 'a' })

      expect(objs).to.have.lengthOf(3)
      expect(objs[0].id).to.equal(1)
      expect(objs[1].id).to.equal(3)
      expect(objs[2].id).to.equal(5)

      objs = api.filterObjects(TEST_OBJS, TEST_ATTRS, { 'filter|obj.val': 'b' })
      expect(objs).to.have.lengthOf(3)
      expect(objs[0].id).to.equal(2)
      expect(objs[1].id).to.equal(4)
      expect(objs[2].id).to.equal(6)

      done()
    })
    it('should return empty list for no matches', function (done) {
      const objs = api.filterObjects(TEST_OBJS, TEST_ATTRS, { 'filter|group': 4 })

      expect(objs).to.have.lengthOf(0)

      done()
    })
  })

  describe('searchObjects()', function () {
    it('should return full list with no search terms', function (done) {
      const objs = api.searchObjects(TEST_OBJS, TEST_ATTRS, {})

      expect(objs).to.have.lengthOf(6)
      done()
    })
    it('should return partial list with search term', function (done) {
      const objs = api.searchObjects(TEST_OBJS, ['feels'], { search: 'goo' })

      expect(objs).to.have.lengthOf(3)
      expect(objs[0].id).to.equal(4)
      expect(objs[1].id).to.equal(5)
      expect(objs[2].id).to.equal(6)
      done()
    })
    it('should ignore case of search term search term', function (done) {
      const objs = api.searchObjects(TEST_OBJS, ['feels'], { search: 'BAD' })

      expect(objs).to.have.lengthOf(3)
      expect(objs[0].id).to.equal(1)
      expect(objs[1].id).to.equal(2)
      expect(objs[2].id).to.equal(3)
      done()
    })
    it('should return partial list with multiple attributes', function (done) {
      const objs = api.searchObjects(TEST_OBJS, ['feels', 'order'], { search: 'a' })

      expect(objs).to.have.lengthOf(4)
      expect(objs[0].id).to.equal(1)
      expect(objs[1].id).to.equal(2)
      expect(objs[2].id).to.equal(3)
      expect(objs[3].id).to.equal(4)
      done()
    })
    it('should allow for deep searching', function (done) {
      const objs = api.searchObjects(TEST_OBJS, ['obj.val'], { search: 'a' })

      expect(objs).to.have.lengthOf(3)
      expect(objs[0].id).to.equal(1)
      expect(objs[1].id).to.equal(3)
      expect(objs[2].id).to.equal(5)
      done()
    })
    it('should return empty list with search term with no matches', function (done) {
      const objs = api.searchObjects(TEST_OBJS, ['feels'], { search: 'none' })

      expect(objs).to.have.lengthOf(0)
      done()
    })
  })
})

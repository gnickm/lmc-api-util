// --------------------------------------------------------------------------
// Copyright (c) 2016-2021 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
'use strict';

const _      = require('lodash');
const expect = require('chai').expect;

// --------------------------------------------------------------------------

const expectErrorWithBadResultObject = function(func) {
	expect(function() {
		func();
	}).to.throw(Error);

	expect(function() {
		func(123);
	}).to.throw(Error);

	expect(function() {
		func('foo');
	}).to.throw(Error);

	expect(function() {
		func(_.noop);
	}).to.throw(Error);

	expect(function() {
		func({json: _.noop});
	}).to.throw(Error);
};

module.exports.expectErrorWithBadResultObject = expectErrorWithBadResultObject;

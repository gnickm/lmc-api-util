// --------------------------------------------------------------------------
// Copyright (C) 2016 Nick Mitchell
// MIT Licensed
// --------------------------------------------------------------------------
'use strict';

const _          = require('lodash');
const HttpStatus = require('http-status-codes');

// --------------------------------------------------------------------------

var makeOkResult = function(res, msg, resultObj) {
	res.json(_.assignIn({
		result: 'OK',
		message: msg
	}, resultObj));
};

var makeFailResult = function(res, msg, resultObj) {
	res.json(_.assignIn({
		result: 'FAIL',
		message: msg
	}, resultObj));
};

var makeInvalidRequestResult = function(res, msg) {
	// Return 400 - Bad Request
	res.status(HttpStatus.BAD_REQUEST);
	makeFailResult(msg);
};

var checkRequiredFields = function(res, obj, fields) {
    var passed = true;

    _.forEach(fields, function(field) {
		if(!_.has(obj, field)) {
			makeInvalidRequestResult(res, 'Missing required field: ' + field);
			passed = false;
		}
	});

	return passed;
};

module.exports.makeOkResult = makeOkResult;
module.exports.makeFailResult = makeFailResult;
module.exports.makeInvalidRequestResult = makeInvalidRequestResult;
module.exports.checkRequiredFields = checkRequiredFields;


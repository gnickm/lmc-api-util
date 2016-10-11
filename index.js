// --------------------------------------------------------------------------
// Copyright (C) 2016 Nick Mitchell
// MIT Licensed
// --------------------------------------------------------------------------
'use strict';

const _          = require('lodash');
const HttpStatus = require('http-status-codes');

// --------------------------------------------------------------------------

var makeOk = function(res, msg, resultObj) {
	res.json(_.assignIn({
		result: 'OK',
		message: msg
	}, resultObj));
};

var makeFail = function(res, msg, resultObj) {
	res.json(_.assignIn({
		result: 'FAIL',
		message: msg
	}, resultObj));
};

var makeBadRequest = function(res, msg) {
	// Return 400 - Bad Request
	res.status(HttpStatus.BAD_REQUEST);
	makeFail(res, msg);
};

var checkRequired = function(res, params, required) {
	var missing = [];

    _.forEach(required, function(requiredParam) {
		if(!_.has(params, requiredParam)) {
			missing.push(requiredParam);
		}
	});
	
	if(missing.length === 1) {
		makeBadRequest(res, 'Missing required parameter: ' + missing[0]);
	} else if(missing.length > 1) {
		makeBadRequest(res, 'Missing required parameters: ' + _.join(missing, ','));
	}

	return missing.length === 0;
};

module.exports.makeOk = makeOk;
module.exports.makeFail = makeFail;
module.exports.makeBadRequest = makeBadRequest;
module.exports.checkRequired = checkRequired;


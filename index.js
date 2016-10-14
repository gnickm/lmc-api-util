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

var makeFound = function(res, itemDesc, resultObj) {
	// Return 200 - OK
	res.status(HttpStatus.OK);
	makeOk(res, 'Found ' + itemDesc, resultObj);
};

var makeFoundZero = function(res, itemDesc, resultObj) {
	// Return 200 - OK
	// NOTE: 204 is not valid here, since we're actually returning
	// content within the message response.
	res.status(HttpStatus.OK);
	makeOk(res, 'Found zero ' + itemDesc, resultObj);
};

var makeCreated = function(res, itemDesc, resultObj) {
	// Return 201 - Created
	res.status(HttpStatus.CREATED);
	if(_.has(resultObj, 'location')) {
		res.location(resultObj.location);
	}
	makeOk(res, 'Created new ' + itemDesc, resultObj);
};

var makeUpdated = function(res, itemDesc, resultObj) {
	// Return 200 - OK
	res.status(HttpStatus.OK);
	if(_.has(resultObj, 'location')) {
		res.location(resultObj.location);
	}
	makeOk(res, 'Updated ' + itemDesc, resultObj);
};

var makeDeleted = function(res, itemDesc, resultObj) {
	// Return 200 - OK
	res.status(HttpStatus.OK);
	makeOk(res, 'Deleted ' + itemDesc, resultObj);
};

var makeBadRequest = function(res, msg) {
	// Return 400 - Bad Request
	res.status(HttpStatus.BAD_REQUEST);
	makeFail(res, msg);
};

var makeForbidden = function(res, itemDesc) {
	// Return 403 - Forbidden
	res.status(HttpStatus.FORBIDDEN);
	makeFail(res, 'Not authorized to access ' + itemDesc);
};

var makeNotFound = function(res, itemDesc) {
	// Return 404 - Not Found
	res.status(HttpStatus.NOT_FOUND);
	makeFail(res, 'Could not find ' + itemDesc);
};

var makeServerError = function(res, msg) {
	// Return 500 - Internal Server Error
	res.status(HttpStatus.INTERNAL_SERVER_ERROR);
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
		makeBadRequest(res, 'Missing required parameters: ' + _.join(missing, ', '));
	}

	return missing.length === 0;
};

module.exports.makeOk = makeOk;
module.exports.makeFail = makeFail;
module.exports.makeFound = makeFound;
module.exports.makeFoundZero = makeFoundZero;
module.exports.makeCreated = makeCreated;
module.exports.makeUpdated = makeUpdated;
module.exports.makeDeleted = makeDeleted;
module.exports.makeBadRequest = makeBadRequest;
module.exports.makeForbidden = makeForbidden;
module.exports.makeNotFound = makeNotFound;
module.exports.makeServerError = makeServerError;
module.exports.checkRequired = checkRequired;


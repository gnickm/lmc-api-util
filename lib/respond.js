// --------------------------------------------------------------------------
// Copyright (c) 2016-2021 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------

'use strict';

const _          = require('lodash');
const http       = require('http');
const HttpStatus = require('http-status-codes');

// --------------------------------------------------------------------------

const throwErrorIfResponseObjectIsInvalid = function(res) {
    if(!res || !(res instanceof http.ServerResponse)) {
        throw new Error('Missing required express response object');
    }
};

const respondOk = function(res, msg, resultObj) {
    throwErrorIfResponseObjectIsInvalid(res);
    res.json(_.assignIn({
        result: 'OK',
        message: msg
    }, resultObj));
};

const respondFail = function(res, msg, resultObj) {
    throwErrorIfResponseObjectIsInvalid(res);
    res.json(_.assignIn({
        result: 'FAIL',
        message: msg
    }, resultObj));
};

const respondFound = function(res, itemDesc, resultObj) {
    res.status(HttpStatus.OK);
    respondOk(res, 'Found ' + itemDesc, resultObj);
};

const respondFoundZero = function(res, itemDesc, resultObj) {
    // NOTE: 204 is not valid here, since we're actually returning
    // content within the message response.
    res.status(HttpStatus.OK);
    respondOk(res, 'Found zero ' + itemDesc, resultObj);
};

const respondCreated = function(res, itemDesc, resultObj) {
    res.status(HttpStatus.CREATED);
    if(_.has(resultObj, 'location')) {
        res.location(resultObj.location);
    }
    respondOk(res, 'Created new ' + itemDesc, resultObj);
};

const respondUpdated = function(res, itemDesc, resultObj) {
    res.status(HttpStatus.OK);
    if(_.has(resultObj, 'location')) {
        res.location(resultObj.location);
    }
    respondOk(res, 'Updated ' + itemDesc, resultObj);
};

const respondDeleted = function(res, itemDesc, resultObj) {
    res.status(HttpStatus.OK);
    respondOk(res, 'Deleted ' + itemDesc, resultObj);
};

const respondBadRequest = function(res, msg) {
    res.status(HttpStatus.BAD_REQUEST);
    respondFail(res, msg);
};

const respondUnauthorized = function(res, msg) {
    res.status(HttpStatus.UNAUTHORIZED);
    respondFail(res, msg);
};

const respondForbidden = function(res, itemDesc) {
    res.status(HttpStatus.FORBIDDEN);
    respondFail(res, 'Not authorized to access ' + itemDesc);
};

const respondNotFound = function(res, itemDesc) {
    res.status(HttpStatus.NOT_FOUND);
    respondFail(res, 'Could not find ' + itemDesc);
};

const respondServerError = function(res, msg) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    respondFail(res, msg);
};

module.exports.respondOk = respondOk;
module.exports.respondFail = respondFail;
module.exports.respondFound = respondFound;
module.exports.respondFoundZero = respondFoundZero;
module.exports.respondCreated = respondCreated;
module.exports.respondUpdated = respondUpdated;
module.exports.respondDeleted = respondDeleted;
module.exports.respondBadRequest = respondBadRequest;
module.exports.respondUnauthorized = respondUnauthorized;
module.exports.respondForbidden = respondForbidden;
module.exports.respondNotFound = respondNotFound;
module.exports.respondServerError = respondServerError;

// export the "make" functions for 1.x backward compatibility
module.exports.makeOk = respondOk;
module.exports.makeFail = respondFail;
module.exports.makeFound = respondFound;
module.exports.makeFoundZero = respondFoundZero;
module.exports.makeCreated = respondCreated;
module.exports.makeUpdated = respondUpdated;
module.exports.makeDeleted = respondDeleted;
module.exports.makeBadRequest = respondBadRequest;
module.exports.makeUnauthorized = respondUnauthorized;
module.exports.makeForbidden = respondForbidden;
module.exports.makeNotFound = respondNotFound;
module.exports.makeServerError = respondServerError;

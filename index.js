// --------------------------------------------------------------------------
// Copyright (C) 2016-2022 Nick Mitchell
// MIT Licensed
// --------------------------------------------------------------------------

'use strict';

const _          = require('lodash');
const HttpStatus = require('http-status-codes').StatusCodes;

// --------------------------------------------------------------------------

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_MAX_PAGE_SIZE = 200;

const makeOk = function(res, msg, resultObj) {
    res.json(_.assignIn({
        result: 'OK',
        message: msg
    }, resultObj));
};

const makeFail = function(res, msg, resultObj) {
    res.json(_.assignIn({
        result: 'FAIL',
        message: msg
    }, resultObj));
};

const makeFound = function(res, itemDesc, resultObj) {
    // Return 200 - OK
    res.status(HttpStatus.OK);
    makeOk(res, 'Found ' + itemDesc, resultObj);
};

const makeFoundZero = function(res, itemDesc, resultObj) {
    // Return 200 - OK
    // NOTE: 204 is not valid here, since we're actually returning
    // content within the message response.
    res.status(HttpStatus.OK);
    makeOk(res, 'Found zero ' + itemDesc, resultObj);
};

const makeCreated = function(res, itemDesc, resultObj) {
    // Return 201 - Created
    res.status(HttpStatus.CREATED);
    if(_.has(resultObj, 'location')) {
        res.location(resultObj.location);
    }
    makeOk(res, 'Created new ' + itemDesc, resultObj);
};

const makeUpdated = function(res, itemDesc, resultObj) {
    // Return 200 - OK
    res.status(HttpStatus.OK);
    if(_.has(resultObj, 'location')) {
        res.location(resultObj.location);
    }
    makeOk(res, 'Updated ' + itemDesc, resultObj);
};

const makeDeleted = function(res, itemDesc, resultObj) {
    // Return 200 - OK
    res.status(HttpStatus.OK);
    makeOk(res, 'Deleted ' + itemDesc, resultObj);
};

const makeBadRequest = function(res, msg) {
    // Return 400 - Bad Request
    res.status(HttpStatus.BAD_REQUEST);
    makeFail(res, msg);
};

const makeUnauthorized = function(res, msg) {
    // Return 401 - Unauthorized
    res.status(HttpStatus.UNAUTHORIZED);
    makeFail(res, msg);
};

const makeForbidden = function(res, itemDesc) {
    // Return 403 - Forbidden
    res.status(HttpStatus.FORBIDDEN);
    makeFail(res, 'Not authorized to access ' + itemDesc);
};

const makeNotFound = function(res, itemDesc) {
    // Return 404 - Not Found
    res.status(HttpStatus.NOT_FOUND);
    makeFail(res, 'Could not find ' + itemDesc);
};

const makeServerError = function(res, msg) {
    // Return 500 - Internal Server Error
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    makeFail(res, msg);
};

const checkRequired = function(res, params, required) {
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

const calcPaging = function(params, options) {
    var opts = _.defaults({}, options, {maxPageSize: DEFAULT_MAX_PAGE_SIZE});
    var paging = _.defaults({}, params, {
        pageSize: DEFAULT_PAGE_SIZE,
        page: 1
    });

    // limit and offset can be passed in directly, in which case we use them
    // to calculate page and return it
    if(params.offset && params.limit && !params.page && !params.pageSize) {
        paging.offset = _.toSafeInteger(params.offset);
        paging.limit = _.toSafeInteger(params.limit);

        if(paging.offset && paging.limit) {
            paging.pageSize = paging.limit;
            paging.page = Math.floor(params.offset / paging.limit);

            return paging;
        }
    }

    paging.page = _.toSafeInteger(paging.page);
    paging.pageSize = _.toSafeInteger(paging.pageSize);

    if(paging.pageSize > opts.maxPageSize) {
        paging.pageSize = opts.maxPageSize;
    }

    if(paging.pageSize === false || paging.pageSize < 1) {
        paging.pageSize = DEFAULT_PAGE_SIZE;
    }

    if(paging.page === false || paging.page < 1) {
        paging.page = 1;
    }

    paging.offset = (paging.page - 1) * paging.pageSize;
    paging.limit = paging.pageSize;

    return paging;
};

module.exports.makeOk = makeOk;
module.exports.makeFail = makeFail;
module.exports.makeFound = makeFound;
module.exports.makeFoundZero = makeFoundZero;
module.exports.makeCreated = makeCreated;
module.exports.makeUpdated = makeUpdated;
module.exports.makeDeleted = makeDeleted;
module.exports.makeBadRequest = makeBadRequest;
module.exports.makeUnauthorized = makeUnauthorized;
module.exports.makeForbidden = makeForbidden;
module.exports.makeNotFound = makeNotFound;
module.exports.makeServerError = makeServerError;
module.exports.checkRequired = checkRequired;
module.exports.calcPaging = calcPaging;


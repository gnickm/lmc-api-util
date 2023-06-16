// --------------------------------------------------------------------------
// Copyright (C) 2016-2021 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------

'use strict';

const _         = require('lodash');
const validator = require('validator');

const respond = require('./respond');

// --------------------------------------------------------------------------

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_MAX_PAGE_SIZE = 200;

const VALIDATE_EMAIL    = 'email';
const VALIDATE_NOT_EMPTY = 'not-empty';
const VALIDATE_UUID     = 'uuid';

const validateRequestHasAllReqired = function(requestParams, required) {
    var missing = [];

    _.forEach(required, function(requiredParam) {
        if(!_.has(requestParams, requiredParam)) {
            missing.push(requiredParam);
        }
    });

    if(missing.length === 1) {
        throw new Error('Missing required parameter: ' + missing[0]);
    } else if(missing.length > 1) {
        throw new Error('Missing required parameters: ' + _.join(missing, ', '));
    }
};

const validateRequestHasAllCorrectValueTypes = function(requestParams, required) {
    _.forEach(required, function(paramType, paramName) {
        switch(paramType) {
            case VALIDATE_EMAIL:
                if(!validator.isEmail(requestParams[paramName])) {
                    throw new Error('Request parameter "' + paramName + '" must be a valid email address');
                }
                break;
            case VALIDATE_NOT_EMPTY:
                if(requestParams[paramName] === null || requestParams[paramName] === '') {
                    throw new Error('Request parameter "' + paramName + '" must not be empty');
                }
                break;
            case VALIDATE_UUID:
                if(!validator.isUUID(requestParams[paramName])) {
                    throw new Error('Request parameter "' + paramName + '" must be a valid UUID');
                }
                break;
            default:
                throw new Error('Unknown parameter validator for parameter "' + paramName + '"');
        }
    });
};

const validateRequest = function(requestParams, required) {
    if(!requestParams || !_.isPlainObject(requestParams)) {
        throw new Error('Request values must be specified as an object or array');
    }

    if(_.isArray(required)) {
        validateRequestHasAllReqired(requestParams, required);
    } else if(_.isPlainObject(required)) {
        validateRequestHasAllReqired(requestParams, _.keys(required));
        validateRequestHasAllCorrectValueTypes(requestParams, required);
    }

    return true;
};

const checkRequiredLegacy = function(res, params, required) {
    try {
        validateRequestHasAllReqired(params, required);

        return true;
    } catch(err) {
        respond.respondBadRequest(res, err.message);

        return false;
    }
};

/* eslint-disable no-underscore-dangle */

const normalizePagingParameters = function(params) {
    if(params._page && !params.page) {
        params.page = params._page;
    }

    if(params._limit && !params.pageSize) {
        params.pageSize = params._limit;
    }

    // Using offset/limit and page/pageSize are mutually exclusive
    if(params.offset && params.limit && !params.page && !params.pageSize) {
        params.offset = _.toSafeInteger(params.offset);
        params.limit = _.toSafeInteger(params.limit);

        if(params.offset && params.limit) {
            params.pageSize = params.limit;
            params.page = Math.floor(params.offset / params.limit);
        }
    } else {
        params.offset = null;
        params.limit = null;
    }

    return params;
};

/* eslint-enable no-underscore-dangle */

const calcPaging = function(inRequestParams, options) {
    var requestParams = normalizePagingParameters(inRequestParams);
    var opts = _.defaults({}, options, {maxPageSize: DEFAULT_MAX_PAGE_SIZE});
    var paging = _.defaults({}, requestParams, {
        pageSize: DEFAULT_PAGE_SIZE,
        page: 1
    });


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

    if(!paging.offset) {
        paging.offset = (paging.page - 1) * paging.pageSize;
    }
    paging.limit = paging.pageSize;

    return paging;
};

module.exports.checkRequired = checkRequiredLegacy;
module.exports.calcPaging = calcPaging;
module.exports.validateRequest = validateRequest;

module.exports.VALIDATE_EMAIL     = VALIDATE_EMAIL;
module.exports.VALIDATE_NOT_EMPTY = VALIDATE_NOT_EMPTY;
module.exports.VALIDATE_UUID      = VALIDATE_UUID;

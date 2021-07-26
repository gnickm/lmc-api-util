// --------------------------------------------------------------------------
// Copyright (C) 2016-2021 Nick Mitchell
// MIT Licensed
// --------------------------------------------------------------------------

'use strict';

const _ = require('lodash');

const respond = require('./respond');

// --------------------------------------------------------------------------

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_MAX_PAGE_SIZE = 200;

const checkRequired = function(res, params, required) {
    var missing = [];

    _.forEach(required, function(requiredParam) {
        if(!_.has(params, requiredParam)) {
            missing.push(requiredParam);
        }
    });

    if(missing.length === 1) {
        respond.respondBadRequest(res, 'Missing required parameter: ' + missing[0]);
    } else if(missing.length > 1) {
        respond.respondBadRequest(res, 'Missing required parameters: ' + _.join(missing, ', '));
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

module.exports.checkRequired = checkRequired;
module.exports.calcPaging = calcPaging;

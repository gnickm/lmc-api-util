// --------------------------------------------------------------------------
// Copyright (C) 2016-2021 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------

'use strict';

const _ = require('lodash');

// --------------------------------------------------------------------------

const pageObjects = function(allObjs, paging) {
    var pages = _.chunk(allObjs, paging.pageSize);
    var pagedObjs = [];

    paging.total = allObjs.length;
    paging.hasMore = false;
    if(pages.length > paging.page - 1) {
        pagedObjs = pages[paging.page - 1];
        paging.hasMore = paging.page <= pages.length - 1;
    }

    return pagedObjs;
};

const checkFilter = function(queryValue, attrib, obj) {
    if(_.isArray(queryValue)) {
        var result = false;

        queryValue.forEach(function(qv) {
            if(checkFilter(qv, attrib, obj)) {
                result = true;
            }
        });

        return result;
    }

    // If we get boolean or string boolean, we allow 1 and 0 to be
    // valid values for filtering
    if(queryValue === true || queryValue === 'true') {
        return obj[attrib] === true || obj[attrib] === 'true' || obj[attrib] === 1 || obj[attrib] === '1';
    } else if(queryValue === false || queryValue === 'false') {
        return obj[attrib] === false || obj[attrib] === 'false' || obj[attrib] === 0 || obj[attrib] === '0';
    }

    // Since filters come in as strings, compare the string values
    return obj[attrib] === queryValue || _.toString(queryValue) === _.toString(obj[attrib]);
};

const filterObjects = function(allObjs, attributes, requestParams) {
    var filteredObjs = allObjs;

    _.forEach(requestParams, function(reqValue, reqKey) {
        if(_.startsWith(reqKey, 'filter|')) {
            var chunks = _.split(reqKey, '|');

            if(_.indexOf(attributes, chunks[1]) >= 0) {
                var newList = [];

                filteredObjs.forEach(function(obj) {
                    if(checkFilter(reqValue, chunks[1], obj)) {
                        newList.push(obj);
                    }
                });

                filteredObjs = newList;
            }
        }
    });

    return filteredObjs;
};

const generateSorters = function(attributes, requestParams) {
    var sorters = [];

    _.forEach(requestParams, function(reqValue, reqKey) {
        // Skip anything that doesn't start with 'sort'
        if(_.startsWith(reqKey, 'sort|')) {
            var keyChunks = _.split(reqKey, '|');
            var valChunks = _.split(reqValue, '|');

            // Only use if legit attribute
            if(_.indexOf(attributes, keyChunks[1]) >= 0) {
                var sorter = {
                    attr: keyChunks[1],
                    dir: 'asc'
                };

                if(valChunks[0] === 'desc') {
                    sorter.dir = 'desc';
                }

                if(valChunks > 1) {
                    sorters[valChunks] = sorter;
                } else {
                    sorters.push(sorter);
                }
            }
        }
    });

    return sorters;
};

const sortObjects = function(allObjs, attributes, requestParams) {
    var sortedObjs = allObjs;
    var sorters = generateSorters(attributes, requestParams);

    if(sorters.length === 0) {
        return allObjs;
    }

    sorters.forEach(function(sorter) {
        sortedObjs = _.sortBy(sortedObjs, [sorter.attr]);
        if(sorter.dir === 'desc') {
            sortedObjs = _.reverse(sortedObjs);
        }
    });

    return sortedObjs;
};

module.exports.filterObjects = filterObjects;
module.exports.pageObjects = pageObjects;
module.exports.sortObjects = sortObjects;

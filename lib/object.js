// --------------------------------------------------------------------------
// Copyright (C) 2016-2023 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------

'use strict';

const _ = require('lodash');

const sort = require('./sort');

// --------------------------------------------------------------------------

const pageObjects = function(objs, paging) {
    var pages = _.chunk(objs, paging.pageSize);
    var pagedObjs = [];

    paging.total = objs.length;
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

const filterObjects = function(objs, attributes, query) {
    var filteredObjs = objs;

    _.forEach(query, function(queryValue, queryKey) {
        // Skip anything that doesn't start with 'filter'
        if(_.startsWith(queryKey, 'filter|')) {
            var chunks = _.split(queryKey, '|');

            // Only use if legit attribute
            if(_.indexOf(attributes, chunks[1]) >= 0) {
                // Previously used _.filter here, but had to roll our own
                // in order to be a little more flexible
                var newList = [];

                filteredObjs.forEach(function(obj) {
                    if(checkFilter(queryValue, chunks[1], obj)) {
                        newList.push(obj);
                    }
                });

                filteredObjs = newList;
            }
        }
    });

    return filteredObjs;
};

const searchObjects = function(objs, attributes, req) {
    var foundObjs = [];
    var searchTerms = [];

    _.forEach(req, function(queryValue, queryKey) {
        if(queryKey === 'search') {
            searchTerms.push(_.lowerCase(queryValue));
        }
    });

    // Early exit if no search terms
    if(searchTerms.length === 0) {
        return objs;
    }

    _.forEach(objs, (obj) => {
        var inSearch = false;

        for(var i = 0; i < attributes.length && !inSearch; i += 1) {
            for(var j = 0; j < attributes.length && !inSearch; j += 1) {
                if(_.lowerCase(_.toString(obj[attributes[i]])).includes(searchTerms[j])) {
                    inSearch = true;
                }
            }
        }

        if(inSearch) {
            foundObjs.push(obj);
        }
    });

    return foundObjs;
};

const sortObjects = function(allObjs, attributes, requestParams) {
    var sortedObjs = allObjs;
    var sorters = sort.generateSorters(attributes, requestParams);

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
module.exports.searchObjects = searchObjects;
module.exports.sortObjects = sortObjects;

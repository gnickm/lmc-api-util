// --------------------------------------------------------------------------
// Copyright (C) 2023 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------

'use strict';

const _ = require('lodash');

// --------------------------------------------------------------------------

const generateSorters = function(attributes, req) {
    var sorters = [];

    _.forEach(req, function(queryValue, queryKey) {
        // Skip anything that doesn't start with 'sort'
        if(_.startsWith(queryKey, 'sort|')) {
            var keyChunks = _.split(queryKey, '|');
            var valChunks = _.split(queryValue, '|');

            // Only use if legit attribute
            if(_.indexOf(attributes, keyChunks[1]) >= 0) {
                var sorter = {
                    attr: keyChunks[1],
                    dir: 'asc'
                };

                if(valChunks[0] === 'desc') {
                    sorter.dir = 'desc';
                }

                if(valChunks.length > 1) {
                    sorters[valChunks[1]] = sorter;
                } else {
                    sorters.push(sorter);
                }
            }
        }
    });

    return sorters;
};

module.exports.generateSorters = generateSorters;

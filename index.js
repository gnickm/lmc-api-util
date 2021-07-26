// --------------------------------------------------------------------------
// Copyright (c) 2016-2021 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------

'use strict';

const requestModule = require('./lib/request');
const respondModule = require('./lib/respond');

module.exports = Object.assign({}, requestModule, respondModule);

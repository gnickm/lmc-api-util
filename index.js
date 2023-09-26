// --------------------------------------------------------------------------
// Copyright (c) 2016-2023 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------

'use strict'

const objectModule = require('./lib/object')
const queryModule = require('./lib/query')
const requestModule = require('./lib/request')
const respondModule = require('./lib/respond')

module.exports = Object.assign(
  {},
  objectModule,
  queryModule,
  requestModule,
  respondModule
)

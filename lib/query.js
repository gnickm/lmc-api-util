// --------------------------------------------------------------------------
// Copyright (C) 2023 Nick Mitchell - MIT Licensed
// --------------------------------------------------------------------------

'use strict'

const _ = require('lodash')
const moment = require('moment')

const { Op } = require('sequelize')

const sort = require('./sort')

// --------------------------------------------------------------------------

const makePagingQuery = function (paging) {
  return {
    where: {},
    limit: paging.pageSize,
    offset: paging.pageSize * (paging.page - 1)
  }
}

const toQueryFilterValue = function (queryValue) {
  if (_.isArray(queryValue)) {
    const valArray = []

    queryValue.forEach((val) => {
      valArray.push(toQueryFilterValue(val))
    })

    return { [Op.or]: valArray }
  } else if (queryValue === true || queryValue === 'true') {
    return 1
  } else if (queryValue === false || queryValue === 'false') {
    return 0
  }

  return queryValue
}

const appendFilterToQuery = function (query, attributes, req) {
  query.where = query.where || {}

  _.forEach(req, function (queryValue, queryKey) {
    // Skip anything that doesn't start with 'filter'
    if (_.startsWith(queryKey, 'filter|')) {
      const chunks = _.split(queryKey, '|')

      if (_.indexOf(attributes, chunks[1]) >= 0) {
        query.where[chunks[1]] = toQueryFilterValue(queryValue)
      }
    }
  })

  return query
}

const appendSearchToQuery = function (query, attributes, req) {
  query.where = query.where || {}

  _.forEach(req, function (queryValue, queryKey) {
    if (queryKey === 'search') {
      if (!query.where[Op.or]) {
        query.where[Op.or] = []
      }
      _.forEach(attributes, (attribute) => {
        query.where[Op.or].push({ [attribute]: { [Op.iLike]: '%' + queryValue + '%' } })
      })
    }
  })

  return query
}

const appendSortToQuery = function (query, attributes, req) {
  const sorters = sort.generateSorters(attributes, req)

  if (sorters.length === 0) {
    return query
  }

  const order = []

  sorters.forEach(function (sorter) {
    order.push([sorter.attr, _.toUpper(sorter.dir)])
  })

  query.order = order

  return query
}

const appendDateRangeToQuery = function (query, attribute, req) {
  let startDateTime = null
  let endDateTime = null

  query.where = query.where || {}

  if (req.forDate) {
    startDateTime = moment(req.forDate, 'YYYY-MM-DD').startOf('day')
    endDateTime = moment(req.forDate, 'YYYY-MM-DD').endOf('day')
  }

  if (req.forMonth) {
    startDateTime = moment(req.forMonth, 'YYYY-MM').startOf('day')
    endDateTime = moment(req.forMonth, 'YYYY-MM')
      .add(1, 'month')
      .subtract(1, 'day')
      .endOf('day')
  }

  if (req.startDate) {
    startDateTime = moment(req.startDate, 'YYYY-MM-DD').startOf('day')
  }

  if (req.endDate) {
    endDateTime = moment(req.endDate, 'YYYY-MM-DD').endOf('day')
  }

  if (req.startDateTime) {
    startDateTime = moment(req.startDateTime, 'YYYY-MM-DD HH:mm:ss')
  }

  if (req.endDateTime) {
    endDateTime = moment(req.endDateTime, 'YYYY-MM-DD HH:mm:ss')
  }

  if (startDateTime) {
    if (endDateTime) {
      query.where[attribute] = { [Op.between]: [startDateTime.toDate(), endDateTime.toDate()] }
    } else {
      query.where[attribute] = { [Op.gte]: startDateTime.toDate() }
    }
  }

  return query
}

const addTotalValuesToPaging = function (paging, total) {
  paging.total = total
  paging.hasMore = total > paging.offset + paging.limit

  return paging
}

module.exports.addTotalValuesToPaging = addTotalValuesToPaging
module.exports.appendDateRangeToQuery = appendDateRangeToQuery
module.exports.appendFilterToQuery = appendFilterToQuery
module.exports.appendSearchToQuery = appendSearchToQuery
module.exports.appendSortToQuery = appendSortToQuery
module.exports.makePagingQuery = makePagingQuery

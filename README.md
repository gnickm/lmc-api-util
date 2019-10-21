# lmc-api-util [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Stateless helper functions for implementing RESTful APIs in express

## Usage

```javascript
const express = require('express');
const api = require('lmc-api-util');

var app = express();

// Call to /api/ok returns status 200 OK and JSON: 
//     {"result":"OK","message":"You called OK"} 

app.get('/api/ok', function(req, res) {
    api.makeOk(res, 'You called OK');
});

// Call to /api/thing/found returns status 200 OK and JSON: 
//     {"result":"OK","message":"Found Thing 123","thing":{"foo":"bar"}} 

app.get('/api/thing/found', function(req, res) {
    api.makeFound(res, 'Thing 123', {thing: {foo: 'bar'}});
});

// Call to /api/thing/notfound returns status 404 Not Found and JSON: 
//     {"result":"FAIL","message":"Could not find Thing 456"} 

app.get('/api/thing/notfound', function(req, res) {
    api.makeNotFound(res, 'Thing 456');
});

```
## Installation

Install with [npm](http://github.com/isaacs/npm):

```bash
$ npm install lmc-api-util
```

## API

### makeOk(res, message, resultObj)

Creates a response JSON message with `result` of OK and a supplied `message`. 
HTTP status is no explicitly set for this call, so will most likely be 200 OK.

- `res` (required) - express response object
- `message` (optional) - message object to supply with response
- `resultObj` (optional) - any members of this object will be passed along in
the response. Useful for GET REST requests that return something.

---
### makeFail(res, message, resultObj)

Creates a response JSON message with `result` of FAIL and a supplied `message`. 
HTTP status is no explicitly set for this call, so will most likely be 200 OK.

- `res` (required) - express response object
- `message` (optional) - message object to supply with response
- `resultObj` (optional) - any members of this object will be passed along in
the response. Useful for sending additional info on the failure.

---
### makeFound(res, itemDesc, resultObj)

Creates a response JSON message with `result` of OK and creates a message that
`itemDesc` was found. HTTP status is set to 200 OK.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what was found
- `resultObj` (optional) - any members of this object will be passed along in
the response. Useful for GET REST requests that return something.

---
### makeFoundZero(res, itemDesc, resultObj)

Creates a response JSON message with `result` of OK and creates a message that
zero of `itemDesc` were found. HTTP status is set to 200 OK. This function is
most useful for `findAll()` type functions where nothing was found, rather than
`findById()` type functions.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what we were trying to find
- `resultObj` (optional) - any members of this object will be passed along in
the response. Useful for GET REST requests that return something.

---
### makeCreated(res, itemDesc, resultObj)

Creates a response JSON message with `result` of OK and creates a message that
`itemDesc` was created. HTTP status is set to 201 CREATED. Usually want to 
return either the ID of the newly created entity or the entity itself.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what was created
- `resultObj` (optional) - any members of this object will be passed along in
the response. Useful for GET REST requests that return something.
- `resultObj.location` (optional) - this will set the location URL of the new
entity in the header of the response. This is a REST best practice.

---
### makeUpdated(res, itemDesc, resultObj)

Creates a response JSON message with `result` of OK and creates a message that
`itemDesc` was updated. HTTP status is set to 200 OK. Usually want to 
return either the ID of the updated entity or the entity itself.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what was updated
- `resultObj` (optional) - any members of this object will be passed along in
the response. Useful for GET REST requests that return something.
- `resultObj.location` (optional) - this will set the location URL of the new
entity in the header of the response. This is a REST best practice.

---
### makeDeleted(res, itemDesc, resultObj)

Creates a response JSON message with `result` of OK and creates a message that
`itemDesc` was deleted. HTTP status is set to 200 OK.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what was deleted
- `resultObj` (optional) - any members of this object will be passed along in
the response. 

---
### makeBadRequest(res, message)

Creates a response JSON message with `result` of FAIL and a supplied `message`.
HTTP status is set to 400 Bad Request. This is most useful for missing or
malformed information in the request.

- `res` (required) - express response object
- `message` (optional) - message returned with the response

---
### makeUnauthorized(res, message)

Creates a response JSON message with `result` of FAIL and a supplied message. HTTP 
status is set to 401 Unauthorized. This is most useful for dealing with 
authentication issues.

- `res` (required) - express response object
- `message` (optional) - message returned with the response

---
### makeForbidden(res, itemDesc)

Creates a response JSON message with `result` of FAIL and creates a message that
`itemDesc` cannot be accessed by the current user. HTTP status is set to 403
Forbidden. This is most useful for relaying to a user that they attempted to
access something that they do not have permissions to access.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what was attempted to be accessed

---
### makeNotFound(res, itemDesc)

Creates a response JSON message with `result` of FAIL and creates a message that
`itemDesc` was not found. HTTP status is set to 404 Not Found.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what was not found

---
### makeServerError(res, message)

Creates a response JSON message with `result` of FAIL and a supplied `message`.
HTTP status is set to 500 Internal Server Error. This is most useful for 
indicating an unexpected failure in the server.

- `res` (required) - express response object
- `message` (optional) - message returned with the response

---
### checkRequired(res, params, required)

Checks for existence of all `required` parameters in `params`. Returns true
and leaves `res` unmodified if all the required paramaters are present.
Returns false and creates a 400 Bad Request status response and returns
missing parameters in message if all the required paramaters are not present.

- `res` (required) - express response object
- `params` (required) - array or object of provided parameters. Usually can
simply pass `req.query`
- `required` (required) - array of parameter names to check

Example:

```javascript
const express = require('express');
const api = require('lmc-api-util');

var app = express();

// Call /api/check?foo=1&bar=2 returns status 200 OK and JSON:
//     {"result":"OK","message":"Parameters OK"} 
// Call /api/check?bar=2 returns status 400 Bad Request and JSON:
//     {"result":"FAIL","message":"Missing required parameter: foo"} 
// Call /api/check returns status 400 Bad Request and JSON:
//     {"result":"FAIL","message":"Missing required parameters: foo, bar"} 

app.get('/api/check', function(req, res) {
    if(api.checkRequired(res, req.query, ['foo', 'bar'])) {
        api.makeOk(res, 'Parameters OK');
    }
});
```

---
### calcPaging(params, options)

Generates a well-defined object that can be used for paging when looking up
data. Handles omitted parameters and calculates offset and limit values.

- `params` (required) - array or object of provided parameters. Usually can
simply pass `req.query`. Recognized values are:
   - `page` - current page. Defaults to 1
   - `pageSize` - numer of objects per page. Defaults to 50, but is limited by `maxPageSize` below
- `options` (optional) - other options for paging:
   - `maxPageSize` - maximum requestable page size. Defaults to 200

Return a single object with the following values:

- `page` - current page of data
- `pageSize` - number of objects per page
- `offset` - number of objects to skipped to get to page of data
- `limit` - same as `pageSize`

Example:

```javascript
const express = require('express');
const api = require('lmc-api-util');

var app = express();

// Call /api/paging returns:
//     {"result":"OK","message":"Paging!","page":1,"pageSize":50,"offset":0,"limit":50} 
// Call /api/paging?page=3 returns:
//     {"result":"OK","message":"Paging!","page":3,"pageSize":50,"offset":100,"limit":50} 
// Call /api/paging?page=4&pageSize=100 returns:
//     {"result":"OK","message":"Paging!","page":4,"pageSize":100,"offset":300,"limit":100} 
// Call /api/paging?page=5&pageSize=999 returns:
//     {"result":"OK","message":"Paging!","page":4,"pageSize":200,"offset":400,"limit":200} 

app.get('/api/paging', function(req, res) {
    const paging = api.calcPaging(req.query);
    api.makeOk(res, 'Paging!', paging);
});
```
## License

[MIT](LICENSE)

[npm-url]: https://npmjs.org/package/lmc-api-util
[npm-image]: http://img.shields.io/npm/v/lmc-api-util.svg

[travis-url]: https://travis-ci.org/gnickm/lmc-api-util
[travis-image]: http://img.shields.io/travis/gnickm/lmc-api-util.svg

[coveralls-url]: https://coveralls.io/github/gnickm/lmc-api-util?branch=master
[coveralls-image]: https://coveralls.io/repos/github/gnickm/lmc-api-util/badge.svg?branch=master

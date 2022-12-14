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
    api.respondOk(res, 'You called OK');
});

// Call to /api/thing/338a0bbe-e675-43ae-ac10-0019f1606401 returns status 200 OK and JSON:
//     {"result":"OK","message":"Found Thing 123","thing":{"foo":"bar"}}
// Call to /api/thing/bogus returns status 400 Bad Request and JSON:
//     {"result":"FAIL","message":"Request parameter \"id\" must be a valid UUID"}

app.get('/api/thing/:id', function(req, res) {
    try {
        api.validateRequest(req.params, {id: api.VALIDATE_UUID});
        api.respondFound(res, 'Thing 123', {thing: {foo: 'bar'}});
    } catch(err) {
        api.respondBadRequest(res, err.message);
    }
});

// Call to /api/thing/notfound returns status 404 Not Found and JSON:
//     {"result":"FAIL","message":"Could not find Thing 456"}

app.get('/api/thing/notfound', function(req, res) {
    api.respondNotFound(res, 'Thing 456');
});

```
## Installation

Install with [npm](http://github.com/isaacs/npm):

```bash
$ npm install lmc-api-util
```

## API

### Respond Functions
This group of functions allows for the quick creation of normalized responses
to REST API calls. They run the gamut from simple success to server errors,
all generating a HTTP response code and a JSON object of the following
pattern:

```json
{
    "result": "[OK|FAIL]",
    "message": "[Friendly Message]",
    "someOptionalObject": {}
}
```

All respond functions take an `express` response object as a first parameter
and will throw an `Error` if it is invalid.

---
#### respondOk(res, message, resultObj)

Creates a response JSON message with `result` of OK and a supplied `message`.
HTTP status is no explicitly set for this call, so will most likely be 200 OK.

- `res` (required) - express response object
- `message` (optional) - message object to supply with response
- `resultObj` (optional) - any members of this object will be passed along in
  the response. Useful for GET REST requests that return something.

---
#### respondFail(res, message, resultObj)

Creates a response JSON message with `result` of FAIL and a supplied `message`.
HTTP status is no explicitly set for this call, so will most likely be 200 OK.

- `res` (required) - express response object
- `message` (optional) - message object to supply with response
- `resultObj` (optional) - any members of this object will be passed along in
  the response. Useful for sending additional info on the failure.

---
#### respondFound(res, itemDesc, resultObj)

Creates a response JSON message with `result` of OK and creates a message that
`itemDesc` was found. HTTP status is set to 200 OK.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what was found
- `resultObj` (optional) - any members of this object will be passed along in
   the response. Useful for GET REST requests that return something.

---
#### respondFoundZero(res, itemDesc, resultObj)

Creates a response JSON message with `result` of OK and creates a message that
zero of `itemDesc` were found. HTTP status is set to 200 OK. This function is
most useful for `findAll()` type functions where nothing was found, rather than
`findById()` type functions.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what we were trying to find
- `resultObj` (optional) - any members of this object will be passed along in
the response. Useful for GET REST requests that return something.

---
#### respondCreated(res, itemDesc, resultObj)

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
#### respondUpdated(res, itemDesc, resultObj)

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
#### respondDeleted(res, itemDesc, resultObj)

Creates a response JSON message with `result` of OK and creates a message that
`itemDesc` was deleted. HTTP status is set to 200 OK.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what was deleted
- `resultObj` (optional) - any members of this object will be passed along in
  the response.

---
#### respondBadRequest(res, message)

Creates a response JSON message with `result` of FAIL and a supplied `message`.
HTTP status is set to 400 Bad Request. This is most useful for missing or
malformed information in the request.

- `res` (required) - express response object
- `message` (optional) - message returned with the response

---
#### respondUnauthorized(res, message)

Creates a response JSON message with `result` of FAIL and a supplied message. HTTP
status is set to 401 Unauthorized. This is most useful for dealing with
authentication issues.

- `res` (required) - express response object
- `message` (optional) - message returned with the response

---
#### respondForbidden(res, itemDesc)

Creates a response JSON message with `result` of FAIL and creates a message that
`itemDesc` cannot be accessed by the current user. HTTP status is set to 403
Forbidden. This is most useful for relaying to a user that they attempted to
access something that they do not have permissions to access.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what was attempted to be accessed

---
#### respondNotFound(res, itemDesc)

Creates a response JSON message with `result` of FAIL and creates a message that
`itemDesc` was not found. HTTP status is set to 404 Not Found.

- `res` (required) - express response object
- `itemDesc` (optional) - description of what was not found

---
#### respondServerError(res, message)

Creates a response JSON message with `result` of FAIL and a supplied `message`.
HTTP status is set to 500 Internal Server Error. This is most useful for
indicating an unexpected failure in the server.

- `res` (required) - express response object
- `message` (optional) - message returned with the response

---
### Request Functions
This group of functions manages and processes incoming requests. They generate
normailzed functions for paging and queries and can validate incoming
parameters.

---
#### calcPaging(params, options)

Generates a well-defined object that can be used for paging when looking up
data. Handles omitted parameters and calculates offset and limit values. `limit`
and `offset` can also be passed in directly, but will be overriden if `page` or
`pageSize` are provided.

- `requestParams` (required) - array or object of provided parameters. Usually can
simply pass `req.query`. Recognized values are:
   - `page` - current page. Defaults to 1
   - `pageSize` - numer of objects per page. Defaults to 50, but is limited by `maxPageSize` below
   - `limit` - can be set directly if `page` and `pageSize` are omitted
   - `offset` - can be set directly if `page` and `pageSize` are omitted
   - `_page` - *JSON Server* style alias for `page`
   - `_limit` - *JSON Server* style alias for `pageSize`
- `options` (optional) - other options for paging:
   - `maxPageSize` - maximum requestable page size. Defaults to 200

Return a single object with the following values (all as integers):

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
// Call /api/paging?_page=4&_limit=100 returns:
//     {"result":"OK","message":"Paging!","page":4,"pageSize":100,"offset":300,"limit":100}
// Call /api/paging?page=5&pageSize=999 returns:
//     {"result":"OK","message":"Paging!","page":4,"pageSize":200,"offset":400,"limit":200}
// Call /api/paging?limit=5&offset=10 returns:
//     {"result":"OK","message":"Paging!","page":2,"pageSize":5,"offset":10,"limit":5}
// Call /api/paging?limit=5&offset=10&page=3&pageSize=12 returns:
//     {"result":"OK","message":"Paging!","page":3,"pageSize":12,"offset":24,"limit":12}

app.get('/api/paging', function(req, res) {
    const paging = api.calcPaging(req.query);
    api.makeOk(res, 'Paging!', paging);
});
```

---
#### validateRequest(requestParams, required)

Checks for existence of all `required` parameters in `requestParams`. Returns
true if all the required paramaters are present or throws an `Error` if any are
missing. Additionally, if `required` is passed as an object, type checking will
be applied to the values as well, throwing an `Error` if the value is invalid.
The `message` parameter of the thrown `Error` contains text that can be
directly returned by the API as an error message.

- `requestParams` (required) - object of provided parameters. Usually can
  simply pass `req.query` or `req.body`
- `required` (required) - if passed an array, it will ensure all values are
  present as keys in `requestParams`. If passed an object, it will first
  ensure all the keys of the object are present as keys in `requestParams`,
  then will do a check for valid types as specified:
  - **VALIDATE_EMAIL** - request value must be a valid email address
  - **VALIDATE_NOT_EMPTY** - request value must not be empty or null
  - **VALIDATE_UUID** - request value must be a valid UUID

Example:

```javascript
const express = require('express');
const api = require('lmc-api-util');

var app = express();

// Call /api/checkrequired?foo=1&bar=2 returns status 200 OK and JSON:
//     {"result":"OK","message":"Parameters OK"}
// Call /api/checkrequired?bar=2 returns status 400 Bad Request and JSON:
//     {"result":"FAIL","message":"Missing required parameter: foo"}
// Call /api/checkrequired returns status 400 Bad Request and JSON:
//     {"result":"FAIL","message":"Missing required parameters: foo, bar"}

app.get('/api/checkrequired', function(req, res) {
    try {
        api.validateRequest(req.query, ['foo', 'bar']);
        api.makeOk(res, 'Parameters OK');
    } catch(err) {
        api.respondBadRequest(res, err.message);
    }
});

// Call /api/validate?foo=bob@bob.com&bar=not+empty&baz=354245a5-ab13-41ff-8245-1271b5662eff returns status 200 OK and JSON:
//     {"result":"OK","message":"Parameters OK"}
// Call /api/validate?bar=not+empty&baz=354245a5-ab13-41ff-8245-1271b5662eff returns status 400 Bad Request and JSON:
//     {"result":"FAIL","message":"Missing required parameter: foo"}
// Call /api/validate?foo=bob@bob.com&bar=not+empty&baz=bad-uuid returns status 400 Bad Request and JSON:
//     {"result":"FAIL","message":"Request parameter \"baz\" must be a valid UUID"}
// Call /api/validate?foo=bob@bob.com&bar=&baz=bad-uuid returns status 400 Bad Request and JSON:
//     {"result":"FAIL","message":"Request parameter \"bar\" must not be empty"}

app.get('/api/validate', function(req, res) {
    try {
        api.validateRequest(req.query, {
            foo: api.VALIDATE_EMAIL,
            bar: api.VALIDATE_NOT_EMPTY,
            baz: api.VALIDATE_UUID
        });
        api.makeOk(res, 'Parameters OK');
    } catch(err) {
        api.respondBadRequest(res, err.message);
    }
});
```

---
### Object Functions
At times it is more helpful to load a full dataset into memory and
page/filter/sort the objects in memory. This group of functions provides
helpers to manage this in a reliable way.

---
#### filterObjects(allObjs, attributes, requestParams)

Returns a subset of `allObjs` that match filters defined by `requestParams`.
Any key in `requestParams` that starts with `filter|` and exists in the
`attributes` array will be used to check each object in `allObjs`. Any object
that matches will be returned.

- `allObjs` (required) - full array of objects to be filtered
- `attributes` (required) - array of attribute names to check on objects
- `requestParams` (required) - object of parameters as part of the request.
  Any parameter that starts with `filter|` will be used to filter the object
  list, checking against `attributes` and the matching value.



---
#### pageObjects(allObjs, paging)

Takes a `paging` object generated from `calcPaging()` and pages the full array
`allObjs`, returning only the correct page of objects. This also modifies the
`paging` object, adding `total` for the total objects and `hasMore` if there
are more objects to be paged. This funcion should be called *after* filtering
and sorting.

- `allObjs` (required) - full array of objects to be paged
- `paging` (required) - paging object generated from `calcPaging()`

---
## License

[MIT](LICENSE)

[npm-url]: https://npmjs.org/package/lmc-api-util
[npm-image]: http://img.shields.io/npm/v/lmc-api-util.svg

[travis-url]: https://travis-ci.com/gnickm/lmc-api-util
[travis-image]: http://img.shields.io/travis/gnickm/lmc-api-util.svg

[coveralls-url]: https://coveralls.io/github/gnickm/lmc-api-util?branch=master
[coveralls-image]: https://coveralls.io/repos/github/gnickm/lmc-api-util/badge.svg?branch=master

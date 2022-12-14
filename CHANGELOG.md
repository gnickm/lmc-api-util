# lmc-api-util Changelog

## 2.0.0
> Released XX Aug 2021

### New
- Added type checking of response object in `respond` functions, throwing an Error if it is not a valid `express` response object
- Added `validateRequest()` to not only check for required query values but check the type of values
- Added object functions for paging/filtering/sorting objects

### Updated
- Renamed `make` series of functions to `respond` to better reflect action of function. Legacy `make` functions are
  still available for backward compatibility but are undocumented
- Added support for *JSON Server* style paging parameters (`_page` and `_limit`) in `calcPaging()`
- Deprecated `checkRequired()` function, as it was superceded by `validateRequest()`. It is still available for backward
  compatibility but is undocumented

## 1.2.3
> Released 9 Jun 2021

- Allowed `limit` and `offset` to be passed in directly for `calcPaging()`
- Merged in dependabot fixes

## 1.2.2
> Released 6 Apr 2020

- Updated dependencies to fix vulnerabilities

## 1.2.1
> Released 9 Nov 2019

- Fixed `calcPaging()` to return only integer values in paging object, even if passed in strings

## 1.2.0
> Released 21 Oct 2019

- Added `calcPaging()` for generating paging
- Added `makeUnauthorized()` for returning 401 Unauthorized messages
- Tweaked documentation to better show the difference between `makeUnauthorized()`
  and `makeForbidden()`
- Fixed security audit issues in the dev packages

## 1.1.0
> Released 14 Oct 2016

- Added `makeForbidden()` function

## 1.0.1
> Released 11 Oct 2016

- Fixed documentation

## 1.0.0

- Initial release

# lmc-api-util Changelog

## 2.1.1
> Released 2 Jul 2024

### Added
- Added a few tests for specific coverage

### Changed
- Moved eslint stuff to dev dependencies
- Updated project dependencies

## 2.1.0
> Released 26 Sep 2023

### Changed
- Added support for deep object filtering and searching
- Switched javascript syntax to standard

## 2.0.0
> Released 16 Jun 2023

### New
- Added type checking of response object in `respond` functions, throwing an Error if it is not a valid `express` response object
- Added `validateRequest()` to not only check for required query values but check the type of values
- Added object functions for paging/filtering/sorting objects
- Added query functions for generating sequelize queries for paging/filtering/sorting objects

### Updated
- Renamed `make` series of functions to `respond` to better reflect action of function. Legacy `make` functions are
  still available for backward compatibility but are undocumented
- Added support for *JSON Server* style paging parameters (`_page` and `_limit`) in `calcPaging()`
- Deprecated `checkRequired()` function, as it was superceded by `validateRequest()`. It is still available for backward
  compatibility but is undocumented

## 1.3.0
> Released 14 Dec 2022

- Bumped minimum node to v8.9
- Upgraded dependencies to resolve vulnerabilities

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

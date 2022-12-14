# lmc-api-util Changelog

## 1.3.0
> Released 14 Dec 2022

- Bumped minimum node to v6
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

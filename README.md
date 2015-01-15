# hapi-sfdc-models

Salesforce object models for hapi applications.

[![Build Status](https://travis-ci.org/fourq/hapi-sfdc-models.svg)](https://travis-ci.org/fourq/hapi-sfdc-models)
[![Coverage Status](https://coveralls.io/repos/fourq/hapi-sfdc-models/badge.svg?branch=master)](https://coveralls.io/r/fourq/hapi-sfdc-models?branch=master)

[![Dependency Status](https://david-dm.org/fourq/hapi-sfdc-models.svg?style=flat)](https://david-dm.org/fourq/hapi-sfdc-models)
[![devDependency Status](https://david-dm.org/fourq/hapi-sfdc-models/dev-status.svg?style=flat)](https://david-dm.org/fourq/hapi-sfdc-models#info=devDependencies)
[![peerDependency Status](https://david-dm.org/fourq/hapi-sfdc-models/peer-status.svg?style=flat)](https://david-dm.org/fourq/hapi-sfdc-models#info=peerDependencies)

This is heavily inspired by [Hapi's](https://github.com/hapijs/hapi/) [hapi-mongo-models](https://github.com/jedireza/hapi-mongo-models/)
plugin.

Thanks [@jedireza](https://github.com/jedireza/)

This plugin provides Salesforce crud methods for applications using [Hapi](https://github.com/hapijs/hapi/).

## Install

```javascript
npm install --save hapi-sfdc-models
```

## Usage

## Examples

## API

#### `insert(input, callback)`

Insert records

 * `input` - `{Record|Array.<Record>} records - A record or array of records to create`
 * `callback` - `{Callback.<RecordResult|Array.<RecordResult>>} [function(err, response)]`
  * `return` - `{Promise.<RecordResult|Array.<RecordResult>>}`

#### `find(input, callback)`
#### `findOne(input, callback)`
#### `findById()`
#### `update()`
#### `count()`
#### `remove()`

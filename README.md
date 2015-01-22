# hapi-sfdc-models

Salesforce object models for hapi applications.

[![bitHound Score](https://app.bithound.io/fourq/hapi-sfdc-models/badges/score.svg)](http://app.bithound.io/fourq/hapi-sfdc-models)
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

---- WORK IN PROGRESS ----
## Usage

### Base model

You extend the `BaseModel` to create new model classes. The base model also
acts as a singleton so all models can share one api connection.

Creating a `Contact` model.

```js
var Joi = require('joi');
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-sfdc-models').BaseModel;

var Contact = BaseModel.extend({
    // instance prototype
    constructor: function (attrs) {

        ObjectAssign(this, attrs);
    }
});

Contact._sobject = 'contact'; // Salesforce object name

Contact.schema = Joi.object().keys({
    Id: Joi.string().min(15).max(18).required(),
    FirstName: Joi.string().max(40),
    LastName: Joi.string().max(80).required()
});

Contact.staticFunction = function () {

    // static class function
};

module.exports = Contact;
```

### Server plugin

Register the plugin manually.

```js
var plugin = {
    register: require('hapi-sfdc-models'),
    options: {
        salesforce: {
            url: 'https://login.salesforce.com',
            auth: {
                user: '<username>',
                pass: '<password><security_token>'
            }
        },
        models: {
            Contact: './path/to/contact',
            User: './path/to/user'
        }
    }
};

server.register(plugin, function (err) {

     if (err) {
         console.log('Failed loading plugin');
     }
 });
```

Or include it in your composer manifest.

```json
{
    "servers": [{
        "port": 8080
    }],
    "plugins": {
        "hapi-sfdc-models": {
            "salesforce": {
                "url": "https://login.salesforce.com",
                "auth": {
                    "user": "<username>",
                    "pass": "<password><security_token>"
                }
            },
            "models": {
                "Contact": "./path/to/contact",
                "User": "./path/to/user"
            }
        }
    }
}
```

The options passed to the plugin is an object where:

 - `salesforce` - is an object where:
    - `url` - a string representing the connection url for the Salesforce REST API
    - `auth` - an object that contains credentials.
        - `user` - a string representing the salesforce username used for the headless user
        - `pass` - a string representing the salesforce pass and token for the headless user
 - `models` - an object where each key is the exposed model name and each value is the
    path (relative to the current working directory) of where to find the model on disk.

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

## License

MIT

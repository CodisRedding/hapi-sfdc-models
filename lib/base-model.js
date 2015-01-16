var Joi = require('joi');
var JSForce = require('jsforce');
var ClassExtend = require('ampersand-class-extend');


var BaseModel = function () {};
BaseModel.extend = ClassExtend;

var connection;


BaseModel.connect = function (config, callback) {

    connection = new JSForce.Connection({ loginUrl: config.url });
    connection.login(config.auth.user, config.auth.pass, function (err, response) {

        if (err) {
            return callback(err);
        }

        BaseModel.api = connection;
        callback(null, connection);
    });
};


BaseModel.disconnect = function () {

    BaseModel.api = null;
};


BaseModel.validate = function (input, callback) {

    return Joi.validate(input, this.schema, callback);
};


BaseModel.prototype.validate = function (callback) {

    return Joi.validate(this, this.constructor.schema, callback);
};


BaseModel.resultFactory = function () {

    var args = new Array(arguments.length);
    for (var i = 0 ; i < args.length ; ++i) {
        args[i] = arguments[i];
    }

    var next = args.shift();
    var err = args.shift();
    var result = args.shift();

    if (err) {
        args.unshift(result);
        args.unshift(err);
        return next.apply(undefined, args);
    }

    var self = this;

    if (Object.prototype.toString.call(result) === '[object Array]') {
        result.forEach(function (item, index) {

            result[index] = new self(item);
        });
    }

    if (Object.prototype.toString.call(result) === '[object Object]') {
        result = new this(result);
    }

    args.unshift(result);
    args.unshift(err);
    next.apply(undefined, args);
};


BaseModel.insert = function () {

    var args = new Array(arguments.length);
    for (var i = 0 ; i < args.length ; ++i) {
        args[i] = arguments[i];
    }

    var sobject = BaseModel.api.sobject(this._sobject);
    var callback = this.resultFactory.bind(this, args.pop());

    sobject.insert(args[0], callback);
};


BaseModel.find = function () {

    var args = new Array(arguments.length);
    for (var i = 0 ; i < args.length ; ++i) {
        args[i] = arguments[i];
    }

    var sobject = BaseModel.api.sobject(this._sobject);
    var callback = this.resultFactory.bind(this, args.pop());

    sobject.find(args[0], callback);
};


BaseModel.findOne = function () {

    var args = new Array(arguments.length);
    for (var i = 0 ; i < args.length ; ++i) {
        args[i] = arguments[i];
    }

    var sobject = BaseModel.api.sobject(this._sobject);
    var callback = this.resultFactory.bind(this, args.pop());

    sobject.findOne(args[0], callback);
};


BaseModel.findById = function () {

    var args = new Array(arguments.length);
    for (var i = 0 ; i < args.length ; ++i) {
        args[i] = arguments[i];
    }

    var sobject = BaseModel.api.sobject(this._sobject);
    var callback = this.resultFactory.bind(this, args.pop());

    sobject.findOne(args[0], callback);
};


BaseModel.update = function () {

    var args = new Array(arguments.length);
    for (var i = 0 ; i < args.length ; ++i) {
        args[i] = arguments[i];
    }

    var sobject = BaseModel.api.sobject(this._sobject);
    var callback = args.pop();

    sobject.update(args[0], callback);
};


BaseModel.count = function () {

    var args = new Array(arguments.length);
    for (var i = 0 ; i < args.length ; ++i) {
        args[i] = arguments[i];
    }

    var sobject = BaseModel.api.sobject(this._sobject);
    var callback = args.pop();

    sobject.count(args[0], callback);
};


BaseModel.remove = function () {

    var args = new Array(arguments.length);
    for (var i = 0 ; i < args.length ; ++i) {
        args[i] = arguments[i];
    }

    var sobject = BaseModel.api.sobject(this._sobject);
    var callback = args.pop();

    sobject.del(args[0], callback);
};


module.exports = BaseModel;

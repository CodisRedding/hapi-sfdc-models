var Joi = require('joi');
var Async = require('async');
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


BaseModel.pagedFind = function (query, fields, sort, limit, page, callback) {

    var self = this;
    var output = {
        data: undefined,
        pages: {
            current: page,
            prev: 0,
            hasPrev: false,
            next: 0,
            hasNext: false,
            total: 0
        },
        items: {
            limit: limit,
            begin: ((page * limit) - limit) + 1,
            end: page * limit,
            total: 0
        }
    };

    fields = this.fieldsAdapter(fields);
    sort = this.sortAdapter(sort);

    Async.auto({
        count: function (done) {

            self.count(query, done);
        },
        find: function (done) {

            var options = {
                limit: limit,
                skip: (page - 1) * limit,
                sort: sort
            };

            self.find(query, fields, options, done);
        }
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        output.data = results.find;
        output.items.total = results.count;

        // paging calculations
        output.pages.total = Math.ceil(output.items.total / limit);
        output.pages.next = output.pages.current + 1;
        output.pages.hasNext = output.pages.next <= output.pages.total;
        output.pages.prev = output.pages.current - 1;
        output.pages.hasPrev = output.pages.prev !== 0;
        if (output.items.begin > output.items.total) {
            output.items.begin = output.items.total;
        }
        if (output.items.end > output.items.total) {
            output.items.end = output.items.total;
        }

        callback(null, output);
    });
};


BaseModel.fieldsAdapter = function (fields) {

    if (Object.prototype.toString.call(fields) === '[object String]') {
        var document = {};

        fields = fields.split(/\s+/);
        fields.forEach(function (field) {

            if (field) {
                document[field] = true;
            }
        });

        fields = document;
    }

    return fields;
};


BaseModel.sortAdapter = function (sorts) {

    if (Object.prototype.toString.call(sorts) === '[object String]') {
        var document = {};

        sorts = sorts.split(/\s+/);
        sorts.forEach(function (sort) {

            if (sort) {
                var order = sort[0] === '-' ? -1 : 1;
                if (order === -1) {
                    sort = sort.slice(1);
                }
                document[sort] = order;
            }
        });

        sorts = document;
    }

    return sorts;
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

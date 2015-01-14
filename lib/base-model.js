var Joi = require('joi');
var JSForce = require('jsforce');
var ClassExtend = require('ampersand-class-extend');


var BaseModel = function () {};
BaseModel.extend = ClassExtend;

var connection;


BaseModel.connect = function (config, callback) {

		connection = new JSForce.Connection({ loginUrl: config.url }); 	
		connection.login(config.user, config.pass, function (err, response) {
				
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


module.exports = BaseModel.extend(JSForce.SObject);
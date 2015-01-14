var Async = require('async');
var Joi = require('joi');
var Lab = require('lab');
var Code = require('code');
var ObjectAssign = require('object-assign');
var Proxyquire = require('proxyquire');
var Config = require('../config');


var lab = exports.lab = Lab.script();
var stub = {
    mongodb: {}
};
var BaseModel = Proxyquire('../../lib/base-model', {
    mongodb: stub.mongodb
});


lab.experiment('BaseModel Validation', function () {

    lab.test('it returns the Joi validation results of a SubClass', function (done) {

        var SubModel = BaseModel.extend({
            constructor: function (attrs) {

                ObjectAssign(this, attrs);
            }
        });

        SubModel.schema = Joi.object().keys({
            name: Joi.string().required()
        });

        Code.expect(SubModel.validate()).to.be.an.object();

        done();
    });


    lab.test('it returns the Joi validation results of a SubClass instance', function (done) {

        var SubModel = BaseModel.extend({
            constructor: function (attrs) {

                ObjectAssign(this, attrs);
            }
        });

        SubModel.schema = Joi.object().keys({
            name: Joi.string().required()
        });

        var myModel = new SubModel({name: 'Stimpy'});

        Code.expect(myModel.validate()).to.be.an.object();

        done();
    });
});

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

    lab.test('should return the Joi validation results of a SubClass', function (done) {

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


    lab.test('should return the Joi validation results of a SubClass instance', function (done) {

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


lab.experiment('BaseModel Proxied Methods', function () {

		var SubModel, liveTestData;


    lab.before(function (done) {

        SubModel = BaseModel.extend({
            constructor: function (attrs) {

                ObjectAssign(this, attrs);
            }
        });

        SubModel._sobject = 'Contact';

        BaseModel.connect(Config.salesforce, function (err, api) {

            done(err);
        });
    });


    lab.after(function (done) {

        BaseModel.disconnect();

        done();
    });


		lab.test('should insert data and return the results', function (done) {

        var testData = [
            {LastName: 'Ren'},
            {LastName: 'Stimpy'},
            {LastName: 'Yak'}
        ];

        SubModel.insert(testData, function (err, results) {

            liveTestData = results;

            Code.expect(err).to.not.exist();
            Code.expect(results).to.be.an.array();

            done(err);
        });
    });


    lab.test('should return a result array', function (done) {

        SubModel.find({LastName: 'Ren'}, function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.array();

            done();
        });
    });


		lab.test('should return a single result', function (done) {

        SubModel.findOne({LastName: 'Ren'}, function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.object();

            done();
        });
    });


    lab.test('should return a single result via id', function (done) {

        SubModel.findById(liveTestData[0].Id, function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.object();

            done();
        });
    });


    lab.test('should update a document and return the results', function (done) {


				SubModel.findOne({Id: liveTestData[0].Id}, function (err, result) {

						var res = result;
						var remove = [ 'LastModifiedDate',
								'LastCURequestDate',
								'LastCUUpdateDate',
								'MailingAddress',
								'LastViewedDate',
								'CreatedById',
								'IsDeleted',
								'OtherAddress',
								'LastActivityDate',
								'SystemModstamp',
								'PhotoUrl',
								'IsEmailBounced',
								'LastReferencedDate',
								'LastModifiedById',
								'MasterRecordId',
								'Name',
								'JigsawContactId',
								'CreatedDate' ];

						remove.map(function (index) {
							delete res[index];
						});

						res.LastName = 'Chan';
						SubModel.update(res, function (err, updated) {

							Code.expect(err).to.not.exist();
							Code.expect(updated).to.be.an.object();
							Code.expect(updated.success).to.equal(true);

							done(err);
						});
				});
    });


    lab.test('should return a collection count', function (done) {

        SubModel.count({}, function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.a.number();

            done();
        });
    });


    lab.test('should remove documents via query', function (done) {

        SubModel.remove(liveTestData[0].id, function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.object();
            Code.expect(result.success).to.equal(true);

            done();
        });
    });
});

var Async = require('async');
var Joi = require('joi');
var Lab = require('lab');
var Code = require('code');
var ObjectAssign = require('object-assign');
var Proxyquire = require('proxyquire');
var Config = require('../config');


var lab = exports.lab = Lab.script();
var stub = {
    salesforce: {}
};
var BaseModel = Proxyquire('../../lib/base-model', {
    salesforce: stub.salesforce
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


lab.experiment('BaseModel Helpers', function () {

    lab.test('it returns expected results for the fields adapter', function (done) {

        var fieldsDoc = BaseModel.fieldsAdapter('one two three');
        Code.expect(fieldsDoc).to.be.an.object();
        Code.expect(fieldsDoc.one).to.equal(true);
        Code.expect(fieldsDoc.two).to.equal(true);
        Code.expect(fieldsDoc.three).to.equal(true);

        var fieldsDoc2 = BaseModel.fieldsAdapter('');
        Code.expect(Object.keys(fieldsDoc2)).to.have.length(0);

        done();
    });


    lab.test('it returns expected results for the sort adapter', function (done) {

        var sortDoc = BaseModel.sortAdapter('one -two three');
        Code.expect(sortDoc).to.be.an.object();
        Code.expect(sortDoc.one).to.equal(1);
        Code.expect(sortDoc.two).to.equal(-1);
        Code.expect(sortDoc.three).to.equal(1);

        var sortDoc2 = BaseModel.sortAdapter('');
        Code.expect(Object.keys(sortDoc2)).to.have.length(0);

        done();
    });
});


lab.experiment('BaseModel Paged Find', function () {

    var SubModel;


    lab.beforeEach(function (done) {

        SubModel = BaseModel.extend({
            constructor: function (attrs) {

                ObjectAssign(this, attrs);
            }
        });

        SubModel._sobject = 'Contact';

        BaseModel.connect(Config.salesforce, function (err, db) {

            done(err);
        });
    });


    lab.afterEach(function (done) {

        SubModel.remove({}, function (err, result) {

            BaseModel.disconnect();

            done();
        });
    });


    lab.test('it returns early when an error occurs', function (done) {

        var realCount = SubModel.count;
        SubModel.count = function (query, callback) {
            callback(Error('count failed'));
        };

        var query = {};
        var fields;
        var limit = 10;
        var page = 1;
        var sort = { Id: -1 };

        SubModel.pagedFind(query, fields, sort, limit, page, function (err, results) {

            Code.expect(err).to.be.an.object();
            Code.expect(results).to.not.exist();

            SubModel.count = realCount;

            done();
        });
    });


    lab.test('it returns paged results', function (done) {

        Async.auto({
            setup: function (cb) {

                var testData = [{name: 'Ren'}, {name: 'Stimpy'}, {name: 'Yak'}];

                SubModel.insert(testData, cb);
            }
        }, function (err, results) {

            var query = { name: { $all: [ 'Ren', 'Stimpy', 'Yak' ] } };
            var fields;
            var limit = 10;
            var page = 1;
            var sort = { Id: -1 };

            SubModel.pagedFind(query, fields, sort, limit, page, function (err, results) {

                Code.expect(err).to.not.exist();
                Code.expect(results).to.be.an.object();

                done();
            });
        });
    });


    lab.test('it returns paged results where end item is less than total', function (done) {

        Async.auto({
            setup: function (cb) {

                var testData = [{name: 'Ren'}, {name: 'Stimpy'}, {name: 'Yak'}];

                SubModel.insert(testData, cb);
            }
        }, function (err, results) {

            var query = { name: { $all: [ 'Ren', 'Stimpy', 'Yak' ] } };
            var fields;
            var limit = 2;
            var page = 1;
            var sort = { Id: -1 };

            SubModel.pagedFind(query, fields, sort, limit, page, function (err, results) {

                Code.expect(err).to.not.exist();
                Code.expect(results).to.be.an.object();

                done();
            });
        });
    });


    lab.test('it returns paged results where begin item is less than total', function (done) {

        Async.auto({
            setup: function (cb) {

                var testData = [
                    {name: 'Ren'},
                    {name: 'Stimpy'},
                    {name: 'Yak'}
                ];

                SubModel.insert(testData, cb);
            }
        }, function (err, results) {

            var query = { name: { $all: [ 'Ren', 'Stimpy', 'Yak' ] } };
            var fields;
            var limit = 2;
            var page = 1;
            var sort = { Id: -1 };

            SubModel.pagedFind(query, fields, sort, limit, page, function (err, results) {

                Code.expect(err).to.not.exist();
                Code.expect(results).to.be.an.object();

                done();
            });
        });
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

        SubModel.findOne({Name: 'Ren'}, function (err, result) {

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
            var remove = [
                'LastModifiedDate',
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
                'CreatedDate'
            ];

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

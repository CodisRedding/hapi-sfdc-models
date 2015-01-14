var Lab = require('lab');
var Code = require('code');
var Hapi = require('hapi');
var Proxyquire = require('proxyquire');
var Config = require('./config');


var lab = exports.lab = Lab.script();
var stub = {
    BaseModel: {}
};
var ModelsPlugin = Proxyquire('..', {
    './lib/base-model': stub.BaseModel
});


lab.experiment('Plugin', function () {

    lab.test('should return and error when the api connection fails', function (done) {

        var realConnect = stub.BaseModel.connect;
        stub.BaseModel.connect = function (config, callback) {

            callback(Error('connect failed'));
        };

        var server = new Hapi.Server();
        server.connection({ port: 0 });
        server.register(ModelsPlugin, function (err) {

            Code.expect(err).to.be.an.object();

            stub.BaseModel.connect = realConnect;

            done();
        });
    });

	lab.test('should successfuly connect to the api and exposes the base model', function (done) {

        var server = new Hapi.Server();
        var Plugin = {
            register: ModelsPlugin,
            options: Config
        };

        server.connection({ port: 0 });
        server.register(Plugin, function (err) {

            if (err) {
                return done(err);
            }

            Code.expect(server.plugins['hapi-sfdc-models']).to.be.an.object();
            Code.expect(server.plugins['hapi-sfdc-models'].BaseModel).to.exist();

            server.plugins['hapi-sfdc-models'].BaseModel.disconnect();

            done();
        });
    });

	lab.test('should successfuly connect to the api and expose defined models', function (done) {

        var server = new Hapi.Server();
        var Plugin = {
            register: ModelsPlugin,
            options: {
                salesforce: Config.salesforce,
                models: {
                    Dummy: './test/fixtures/dummy-model'
                }
            }
        };

        server.connection({ port: 0 });
        server.register(Plugin, function (err) {

            if (err) {
                return done(err);
            }

            Code.expect(server.plugins['hapi-sfdc-models']).to.be.an.object();
            Code.expect(server.plugins['hapi-sfdc-models'].Dummy).to.exist();

            server.plugins['hapi-sfdc-models'].BaseModel.disconnect();

            done();
        });
    });
});

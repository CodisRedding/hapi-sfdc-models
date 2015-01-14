var Path = require('path');
var BaseModel = require('./lib/base-model');


exports.register = function (server, options, next) {

    var models = options.models || {};
    var salesforce = options.salesforce;

    Object.keys(models).forEach(function (key) {

        models[key] = require(Path.join(process.cwd(), models[key]));
    });

    BaseModel.connect(salesforce, function (err, db) {

        if (err) {
            server.log('Error connecting to SFDC via BaseModel.');
            return next(err);
        }

        Object.keys(models).forEach(function (key) {

            server.expose(key, models[key]);
        });

        server.expose('BaseModel', BaseModel);

        next();
    });
};


exports.BaseModel = BaseModel;


exports.register.attributes = {
    pkg: require('./package.json')
};
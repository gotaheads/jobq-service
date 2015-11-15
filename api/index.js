var express = require('express')

module.exports = (function(name, database) {
    'use strict';
    var api = express.Router()
    var pg = database.pg

    //api.createGetRoute = function(route, query, transform) {
    //    api.route(route)
    //        .get(function (req, res) {
    //            console.log('get values')
    //
    //            async.series([
    //                    function (callback) {
    //                        database.get(pg, query, function(err, found) {
    //                            if(err) {callback(err);}
    //                            res.json(_.isFunction(transform)?transform(found):found);
    //                            callback();
    //                        });
    //                    }
    //                ],
    //                function (err) {
    //                    api.handleError(err, res);
    //                });
    //        });
    //}
    //
    //api.handleError = function(err, res) {
    //    console.error('api.handleError error: %j', err)
    //    if(!err) {
    //        return false;
    //    }
    //    var statusCode = err.statusCode;
    //    res.status(statusCode?statusCode:500);
    //    res.send(err.detail);
    //    return true;
    //}

    //api.use(function(req, res, next) {
    //    next(); // make sure we go to the next routes and don't stop here
    //});

    //api.get('/', function(req, res) {
    //    res.json({ message: 'Welcome to the API.' });
    //});

    api = require('./quotes/index')(api, database);

    return api;
});
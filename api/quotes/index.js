var mongodb = require("mongodb");
var BSON = mongodb.BSONPure;
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

module.exports = (function (api, database) {
    'use strict';
    api.route('/quotes/:id')
        .put(function (req, res) {
            var id = req.params.id,
                quote = req.body,
                jobId = quote._jobId;
                quote._id = ObjectID.createFromHexString(id)

            console.log('put id:%s v:%s, ', id, quote.version, jobId)

            database.collection('jobs').findOne({'_id': ObjectID.createFromHexString(jobId)}, function(err, result) {
                console.log('job found: %s', result._id);
                var job = result;
                job.version = quote.version;
                job.updated = quote.updated;
                job.finalPrice = quote.finalPrice;
                database.collection('jobs').updateById(jobId, job, function(err, result) {
                //database.collection('jobs').updateById({'_id': ObjectID.createFromHexString(jobId)}, job, function(err, result) {
                    if(err) {
                        console.error('error')
                    }
                    console.log('job saved: %s', job.updated);
                });
                database.collection('quotes').updateById(id, quote, function(err, result) {
                //database.collection('quotes').updateById({'_id': ObjectID.createFromHexString(id)}, quote, function(err, result) {
                    if(err) {
                        console.error('error')
                    }

                    console.log('quote saved: %s', quote.updated);

                    res.json(quote);
                });
                //res.json(quote);
            });




        });
    return api;
});

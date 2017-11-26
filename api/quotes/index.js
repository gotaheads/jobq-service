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

            console.log('/quotes/:id put id:%s v:%s, ', id, quote.version, jobId)

            database.collection('jobs').findOne({'_id': ObjectID.createFromHexString(jobId)}, function(err, result) {
                console.log('/quotes/:id job found: %s', result._id);
                var job = result;
                job.version = quote.version;
                job.updated = quote.updated;
                job.finalPrice = quote.finalPrice;
                database.collection('jobs').updateById(jobId, job, function(err, result) {
                    if(err) {
                        console.error('error')
                    }
                    console.log('/quotes/:id put job saved: %s', job.updated);
                });
                database.collection('quotes').updateById(id, quote, function(err, result) {
                    if(err) {
                        console.error('error')
                    }

                    console.log('/quotes/:id put quote saved: %s', quote.updated);

                    res.json(quote);
                });
            });

        });
    return api;
});

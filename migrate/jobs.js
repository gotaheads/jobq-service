Client = require('node-rest-client').Client;
Promise = require("bluebird");
http = require("http");
superagent = require('superagent');

config = require('./config').config

//mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/dfl');

exports.jobs = (function() {
    var jobs = {}

    var client = new Client();
    jobs.put = function (job) {
        return new Promise(function (resolve) {
            url = config.target.createUrl('/jobs/' + job._id)
            console.log('putting job: %s, quotes:%s quote:%s', url, job.quotes.length, job.quote.id)
            superagent.put(url)
                .send(job)
                .end(function(e, res){
                    resolve(job);
                })

            //request.put,(url)
            //    .send(job)
            //    .end(function (err, res) {
            //    });

        });
    }

    jobs.get = function() {
        return new Promise(function(resolve) {
            //url = "http://localhost:3000/dfl/jobs";
            url = config.target.createUrl('/jobs')
            console.log('jobs.get  loading jobs %s', url)
            var request = http.get(url, function (response) {
                // data is streamed in chunks from the server
                // so we have to handle the "data" event
                var buffer = "",
                    data,
                    route;

                response.on("data", function (chunk) {
                    buffer += chunk;
                });

                response.on("end", function (err) {
                    data = JSON.parse(buffer);
                    console.log('data:%s, len:%s, typeof:%s',data, data.length, typeof data);
                    ids = [], jobs = []
                    data.forEach(function(job) {
                        console.log('data:%s %s',job.quoteId, job.id);
                        ids.push({id:job.id, quoteId:job.quoteId, _id:job._id})
                        jobs.push(job)
                    })
                    console.log('ids:%s, %s',ids.length, ids);

                    resolve(jobs);
                });
            });
        });

    }

    jobs.post = function(job) {
        return new Promise(function(resolve) {
            //console.log('job: %j', job)
            var args = {
                data: job,
                headers: {"Content-Type": "application/json"}
            };

            url = config.target.createUrl('/jobs')
            console.log('job post url: %s', url)
            superagent.post(url)
                .send(job)
                .end(function(e, res){
                    console.log('created: %j', res)
                    //console.log('created: %s', url + '/' + res._id)
                    resolve(job);
                })

            //client.post(url, args, function (data, response) {
            //    console.log('created: %j', data)
            //    //console.log('created: %s', url + '/' + data._id)
            //    resolve(data);
            //})
        })
    }


    return jobs

})()
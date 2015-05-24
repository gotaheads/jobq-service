Client = require('node-rest-client').Client;
Promise = require("bluebird");
http = require("http");
request = require('superagent');

config = require('./config').config

//mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/dfl');

exports.jobs = (function() {
    var jobs = {}

    var client = new Client();

    jobs.get = function() {
        return new Promise(function(resolve) {
            //url = "http://localhost:3000/dfl/jobs";
            var request = http.get(config.target.createUrl('/jobs'), function (response) {
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
                    ids = []
                    data.forEach(function(job) {
                        console.log('data:%s %s',job.quoteId, job.id);
                        ids.push({id:job.id, quoteId:job.quoteId, _id:job._id})
                        //ids.push({id:job.id, quoteId:job.quoteId, job:job})

                    })
                    console.log('ids:%s, %s',ids.length, ids);

                    resolve(ids);
                });
            });
        });

    }

    jobs.post = function(job) {
        console.log('job: %j', job)
        var args = {
            data: job,
            headers: {"Content-Type": "application/json"}
        };

        url = config.target.createUrl('/jobs')
        console.log('job post url: %s', url)
        client.post(url, args, function (data, response) {
            //console.log('created: %s', data._id);
        });
    }

    return jobs

})()
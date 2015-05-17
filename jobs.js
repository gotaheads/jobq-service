var Client = require('node-rest-client').Client;

exports.jobs = (function() {
    var jobs = {}

    var client = new Client();


    jobs.post = function(job) {
        console.log('job: %j', job)
        // set content-type header and data as json in args parameter
        var args = {
            data: job,
            headers: {"Content-Type": "application/json"}
        };

        client.post("http://localhost:3000/dfl/jobs", args, function (data, response) {
            // parsed response body as js object
            //console.log(data);
            // raw response
            //console.log(response);
        });
        //
        //client.get("http://localhost:3000/dfl/jobs", function (data, response) {
        //    // parsed response body as js object
        //    console.log('get: %J', data);
        //    // raw response
        //    //console.log(response);
        //});
    }

    return jobs

})()
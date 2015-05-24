Promise = require("bluebird");
request = require('superagent');
curl = require('curlrequest')

config = require('./config').config

jobs = require('./jobs').jobs
quotes = require('./quotes').quotes

module.exports.landscapequoting = (function () {
    console.log('starting landscapequoting with %j', config)

    landscapequoting = {}

    landscapequoting.loadQuotes = function() {
        jobs.get().then(function(jobs) {
            console.log('loading quotes for: %s jobs', jobs.length);
            jobs.forEach(function(j) {
                console.log('loading quote for: %s', j.id);

                landscapequoting.loadQuote(j.quoteId).then()

            })

        })
    }

    landscapequoting.loadQuote = function (id) {
        return new Promise(function (resolve) {
            url = config.src.createUrl('/job/quote/'+id)

            console.log('getting quote: %s', url)

            request.get(url).end(function(err, res) {
                //console.log('quote loaded: %s, status:%s, err:%s', res.text, res.status,
                //    res.text.indexOf('Internal Server Error'))
                s = res.text

                if(s.indexOf('Internal Server Error') > -1) {
                    return;
                }

                s = s.replace(/\n/g, "\\n"),
                quote = JSON.parse(s)

                quotes.post(s)

                resolve(s);

            });

        });
    }

    landscapequoting.loadJobs = function () {
        return new Promise(function (resolve) {
            var url =  config.src.createUrl('/jobs')

            request.get(url).end(function(err, res) {
                console.log('jobs loaded: %s, status:%s, err:%s', res.text, res.status)

                s = res.text
                s = s.replace(/\n/g, "\\n"),
                jobsLoaded = JSON.parse(s)

                jobsLoaded.forEach(function (j) {
                    jobs.post(j)
                })

                resolve(jobsLoaded);

            });

        });

    }
    return landscapequoting
})()

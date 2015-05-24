Promise = require("bluebird");
request = require('superagent');
curl = require('curlrequest')

config = require('./config').config
toJson = config.toJson

jobs = require('./jobs').jobs
quotes = require('./quotes').quotes
userProfiles = require('./userProfiles').userProfiles

module.exports.landscapequoting = (function () {
    console.log('starting landscapequoting with %j', config)

    landscapequoting = {}

    landscapequoting.loadUserProfiles = function() {
        userProfiles.get().then(function(userProfile) {
            console.log('loading userProfile for: %s userProfile', userProfile);
            userProfiles.post(userProfile)
        })
    }

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
            console.log('loading quote: %s', url)
            request.get(url).end(function(err, res) {
                quote = toJson(err, res)

                if(!quote) return

                quotes.post(quote)

                resolve(s);

            });

        });
    }

    landscapequoting.loadJobs = function () {
        return new Promise(function (resolve) {
            var url =  config.src.createUrl('/jobs')
            console.log('loading jobs: %s', url)
            request.get(url).end(function(err, res) {
                jobsLoaded = toJson(err, res)
                jobsLoaded.forEach(function (j) {
                    jobs.post(j)
                })
                resolve(jobsLoaded);

            });

        });

    }
    return landscapequoting
})()

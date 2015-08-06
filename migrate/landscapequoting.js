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

    landscapequoting = {},jobQuote = []

    landscapequoting.loadUserProfiles = function() {
        userProfiles.get().then(function(userProfile) {
            console.log('loading userProfile for: %s userProfile', userProfile);
            userProfiles.post(userProfile)
        })
    }

    landscapequoting.loadQuotes = function() {
        jobs.get().then(function(jobsLoaded) {
            console.log('loading quotes for: %s jobs', jobsLoaded.length);
            jobsLoaded.forEach(function(job) {
                console.log('loading quote for job id: %s, new job id: %s', job.id,job._id);

                landscapequoting.loadQuote(job.quoteId, job).then(function(quote) {

                    console.log('loaded quote job to update the _quoteId: %s', quote._id);

                    jobs.find(quote._jobId).then(function(job) {
                        console.log('got job to update: j:%s | q:%s', job._id, quote._id);
                        job._quoteId = quote._id
                        jobs.put(job)
                    })
                })

            })

        })

    }

    landscapequoting.loadQuote = function (id, job) {
        return new Promise(function (resolve) {
            url = config.src.createUrl('/job/quote/'+id)
            console.log('loading quote: %s for job %s', url, job)
            request.get(url).end(function(err, res) {
                quote = config.src.toJson(err, res)

                if(!quote) return
                quote._jobId = job._id

                quotes.post(quote).then(function(id) {
                    jobQuote.push({jobId:job._id, quoteIdSrc:id})
                    console.log('quote created: %s', id)
                    quote._id = id
                    resolve(quote);
                })

            });

        });
    }

    landscapequoting.loadJobs = function () {
        return new Promise(function (resolve) {
            var url =  config.src.createUrl('/jobs')
            console.log('loading jobs: %s', url)
            request.get(url).end(function(err, res) {
                jobsLoaded = config.src.toJson(err, res)
                jobsLoaded.forEach(function (j) {
                    jobs.post(j).then(function(id) {
                        console.log('job created: %s', id)
                        j._id = id
                    })
                })
                resolve(jobsLoaded);

            });

        });

    }
    return landscapequoting
})()

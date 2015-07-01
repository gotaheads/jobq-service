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
            jobs.forEach(function(job) {
                console.log('loading quote for: %s', job.id);

                landscapequoting.loadQuote(job).then()

            })

        })
    }

    landscapequoting.loadQuote = function (job) {
        return new Promise(function (resolve) {
            url = config.src.createUrl('/job/quote/'+job.quoteId)
            console.log('loading quote: %s', url)
            request.get(url).end(function(err, res) {
                quote = toJson(err, res)

                if(!quote) return

                //delete quote._id
                //job.migrated = true
                //job.quote = quote
                job.quotes.push(quote)


                jobs.post(job)
                .then(function(job) {
                    console.log('job saved: %s', job.migrated);
                    resolve(s);
                })
                //quotes.post(quote)



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

                    landscapequoting.loadQuote(j)

                    //jobs.post(j)
                })
                resolve(jobsLoaded);

            });

        });

    }
    return landscapequoting
})()

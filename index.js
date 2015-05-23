console.log('starting..');
//fs = require('fs');
//curl = require('curlrequest'),
jobs = require('./jobs').jobs,
//quotes = require('./quotes').quotes,
landscapequoting = require('./landscapequoting').landscapequoting
exports.jobs = function() {
    console.log('starting module..');


    jobs.get().then(function(jobs) {
        jobs.forEach(function(j) {
            console.log('loaded: %j', j);

            landscapequoting.loadQuota(j.quoteId).then()

        })

    })

}()
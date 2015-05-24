jobs = require('./jobs').loadJobs,
landscapequoting = require('./landscapequoting').landscapequoting
exports.loadQuotes = function() {
    console.log('starting loadQuotes..');

    jobs.get().then(function(jobs) {
        jobs.forEach(function(j) {
            console.log('loaded: %j', j);

            landscapequoting.loadQuota(j.quoteId).then()

        })

    })

}()
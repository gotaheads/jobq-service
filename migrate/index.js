landscapequoting = require('./landscapequoting').landscapequoting

exports.loadLandscapequoting = function() {
    console.log('starting loadLandscapequoting..')

    landscapequoting.loadJobs().then(function(loaded) {
        console.log(('loadLandscapequoting loaded: %s', loaded.length))
        landscapequoting.loadQuotes()
    })

    //landscapequoting.loadUserProfiles()

}()
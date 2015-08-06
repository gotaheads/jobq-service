Promise = require("bluebird");
request = require('superagent');

config = require('./config').config
toJson = config.toJson

exports.userProfiles = (function() {
    var userProfiles = {}

    var client = new Client();
//http://localhost:8000/restlet/user-profile/admin
    userProfiles.get = function() {
        return new Promise(function(resolve) {
            url = config.src.createUrl('/user-profile/admin')
            request.get(url).end(function(err, res) {
                userProfile = config.src.toJson(err, res)
                if(!userProfile) return
                resolve(userProfile);

            });
        });

    }
    userProfiles.post = function(userProfile) {
        return new Promise(function(resolve, reject) {
            url = config.target.createUrl('/userprofiles')
            //console.log('post userProfile: %s, %j', url, userProfile)
            request.post(url, userProfile).end(function(err, res) {
                console.log('res: %s', res.status)
            });
        });

    }

    return userProfiles

})()
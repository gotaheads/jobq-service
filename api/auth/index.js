/**
 * Created by gota on 28/11/17.
 */

module.exports = (function (api, proxyHost, secret) {
    'use strict';
    var bodyParser = require('body-parser');
    var jsonParser = bodyParser.json();
    var jsonwebtoken = require('jsonwebtoken');
    const request = require('superagent');
    const R = require('ramda');
    const passwd = require('./password');
    const proxyUrl = `http://${proxyHost}`;
    var dbauth = require('mongoskin').db(`mongodb://localhost:27017/jobq`);
    var name = 'DFL';
    api.post('/auth', jsonParser, function (req, res) {
            var user = req.body;
            const urlUsers = `${proxyUrl}/jobq/users`;
            let authenticated;

            console.log('/auth %s %s %s, urlUsers: %s', user.username, user.password,
                passwd.cryptPassword(user.password), urlUsers);

            request.get(urlUsers).then(res => {
                console.log('/auth res.body: %s', res.body)
                authenticated = passwd.findMaching(user, R.prop('body',res));

                const urlUserprofiles = `${proxyUrl}/${authenticated.path}/userprofiles`;
                console.log('authenticated: %j, R.isEmpty(authenticated): %s, urlUserprofiles: %s',
                    authenticated, R.isEmpty(authenticated),
                    urlUserprofiles);

                return R.isEmpty(authenticated)?Promise.reject({}):request.get(urlUserprofiles);
            }).then(res2 => {
                const userProfiles = R.prop('body',res2);
                console.log('userProfiles: %j', R.prop('length',userProfiles));

                const userProfile = userProfiles[0];

                userProfile.path = user.path = authenticated.path;
                userProfile.loggedIn = new Date();
                userProfile.token = jsonwebtoken.sign(user, secret)
                console.log('userProfile.business: %j', R.prop('business', userProfile));
                res.status(200).json(userProfile);
                console.log('all good');
            })
                .catch(_=> {
                    console.log('rejected');
                    res.status(403).send('Invalid login.');
                });
        });
    return api;
});

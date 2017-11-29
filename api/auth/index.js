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
            let authenticated;

            console.log('/auth %s %s %s', user.username, user.password,
                passwd.cryptPassword(user.password));
            request.get(`${proxyUrl}/jobq/users`).then(res => {
                const users = R.prop('body',res)
                console.log('users: %j', users);
                authenticated = users.filter(toCheck => {
                    console.log('compare %s', passwd.comparePassword(user.password, toCheck.password));
                    return R.equals(toCheck.username, R.prop('username', user)) &&
                        passwd.comparePassword(user.password, toCheck.password)
                })[0];

                console.log('authenticated: %j, R.isEmpty(authenticated): %s', authenticated, R.isEmpty(authenticated));

                return R.isEmpty(authenticated)?Promise.reject({}):
                    request.get(`${proxyUrl}/${authenticated.path}/userprofiles`);
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

            //
            // if(user.username === 'admin' && user.password === 'dflgertrude') {
            //     var token = jsonwebtoken.sign({ user: user }, secret);
            //     db.collection('userprofiles').find().toArray(function(err, result) {
            //         if (err) throw err;
            //         var userProfile = result[0];
            //         userProfile.loggedIn = new Date();
            //         console.log('userProfile', R.prop('business', userProfile));
            //         userProfile.token = token;
            //         res.status(200).json(userProfile);
            //     });
            //     return;
            // }
            //
            // res.status(403).send('Invalid login.');
        });
    return api;
});

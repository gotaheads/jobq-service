var express = require('express');
var proxy = require('express-http-proxy');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jsonwebtoken = require('jsonwebtoken');
var jwt = require("express-jwt");
var unless = require('express-unless');

const proxyHost = 'localhost:3200';
const proxyUrl = `http://${proxyHost}`;
const request = require('superagent');
const R = require('ramda');

const dbpath = 'dfl1';
var db = require('mongoskin').db(`mongodb://localhost:27017/${dbpath}`);
var secret = 'jobq-secret-aws-u14123654789874';
var name = 'DFL';

app.use(express.static('app'));
var jwtCheck = jwt({
    secret: secret
});
jwtCheck.unless = unless;
app.use(jwtCheck.unless({path: ['*.html', '/auth', '/favicon.ico', '*.ico', '*.css']}));
app.use('/api', proxy(proxyHost, {
    forwardPath: function(req, res) {
        //var token = req.headers['token'];
        //console.log('api token: %s', token)
        //jwt.verify(token, secret, function(err, decoded) {
        //    if(err) {
        //        res.status(403).send('Not authorised.');
        //        return;
        //    }
        //    console.log('user: ' + decoded.user);
        //});
        //var decoded = jwt.verify(token, secret);

        return require('url').parse(req.url).path;
    }
}));

app.use(bodyParser.json())
var api = require('./api/index')(name, db)
app.use('/api2', api);

var dbauth = require('mongoskin').db(`mongodb://localhost:27017/jobq`);

app.post('/auth', jsonParser, function (req, res) {
    var user = req.body;
    console.log('/auth %s %s', user.username, user.password);
    request.get(`${proxyUrl}/jobq/users`).then(res => {
        const users = R.prop('body',res)
        console.log('users: %j', users);
        const found = users.filter(toCheck => {
                            return R.equals(toCheck.username, R.prop('username', user)) &&
                                   R.equals(toCheck.password, R.prop('password', user))
        })[0];
        console.log('found: %j', found);
        return !!found?request.get(`${proxyUrl}/${found.path}/userprofiles`):Promise.reject({});
    }).then(res2 => {
        const userProfiles = R.prop('body',res2);
        console.log('userProfiles: %j', R.prop('length',userProfiles));
        const userProfile = userProfiles[0];
        userProfile.loggedIn = new Date();
        console.log('userProfile.business: %j', R.prop('business', userProfile));
        const token = jsonwebtoken.sign({ user: user }, secret);
        userProfile.token = token;
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

var server = app.listen(8100, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
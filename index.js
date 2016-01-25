var express = require('express');
var proxy = require('express-http-proxy');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jsonwebtoken = require('jsonwebtoken');
var jwt = require("express-jwt");
var unless = require('express-unless');

var db = require('mongoskin').db('mongodb://localhost:27017/dfl1');

var secret = 'jobq-secret-aws-u14123654789874';

var name = 'DFL';

app.use(express.static('app'));
var jwtCheck = jwt({
    secret: secret
});
jwtCheck.unless = unless;
app.use(jwtCheck.unless({path: ['*.html', '/auth']}));
app.use('/api', proxy('localhost:3200', {
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


app.post('/auth', jsonParser, function (req, res) {
    var user = req.body;
    console.log('/auth %s %s', user.username, user.password);

    if(user.username === 'admin' && user.password === 'dflgertrude') {

        var token = jsonwebtoken.sign({ user: user }, secret);

        db.collection('userprofiles').find().toArray(function(err, result) {
            if (err) throw err;
            var userProfile = result[0];
            userProfile.loggedIn = new Date();
            console.log(userProfile);
            userProfile.token = token;
            res.status(200).json(userProfile);
        });
        return;
    }

    res.status(403)
        .send('Invalid login.');
});

//app.get('/api', function (req, res) {
//    db.collection('userprofiles').find().toArray(function(err, result) {
//        if (err) throw err;
//        console.log(result);
//        res.json(result);
//    });
//});

var server = app.listen(8100, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
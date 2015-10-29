var express = require('express');
var proxy = require('express-http-proxy');
var app = express();

var db = require('mongoskin').db('mongodb://localhost:27017/dfl201543212210');

app.use(express.static('app'));

app.use('/api', proxy('localhost:3200', {
    forwardPath: function(req, res) {
        return require('url').parse(req.url).path;
    }
}));

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
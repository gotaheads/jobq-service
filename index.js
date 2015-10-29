var express = require('express');
var app = express();

var db = require('mongoskin').db('mongodb://localhost:27017/dfl201543212210');


app.get('/', function (req, res) {
    db.collection('userprofiles').find().toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
});

var server = app.listen(3100, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
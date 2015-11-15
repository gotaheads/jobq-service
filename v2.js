var express = require('express');
var proxy = require('express-http-proxy');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('v2'));

var server = app.listen(8200, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

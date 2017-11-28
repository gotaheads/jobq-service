require('dotenv').config();

const express = require('express');
const proxy = require('express-http-proxy');
var app = express();
const bodyParser = require('body-parser');

const dbpath = 'dfl1';
const db = require('mongoskin').db(`mongodb://localhost:27017/${dbpath}`);
const name = 'DFL';

app.use(express.static('app'));
app.use(require('./api/app-jwt')(process.env.SECRET).unless({path: ['*.html', '/auth', '/favicon.ico', '*.ico', '*.css']}));
app.use('/api', proxy(process.env.PROXY_HOST, {
    forwardPath: (req, res) => require('url').parse(req.url).path
}));

app.use(bodyParser.json())
app.use('/api2', require('./api/index')(name, db))
app = require('./api/auth/index')(app, process.env.PROXY_HOST, process.env.SECRET)

var server = app.listen(8100, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('API listening at http://%s:%s', host, port);
});
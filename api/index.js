var express = require('express')

module.exports = (function(name, database) {
    'use strict';
    var api = express.Router()
    api = require('./quotes/index')(api, database);
    return api;
});
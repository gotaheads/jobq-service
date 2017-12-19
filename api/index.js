var express = require('express')

module.exports = (function() {
    'use strict';
    var api = express.Router()
    api = require('./quotes/index')(api);
    api = require('./items/index')(api);

    return api;
})();
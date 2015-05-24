Client = require('node-rest-client').Client;
Promise = require("bluebird");
var http = require("http");

config = require('./config').config
//mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/dfl');

exports.quotes = (function() {
    var quotes = {}

    var client = new Client();

    quotes.get = function() {
        return new Promise(function(resolve) {
            url = "http://localhost:3000/dfl/quotes";
            var request = http.get(url, function (response) {
                var buffer = "",
                    data,
                    route;

                response.on("data", function (chunk) {
                    buffer += chunk;
                });

                response.on("end", function (err) {
                    data = JSON.parse(buffer);
                    console.log('data:%s, len:%s, typeof:%s',data, data.length, typeof data);
                    ids = []
                    data.forEach(function(quota) {
                        console.log('data:%s %s',quota.quoteId, quota.id);
                        ids.push({id:quota.id, quoteId:quota.quoteId, _id:quota._id})

                    })
                    console.log('ids:%s, %j',ids.length, ids);

                    resolve(ids);
                });
            });
        });

    }
    quotes.post = function(quote) {
        console.log('quote: %s', quote.id)
        var args = {
            data: quote,
            headers: {"Content-Type": "application/json"}
        };

        url = config.target.createUrl('/quotes')
        console.log('quotes post url: %s', url)
        client.post(url, args, function (data, response) {
            //console.log('created: %s', data);
        });
    }

    return quotes

})()
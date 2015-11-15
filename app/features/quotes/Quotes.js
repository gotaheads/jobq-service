'use strict';

var servicesModuleQuotes =
    angular.module('jobq.quotes', []).factory('Quotes',
        function ($http, $log) {

            var Quotes = {}
                ;
            function createUrl(path) {
                return '/api2' + path;
            }

            Quotes.save = function(quote) {
                var json = JSON.stringify(quote);
                $log.info('Quotes.save json is ' + json);
                return $http.put(createUrl('/quotes/'+ quote._id), json);
            }

            return Quotes;
        });


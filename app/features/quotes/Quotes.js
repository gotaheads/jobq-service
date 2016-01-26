'use strict';


angular.module('jobq.quotes', []).factory('Quotes',
    function ($http, $log, Apis) {
        var Quotes = {}
            ;

        Quotes.save = function(quote) {
            var json = JSON.stringify(quote);
            $log.info('Quotes.save json is ' + json);
            return $http.put(Apis.createUrl('/quotes/'+ quote._id), json);
        }

        return Quotes;
    });


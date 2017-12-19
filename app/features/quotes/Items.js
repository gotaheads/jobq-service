/**
 * Created by gota on 19/12/17.
 */
'use strict';

angular.module('jobq.items', []).factory('Items',
    function ($http, $log, Apis) {
        var Items = {}
        ;

        Items.load = function() {
            $log.info('Items.load');
            return $http.get(Apis.createApi2Url('/items'));
        }

        return Items;
    });


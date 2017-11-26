'use strict';

/* Services */
angular.module('jobq.services', []).value('version', '0.9.1');

var loadingInProgress = false;
angular.module('jobq.spinnerServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            loadingInProgress = true;
            window.setTimeout(function() {
                if(loadingInProgress) {
                    $('#loading').show();
                }
            },200);

            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
    // register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                loadingInProgress = false;
                // do something on success
                // todo hide the spinner
                $('#loading').hide();
                return response;

            }, function (response) {
                loadingInProgress = false;
                // do something on error
                // todo hide the spinner
                $('#loading').hide();
                return $q.reject(response);
            });
        };
    })



var servicesModule =
angular.module('jobq.services', ['ngResource'])
.value('version', '0.9');

servicesModule.factory('ContractService',
    ['$rootScope', '$routeParams', '$http', '$log',
     'QuoteService','Apis',
    function ($rootScope, $routeParams, $http, $log,
              QuoteService,Apis) {

    var ContractService = {};

    ContractService.findOrCreate = function($scope) {
        QuoteService.load($scope, 'contract');

        $scope.save = function() {
            ContractService.save($scope.editing).then(function(result) {
                $scope.$log.info("ContractService save finished " + result.data);
                $rootScope.currentQuote = result.data;
            });
        };

    };


    ContractService.find = function(quoteId) {
        $log.info('find quoteId is ' + quoteId);
        return $http.get(Apis.createApiUrl('/quotes/' + quoteId));
    }

    ContractService.save = function(param) {
        var json = JSON.stringify(param),id = param._id;
        $log.info('save id: ' + id  + '  '+ json);
        return $http.put(Apis.createApiUrl('/quotes/'+ id), param);
    }

    return ContractService;
}]);

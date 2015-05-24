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


servicesModule.factory('JobService', ['$rootScope', '$http', '$log', function ($rootScope, $http, $log) {
    var JobService = {};
    JobService.updateActions = function($scope) {
        $rootScope.jobTabs[0].id = $scope.editing.id;
        $rootScope.jobTabs[1].id = $scope.userProfile.id;
        $rootScope.updateQuoteActions($scope);
    }
        
    JobService.saveJob = function(param) {
        var json = JSON.stringify(param);
        $log.info('saveJob json is ' + json);
        return $http.put('/restlet/jobs/'+ param.id, json);
    }

    JobService.remove = function(param) {
        var json = JSON.stringify(param);
        $log.info('saveJob json is ' + json);
        return $http({method: 'DELETE', url: '/restlet/jobs/'+ param.id} );
    }
    

    return JobService;
}]);

servicesModule.factory('ContractService',
    ['$rootScope', '$routeParams', '$http', '$log',
     'QuoteService',
    function ($rootScope, $routeParams, $http, $log,
              QuoteService) {

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
        return $http.get('/restlet/job/quote/' + quoteId);
    }

    ContractService.save = function(param) {
        var json = JSON.stringify(param);
        $log.info('save id: ' + param.id  + '  '+ json);
        return $http.put('/restlet/job/quote/'+ param.id, param);
    }

    return ContractService;
}]);

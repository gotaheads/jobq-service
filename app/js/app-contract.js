'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('jobq', ['jobq.filters']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/contract/:quoteId', {templateUrl: 'partials/contract.html', controller: ViewContractCtrl});
  }]);

myApp.run(['$rootScope', '$location', '$http', '$log',function($rootScope, $location, $http, $log) {
    $rootScope.location = $location;
    $rootScope.$log = $log;

    $rootScope.hostname = window.location.hostname;
    $log.info('myApp hostname: ' + $rootScope.hostname);
    $log.info('myApp path: ' + $rootScope.location.path());
    
    $rootScope.loadUserProfile = function()  {
        $http.get('/restlet/user-profile/' + 'admin').success(function(up) {
            $rootScope.userProfile = up.userProfile;
            $rootScope.userProfile.business = up.business;
            $rootScope.userProfile.template = up.template;
        });
    }
    $rootScope.loadUserProfile();

    $rootScope.$on('$routeChangeStart', function(evt, cur, prev) {
        $log.info('$routeChangeStart...');
    })

    $rootScope.stringify = function(data) {
        return  JSON.stringify(data);
    }

}]);

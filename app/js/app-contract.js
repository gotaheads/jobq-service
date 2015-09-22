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
        var url = 'http://localhost:3000/dfl201522242105/userprofiles/5561b460012c3cff1b35313c'
        $http.get(url).success(function(up) {
            $rootScope.userProfile = up.userProfile;
            $rootScope.userProfile.business = up.business;
            $rootScope.userProfile.template = up.template;
            return $rootScope.userProfile;
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

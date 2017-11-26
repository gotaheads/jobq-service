'use strict';
function DashboardCtrl($scope, $http, Apis) {
    var url = Apis.createApiUrl('/jobs');
    $http.get(url).success(function(jobs) {
        $scope.jobs = jobs;
    });


}
DashboardCtrl.$inject = ['$scope','$http', 'Apis'];


//angular.module('jobq')
//    .controller('DashboardCtrl', function ($scope, $http) {
//
//    var url = createUrl('/jobs');
//    $http.get(url).success(function(jobs) {
//        $scope.jobs = jobs;
//    });
//
//});

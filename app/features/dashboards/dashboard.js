'use strict';
function DashboardCtrl($scope, $http) {
    var url = createUrl('/jobs');
    $http.get(url).success(function(jobs) {
        $scope.jobs = jobs;
    });


}
DashboardCtrl.$inject = ['$scope','$http'];


//angular.module('jobq')
//    .controller('DashboardCtrl', function ($scope, $http) {
//
//    var url = createUrl('/jobs');
//    $http.get(url).success(function(jobs) {
//        $scope.jobs = jobs;
//    });
//
//});

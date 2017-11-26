'use strict';
function DashboardCtrl($scope, $http, Apis) {
    var url = Apis.createApiUrl('/jobs');
    $http.get(url).success(function(jobs) {
        $scope.jobs = jobs;
    });
}

DashboardCtrl.$inject = ['$scope','$http', 'Apis'];

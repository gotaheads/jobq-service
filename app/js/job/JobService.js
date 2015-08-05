
servicesModule.factory('JobService', ['$rootScope', '$http', '$log', function ($rootScope, $http, $log) {
    var JobService = {};
    JobService.updateActions = function($scope) {
        $rootScope.jobTabs[0].id = $scope.editing._id;
        $rootScope.jobTabs[1].id = $scope.userProfile.id;
        $rootScope.updateQuoteActions($scope);
    }

    JobService.saveJob = function(job) {
        var json = JSON.stringify(job);
        $log.info('saveJob json is ' + json);
        var url = createUrl('/jobs/' + job._id);
        return $http.put(url, json);
    }

    JobService.remove = function(param) {
        var json = JSON.stringify(param);
        $log.info('saveJob json is ' + json);
        var url = createUrl('/jobs/' + param.id);
        return $http({method: 'DELETE', url: url} );
    }


    return JobService;
}]);

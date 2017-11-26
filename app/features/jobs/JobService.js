
servicesModule.factory('JobService',
    ['$rootScope', '$http', '$log', '$q','Apis',
        function ($rootScope, $http, $log, $q, Apis) {
    var JobService = {};

    JobService.loadJobOnly = function (jobId) {
        $log.info('JobService.loadJobOnly jobId: ', jobId);
        var url = Apis.createApiUrl('/jobs/' + jobId);
        return $http.get(url);
    }

    JobService.load = function(jobId) {
        $log.info('JobService.load jobId: ', jobId);
        var url = Apis.createApiUrl('/jobs/' + jobId),
            job;
        return $http.get(url).then(function(res) {
            job = res.data;
            url = Apis.createApiUrl('/quotes/' + job._quoteId)
            return $http.get(url);
        }).then(function(res) {
            job.quote = res.data;
            return job;
        });
    }

    JobService.updateActions = function($scope) {
        $log.info('JobService.updateActions $scope.editing._id: ', $scope.editing._id);
        var jobId = $rootScope.jobTabs[0].id = $scope.editing._id;
        var quoteId = $rootScope.jobTabs[1].id = $scope.editing._quoteId;
        $rootScope.updateQuoteActions($scope, jobId, quoteId);
    }

    JobService.saveJob = function(job) {
        $log.info('JobService.saveJob job: ', job);
        var toSave = angular.copy(job);
        toSave.quote.works.forEach(function (work) {
            delete work.$$hashKey;
        })

        var json = JSON.stringify(toSave);
        $log.info('saveJob json is ' + json);
        var url = Apis.createApiUrl('/jobs/' + job._id);
        return $http.put(url, json);
    }

    JobService.remove = function(param) {
        var json = JSON.stringify(param);
        $log.info('saveJob json is ' + json);
        var url = Apis.createApiUrl('/jobs/' + param._id);
        return $http({method: 'DELETE', url: url} );
    }


    return JobService;
}]);

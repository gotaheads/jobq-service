
servicesModule.factory('JobService',
    ['$rootScope', '$http', '$log', '$q', function ($rootScope, $http, $log, $q) {
    var JobService = {};

    JobService.load = function(jobId) {
        var url = createUrl('/jobs/' + jobId),
            job;
        var deferred = $q.defer();
        var promise = deferred.promise;

        return $http.get(url).then(function(res) {
            job = res.data;
            url = createUrl('/quotes/' + job._quoteId)
            return $http.get(url);
        }).then(function(res) {
            job.quote = res.data;
            return job;
        });
    }

    JobService.updateActions = function($scope) {
        var jobId = $rootScope.jobTabs[0].id = $scope.editing._id;
        var quoteId = $rootScope.jobTabs[1].id = $scope.editing._quoteId;
        $rootScope.updateQuoteActions($scope, jobId, quoteId);
    }

    JobService.saveJob = function(job) {
        var toSave = angular.clone(job);
        toSave.quote.works.forEach(function (work) {
            delete work.$$hashKey;
        })

        var json = JSON.stringify(toSave);
        $log.info('saveJob json is ' + json);
        var url = createUrl('/jobs/' + job._id);
        return $http.put(url, json);
    }

    JobService.remove = function(param) {
        var json = JSON.stringify(param);
        $log.info('saveJob json is ' + json);
        var url = createUrl('/jobs/' + param._id);
        return $http({method: 'DELETE', url: url} );
    }


    return JobService;
}]);

'use strict';


angular.module('jobq').factory('Jobs',
  function ($http, $log, Apis) {
    var Jobs = {}
      ;

    Jobs.findAll = function() {
      var url = Apis.createUrl('/jobs');
      $http.get(url).success(function(jobs) {
        $scope.jobs = jobs;
      });
    }

    return Jobs;
  });


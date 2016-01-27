function PrintJobCtrl($scope, JobService, $http, $routeParams) {
  $scope.jobId = $routeParams.jobId;

  var url = createUrl('/jobs/' + $scope.jobId);
  $http.get(url).success(function(job) {
    $scope.job = job;

    //$scope.quote = job.quotes[0];
  });
}


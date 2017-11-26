function PrintJobCtrl($scope, $log, JobService, $routeParams) {
  $scope.jobId = $routeParams.jobId;
  $log.info('PrintJobCtrl $scope.jobId: ', $scope.jobId);

  JobService.loadJobOnly($scope.jobId).success(function(job) {
    $scope.job = job;
  });
}


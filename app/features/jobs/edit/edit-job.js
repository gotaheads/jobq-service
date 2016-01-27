function EditJobCtrl($scope, JobService, $location, $routeParams, QuoteService) {
  var $log = $scope.$log;
  $scope.title = 'Edit job';
  var jobId = $scope.jobId = $routeParams.jobId;
  $scope.finalised = false;
  $scope.statuses = ['Preparing Quote', 'Quote approved',
    'Work in progress'
    , 'Completed', 'Cancelled'];

  $scope.$log.info("EditJobCtrl " + $scope.jobId);

  var url = createUrl('/jobs/' + $scope.jobId);

  JobService.load(jobId).then(function (job) {
    $scope.job = job;
    $scope.quote = job.quote;
    $scope.editing = job;


    var workIdx = 0;
    //$scope.quote = {};
    $scope.workIdx = workIdx;

    switch (job.status) {
      case 'Completed':
      case 'Cancelled':
        $scope.finalised = true;
    }

    $scope.$watch("editing.client", function (value) {
      console.log("client changed: " + value);
      $scope.quote.client = value;
    }, true);
    $scope.$watch("editing.address", function (value) {
      console.log("address changed: " + value);
      $scope.quote.address = value;
    }, true);
    $scope.$watch("editing.budget", function (value) {
      console.log("Budget changed: " + value);
      $scope.quote.budget = value;
    }, true);

    JobService.updateActions($scope);

    $scope.addRecentJob(job._id, job.client);
  });

  $scope.printQuote = function () {
    $log.info("EditJobCtrl printQuote : " + $scope.quote._id);
    QuoteService.openPrint($scope.quote);
  }

  $scope.printJob = function () {
    var jobId = $scope.job._id;
    $log.info("EditJobCtrl printJob: " + jobId);

    JobService.saveJob($scope.job).then(function (result) {
      var job = result.data;
      $scope.$log.info("saveJob finished " + jobId);
      $location.path('/print-job/' + jobId);
      //window.open(
      //  '#/print-job/' + jobId,
      //  '_blank'
      //);
    });
  }

  $scope.cancel = function () {
    $scope.job.status = 'Cancelled';
    $scope.save();
  }

  $scope.complete = function () {
    $scope.job.status = 'Completed';
    $scope.save();
  }

  $scope.save = function () {
    var job = $scope.job;

    JobService.saveJob(job).then(function (result) {
      $scope.$log.info("saveJob finished " + result.data);

      QuoteService.updateStatus($scope.quote, job);
      QuoteService.updateQuoteStatus(job);
    });
  };

  $scope.remove = function () {
    JobService.remove($scope.job).then(function (result) {
      $scope.$log.info("remove finished " + result.data);
      $scope.location.path('/dashboard');
    });
  };

  $scope.$watch("editing.works", function (value) {
    console.log("Model: " + value);
  }, true);
}

EditJobCtrl.$inject = ['$scope', 'JobService', '$location', '$routeParams', 'QuoteService'];

function EditJobCtrl($scope, JobService, $http, $routeParams, QuoteService) {
    var $log = $scope.$log;
    $scope.title = 'Edit job';
    $scope.jobId = $routeParams.jobId;
    $scope.finalised = false;
    $scope.statuses = ['Preparing Quote', 'Quote approved',
        'Work in progress'
        ,'Completed', 'Cancelled'];

    $scope.$log.info("EditJobCtrl " + $scope.jobId);

    var url = createUrl('/jobs/' + $scope.jobId);
    $http.get(url).success(function(job) {
        $scope.job = job;
        $scope.editing = job;


        var workIdx = job.quotes.length - 1;
        $scope.quote = job.quotes[workIdx];
        $scope.workIdx = workIdx;

        switch(job.status) {
            case 'Completed':
            case 'Cancelled':
                $scope.finalised = true;
        }

        $scope.$watch("editing.client", function(value) {
            console.log("client changed: " + value);
            $scope.quote.client = value;
        },true);
        $scope.$watch("editing.address", function(value) {
            console.log("address changed: " + value);
            $scope.quote.address = value;
        },true);
        $scope.$watch("editing.budget", function(value) {
            console.log("Budget changed: " + value);
            $scope.quote.budget = value;
        },true);

        JobService.updateActions($scope);

        $scope.addRecentJob(job.id, job.client);
    });

    $scope.printQuote = function() {
        $log.info("EditJobCtrl printQuote : " + $scope.userProfile.id);
        QuoteService.openPrint($scope.userProfile);
    }

    $scope.printJob = function() {
        $log.info("EditJobCtrl printJob: " + $scope.job.id);

        JobService.saveJob($scope.job).then(function(result) {
            var job = result.data;
            $scope.$log.info("saveJob finished " + job.id);
            window.open(
                '#/print-job/' + job.id,
                '_blank'
            );
        });
    }

    $scope.cancel = function() {
        $scope.job.status = 'Cancelled';
        $scope.save();
    }

    $scope.complete = function() {
        $scope.job.status = 'Completed';
        $scope.save();
    }

    $scope.save = function() {
        JobService.saveJob($scope.job).then(function(result) {
            $scope.$log.info("saveJob finished " + result.data);

            var job = result.data;

            QuoteService.updateStatus($scope.userProfile, job);
            QuoteService.updateQuoteStatus(job);
        });
    };

    $scope.remove = function() {
        JobService.remove($scope.job).then(function(result) {
            $scope.$log.info("remove finished " + result.data);
            $scope.location.path('/dashboard');
        });
    };

    $scope.$watch("editing.works", function(value) {
        console.log("Model: " + value);
    },true);
}

EditJobCtrl.$inject = ['$scope', 'JobService', '$http', '$routeParams','QuoteService'];
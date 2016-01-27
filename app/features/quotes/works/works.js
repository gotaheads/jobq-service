function EditWorksCtrl($scope, QuoteService) {
  QuoteService.findOrCreateForWorks($scope);


  $scope.remove = function(idx) {
    $scope.utils.remove($scope.editing.works, idx);
    $scope.qot.initRowNumbers($scope.editing.works);
    $scope.qot.updateWorksTotal($scope, $scope.editing);
  }

  $scope.add = function(idx) {
    idx = $scope.utils.add($scope.editing.works, $scope.qot.newWork(), idx);
    $scope.qot.initRowNumbers($scope.editing.works);
    $scope.loadWork(idx);
    $scope.focus('work_' + idx);
  }

  $scope.down = function(idx) {
    $scope.utils.down($scope.editing.works, idx);
    $scope.qot.initRowNumbers($scope.editing.works);
  }

  $scope.up = function(idx) {
    $scope.utils.up($scope.editing.works, idx);
    $scope.qot.initRowNumbers($scope.editing.works);
  }

  $scope.loadWork = function(idx) {
    $scope.$log.info("load Work edit works " + idx);
    $scope.work = $scope.editing.works[idx];
  }

}
EditWorksCtrl.$inject = ['$scope', 'QuoteService'];

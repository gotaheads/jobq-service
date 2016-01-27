function EditOutlineCtrl($scope, QuoteService, $http, $routeParams) {
  $scope.$log.info("EditOutlineCtrl ");

  QuoteService.findOrCreate($scope);

  $scope.remove = function(idx) {
    $scope.utils.remove($scope.work.outlines, idx);
  }

  $scope.add = function(idx) {

    idx = $scope.utils.add($scope.work.outlines, {content:''}, idx);
    $scope.focus('outline_' + idx);
  }

  $scope.down = function(idx) {
    $scope.utils.down($scope.work.outlines, idx);
  }

  $scope.up = function(idx) {
    $scope.utils.up($scope.work.outlines, idx);
  }

  $scope.loadWork = function(idx) {
    $scope.$log.info("load Work " + idx);
    $scope.work = $scope.editing.works[idx];
    //$scope.work = $scope.utils.findById($scope.editing.works, id);
  }

}

EditOutlineCtrl.$inject = ['$scope', 'QuoteService', '$http', '$routeParams'];


function EditContractCtrl($scope, ContractService) {
  ContractService.findOrCreate($scope);

  $scope.remove = function(idx) {
    $scope.utils.remove($scope.editing.contract.sections, idx);
  }

  $scope.add = function(idx) {
    idx = $scope.utils.add($scope.editing.contract.sections, {content:''}, idx);
    $scope.focus('content_' + idx);
  }

  $scope.down = function(idx) {
    $scope.utils.down($scope.editing.contract.sections, idx);
  }

  $scope.up = function(idx) {
    $scope.utils.up($scope.editing.contract.sections, idx);
  }

  function findByTitle(title) {
    var found;
    angular.forEach($scope.editing.works, function(work){
      if(title == work.title) {
        found = work;
      }
    })
    return found;
  }

}
EditContractCtrl.$inject = ['$scope', 'ContractService'];

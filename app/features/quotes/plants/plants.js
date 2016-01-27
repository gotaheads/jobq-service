function EditPlantCtrl($scope, $location, QuoteService, Plants) {
  var $log = $scope.$log;
  QuoteService.findOrCreateForPlants($scope);

  $scope.printPlants = function() {
    $log.info("printPlants save first: " + $scope.quote._id);
    var open = function(quote) {
      $location.path('print-plants/' + quote._id);
      //window.open(
      //  '#/print-plants/' + quote._id,
      //  '_blank'
      //);
    }
    QuoteService.saveCurrent(open);
  }

  //not working.
  $scope.down = function() {
    $log.info("down Item: " + $scope.rowIndex);
    if($scope.rowIndex !== undefined) {
      $scope.utils.down($scope.editing.plants, $scope.rowIndex);
    }
  }

  $scope.remove = function() {
    $scope.$log.info("remove plant: " + $scope.rowIndex + ' ' + $scope.work.plants);
    if($scope.rowIndex !== undefined) {
      $scope.utils.remove($scope.work.plants, $scope.rowIndex);
      $scope.qot.initRowNumbers($scope.work.plants);
      $scope.qot.updatePlantTotal($scope, $scope.editing, $scope.work);

    }
  }

  $scope.updateItemCost = function() {
    $scope.$log.info("updateItemCost: ");
    $scope.qot.updateItemCost($scope.newEntry);
  }

  $scope.addNew = function() {
    $scope.$log.info("addNew plant: ");
    var idx = $scope.work.plants.length;
    $scope.utils.add($scope.work.plants,
      $scope.newEntry);

    $scope.work.plants = Plants.sort($scope.work.plants);
    //
    //$scope.work.plants.sort(function(a,b) {
    //    if(a.botanicalName < b.botanicalName) return -1;
    //    if(a.botanicalName > b.botanicalName) return 1;
    //    return 0;
    //})

    $scope.qot.updatePlantTotal($scope, $scope.editing, $scope.work, idx);
    $scope.newEntry = $scope.qot.newPlant($scope.work.plants.length,
      $scope.userProfile.business, $scope.newEntry.margin);
    $('#newItem').focus();
  }

  $scope.add = function() {
    $scope.$log.info("add plant: ");
    $scope.utils.add($scope.work.plants,
      $scope.qot.newPlant($scope.work.plants.length,
        $scope.userProfile.business));
    $scope.work.plants = Plants.sort($scope.work.plants);
  }

  $scope.cellChanged = function(row, col) {
    var idx = row.rowIndex;
    $scope.$log.info("cellChanged: " + col.field +
    ' re: ' + row.entity[col.field] +
    ' ?: ' + angular.toJson($scope.work.plants[idx]));

    switch(col.field) {
      case 'item':
        if($scope.rowIndex !== undefined) {
          $scope.work.plants[$scope.rowIndex].item =
            $scope.capitalize($scope.work.plants[$scope.rowIndex].item);
        }

        break;
      default:
        $scope.qot.updatePlantTotal($scope, $scope.editing, $scope.work, idx);
    }

  }
}
EditPlantCtrl.$inject = ['$scope', '$location', 'QuoteService', 'Plants'];

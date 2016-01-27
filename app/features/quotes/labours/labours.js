function EditLabourCtrl($scope, QuoteService) {
  var $log = $scope.$log;
  QuoteService.findOrCreateForLabours($scope);

  $scope.typeChanged = function() {
    $scope.$log.info("typeChanged: " + $scope.newLabourEntry.labourType);
    var chargeRate = $scope.findChargeRateByLabour($scope.newLabourEntry.labourType);
    $scope.newLabourEntry.hourlyRate = chargeRate.rate;
    $scope.newLabourEntry.dailyRate =
      $scope.newLabourEntry.hoursPerDay*$scope.newLabourEntry.hourlyRate;
    $scope.qot.updateLabourCost($scope.newLabourEntry);
  }

  //not working.
  $scope.down = function() {
    $scope.$log.info("down: " + $scope.rowIndex);
    if($scope.rowIndex !== undefined) {
      $scope.utils.down($scope.work.labours, $scope.rowIndex);
    }
  }

  $scope.remove = function() {
    $scope.$log.info("remove: " + $scope.rowIndex);
    if($scope.rowIndex !== undefined) {
      $scope.utils.remove($scope.work.labours, $scope.rowIndex);
      $scope.qot.initRowNumbers($scope.work.labours);
      $scope.qot.updateLabourTotal($scope, $scope.editing, $scope.work);
    }
  }

  $scope.updateLabourCost = function() {
    $scope.$log.info("updateLabourCost: ");
    $scope.qot.updateLabourCost($scope.newLabourEntry);
  }

  $scope.addNew = function() {
    $scope.$log.info("addNew : ");
    var idx = $scope.work.labours.length;
    $scope.utils.add($scope.work.labours,
      $scope.newLabourEntry);
    $scope.qot.updateLabourTotal($scope, $scope.editing, $scope.work, idx);
    $scope.newLabourEntry =
      $scope.qot.newLabour($scope.work.labours.length,
        $scope.userProfile.business, $scope.newLabourEntry.labourType);
    $('#newItem').focus();
  }

  $scope.add = function() {
    $scope.$log.info("add : ");
    $scope.utils.add($scope.work.labours,
      $scope.qot.newLabour($scope.work.labours.length));
  }

  $scope.cellChanged = function(row, col) {
    var idx = row.rowIndex;
    $scope.$log.info("cellChanged in labour: " + col.field +
    ' re: ' + row.entity[col.field]);

    switch(col.field) {
      case 'labour':
        if($scope.rowIndex !== undefined) {
          $scope.work.labours[$scope.rowIndex].labour =
            $scope.capitalize($scope.work.labours[$scope.rowIndex].labour);
        }
        break;
      case 'labourType':
        if($scope.rowIndex !== undefined) {
          var labour = $scope.work.labours[$scope.rowIndex];
          $log.info('selected type: ' + labour.labourType);
          var chargeRate =
            $scope.findChargeRateByLabour(labour.labourType);

          labour.hourlyRate = chargeRate.rate;
          $scope.qot.updateLabourCost(labour);
        }

        break;
      default:
        $scope.qot.updateLabourTotal($scope, $scope.editing, $scope.work, idx);
    }

  }
}
EditLabourCtrl.$inject = ['$scope', 'QuoteService'];


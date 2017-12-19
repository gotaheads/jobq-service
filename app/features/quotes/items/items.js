function EditItemsCtrl($scope, QuoteService, Items) {
  QuoteService.findOrCreateForItems($scope);
  Items.load().then(function (items) {
      $scope.$log.info('EditItemsCtrl items: ', items.length)
  } )
  $scope.typeChanged = function() {
    $scope.$log.info("typeChanged: " + $scope.newEntry.itemType);
    var itemType = $scope.findItemType($scope.newEntry.itemType);
    $scope.newEntry.margin = itemType.margin;
  }

  //not working.
  $scope.down = function() {
    $scope.$log.info("down Item: " + $scope.rowIndex);
    if($scope.rowIndex !== undefined) {
      $scope.utils.down($scope.work.items, $scope.rowIndex);
    }
  }

  $scope.remove = function() {
    $scope.$log.info("remove Item: " + $scope.rowIndex);
    if($scope.rowIndex !== undefined) {
      $scope.utils.remove($scope.work.items, $scope.rowIndex);
      $scope.qot.initRowNumbers($scope.work.items);
      $scope.qot.updateItemTotal($scope, $scope.editing, $scope.work);
    }
  }

  $scope.updateItemCost = function() {
    $scope.$log.info("updateItemCost: ");
    $scope.qot.updateItemCost($scope.newEntry);
  }

  $scope.addNew = function() {
    $scope.$log.info("addNew Item: ");
    var idx = $scope.work.items.length;
    $scope.utils.add($scope.work.items,
      $scope.newEntry);
    $scope.qot.updateItemTotal($scope, $scope.editing, $scope.work, idx);
    $scope.newEntry =
      $scope.qot.newItem($scope.work.items.length, $scope.userProfile.business,
        $scope.newEntry.itemType, $scope.newEntry.margin);
    $('#newItem').focus();
  }

  $scope.add = function() {
    $scope.$log.info("add Item: ");
    $scope.utils.add($scope.work.items,
      $scope.qot.newItem($scope.work.items.length));
  }

  $scope.cellChanged = function(row, col) {
    var idx = row.rowIndex;
    $scope.$log.info("cellChanged: " + col.field +
    ' re: ' + row.entity[col.field] +
    ' ?: ' + angular.toJson($scope.work.items[idx]));

    switch(col.field) {
      case 'item':
        if($scope.rowIndex !== undefined) {
          $scope.work.items[$scope.rowIndex].item =
            $scope.capitalize($scope.work.items[$scope.rowIndex].item);
        }

        break;
      default:
        $scope.qot.updateItemTotal($scope, $scope.editing, $scope.work, idx);
    }

  }
}
EditItemsCtrl.$inject = ['$scope', 'QuoteService', 'Items'];


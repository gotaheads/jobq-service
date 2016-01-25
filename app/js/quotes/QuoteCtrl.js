



function EditQuoteCtrl($scope, QuoteService) {
    QuoteService.findOrCreateForItems($scope);
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
EditQuoteCtrl.$inject = ['$scope', 'QuoteService'];



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



function PrintPlantCtrl($scope, QuoteService, $routeParams) {

    QuoteService.find($routeParams.quoteId).then(function(result) {
        $scope.$log.info("loading from repository... " + result.data._id);
        $scope.quote = result.data;
        $scope.plants = [];
        $scope.created = new Date();
        var plantTotal = {retail:0};
        
        $scope.quote.works.forEach(function(i) {
            i.plants.forEach(function(j) {
                $scope.plants.push(j);
            });
            if(i.plantTotal) {
                plantTotal.retail += i.plantTotal.retail;
            }

        });

        $scope.plantTotal = plantTotal;
    });

}

PrintPlantCtrl.$inject = ['$scope', 'QuoteService', '$routeParams'];


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

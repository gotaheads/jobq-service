'use strict';

var servicesModuleQuote =
angular.module('jobq.quote.core', ['ngResource']);
/**
 *
 */
servicesModuleQuote.factory('Quote',
    ['$log','$rootScope',
    function ($log, $rootScope) {
        var Quote = {};

        var _newItemId = -1;
        function newId() {
            var id = _newItemId;
            _newItemId = _newItemId-1;
            return id;
        }

        Quote.newItem = function(currentItems, business, currentType, currentMargin) {
            var toUse = business.itemTypes[0];
            
            if(currentType != undefined) {
                toUse = $rootScope.findItemType(currentType);
            }

            return {
                "id":newId(),
                "itemType":toUse.type,
                "item":"",
                "wholesale":'',
                "retail":'',
                "margin": (currentMargin!=undefined?currentMargin:toUse.margin),
                "quantity":'',
                "marginTotal":'',
                "wholesaleTotal":'',
                "retailTotal":'',
                "rowNumber": currentItems + 1
            };
        }

        Quote.newPlant = function(currentItems, business, currentMargin) {
            var toUse = business.itemTypes[0];
            
            return {
                "id":newId(),
                "potSize":"",
                "item":"",
                "wholesale":'',
                "retail":'',
                "margin": (currentMargin!=undefined?currentMargin:toUse.margin),
                "quantity":'',
                "marginTotal":'',
                "wholesaleTotal":'',
                "retailTotal":'',
                "rowNumber": currentItems + 1
            };
        }

        Quote.newLabour = function(currentItems, business, currentType) {
            var toUse = business.chargeRates[0];
            
            if(currentType != undefined) {
                toUse = $rootScope.findChargeRateByLabour(currentType);
            }

            var perDay = 8,
                perWk = $rootScope.userProfile.business.awardRate;
            if(perWk != undefined) {
                perDay = perWk/5;
            }

            var hoursPerDay = 8,
                chargeRate = toUse,
                hourlyRate = chargeRate.rate;

            
            return {
                "id":newId(),
                "labourType":chargeRate.labour,
                "labour":"",
                "inDays":'',
                "inHours":0,
                "hoursPerDay":hoursPerDay,
                "hourlyRate":hourlyRate,
                "dailyRate":hoursPerDay*hourlyRate,
                "totalPrice":'',
                "rowNumber": currentItems + 1
            };
        }

        Quote.newWork = function() {
            return {
                "id":newId(),
                "title":"",
                "totalPrice":0,
                "finalPrice":0,
                "totalDiff":0,
                "discount":0,
                "items":[],
                "itemTotal":{
                    "cost":0,
                    "retail":0,
                    "margin":0
                },
                "plantTotal":{
                    "cost":0,
                    "retail":0,
                    "margin":0
                },
                "labours":[],
                "labourTotal":0,
                "plants":[],
                "outlines":[]
            };
        }



        Quote.createGrid = function($scope, gridId, items, columnDefs) {
            function changed(rowItem, event) {
                $scope.$log.info("changed: " + rowItem.rowIndex + ' ' + event);
                $scope.rowIndex = rowItem.rowIndex;
            }
            $scope[gridId] = {
                data: items,
                enableCellSelection: true,
                enableColumnResize:true,
                showFooter:true,
                showColumnMenu:true,
                showGroupPanel:true,
                enableSorting:false,
                afterSelectionChange:changed,
                columnDefs: columnDefs
            };
        }

        function columnDefEditable(field, width,displayName,cellTemplate,editableCellTemplate) {
            var def = columnDef(field, width,displayName, cellTemplate);
            def.enableFocusedCellEdit = true;
            def.enableCellEdit = true;
            def.editableCellTemplate = (editableCellTemplate)?editableCellTemplate:'partials/editableCellTemplate.html';
            return def;
        }

//        function columnDefPlant(field, width,displayName) {
//            var def = columnDef(field, width, displayName, 'partials/cellPlant.html');
//            def.enableFocusedCellEdit = true;
//            def.enableCellEdit = true;
//            def.editableCellTemplate = 'partials/editablePlantTemplate.html';
//            return def;
//        }

        function columnDefCurrency(field, width,displayName) {
            var def = columnDef(field, width,displayName,
                'partials/cellCurrency.html');
            def.cellFilter = 'currency';
            return def;
        }

        function columnDefEditableCurrency(field, width,displayName) {
            var def = columnDefEditable(field, width,displayName,
                'partials/cellCurrency.html');
            return def;
        }
        function columnDefEditablePercent(field, width,displayName) {
            var def = columnDefEditable(field, width,displayName,
                'partials/cellPercent.html');
            return def;
        }
        function columnDefEditableCM(field, width,displayName) {
            var def = columnDefEditable(field, width,displayName,
                'partials/cellCM.html');
            return def;
        }

        function columnDef(field, width,displayName,cellTemplate) {
            var def = {
                field: field,
                width: width,
                displayName: displayName
            };
            def.cellTemplate = (cellTemplate)?cellTemplate:'partials/cellTemplate.html';
            return def;
        }
        var totalWidth = 100;
        
        Quote.createItemGrid = function($scope) {
            Quote.createGrid($scope, 'itemGridOptions', 'work.items',
                [columnDef('rowNumber',30,'#'),
                columnDefEditable('item',320,'Item'),
                columnDefEditable('itemType',140,'Type',
                    'partials/cellTemplate.html',
                    'partials/editableItemTypeCellTemplate.html'),
                columnDefEditable('quantity',60,'Qty.'),
                columnDefEditableCurrency('wholesale',70,'W/S unit'),
                columnDefEditablePercent('margin', 70, 'Margin%'),
                //columnDefCurrency('retail',60,'Retail unit cost'),
                columnDefCurrency('wholesaleTotal',totalWidth,'W/S total'),
                columnDefCurrency('retailTotal',totalWidth,'Retail total')]);
        }

        Quote.createLabourGrid = function($scope) {
            Quote.createGrid($scope, 'labourGridOptions', 'work.labours',
                [columnDef('rowNumber',30,'#'),
                columnDefEditable('labour',200,'Labour'),
                columnDefEditable('labourType',180,'Type',
                    'partials/cellTemplate.html',
                    'partials/editableLabourTypeCellTemplate.html'),
                columnDefEditable('inDays',60,'Days'),
                columnDefEditableCurrency('hourlyRate',80,'Hourly Rate'),
                columnDefCurrency('dailyRate',totalWidth,'Daily Rate'),
                //columnDef('inHours', 80, 'Hours'),
                //columnDef('hoursPerDay',80,'Hours per day'),
                columnDefCurrency('totalPrice',totalWidth,'Labour total')]);
        }

        Quote.createPlantsGrid = function($scope) {
            Quote.createGrid($scope, 'plantGridOptions', 'work.plants',
                [columnDef('rowNumber',30,'#'),
                columnDefEditable('item',140,'Common'),
                columnDefEditable('botanicalName',140,'Botanical'),
                columnDefEditableCM('potSize',70,'Pot Size'),
                columnDefEditable('quantity',60,'Qty.'),
                columnDefEditableCurrency('wholesale',70,'W/S unit'),
                columnDefEditablePercent('margin', 70, 'Margin%'),
                //columnDefCurrency('retail',60,'Retail unit cost'),
                columnDefCurrency('wholesaleTotal',totalWidth,'W/S total'),
                columnDefCurrency('retailTotal',totalWidth,'Retail total')]);
        }

        Quote.loadWork = function($scope, toLoad) {
            var workIdx = $scope.workIdx;
            $log.info('loadWork loading ' + toLoad + ' workId:' + workIdx);
            if($scope.editing.works !==undefined) {
                var idx = 0;
                
                if(workIdx) {
                    idx = workIdx;
                }
                
                $scope.work = $scope.editing.works[idx];
                
                switch(toLoad) {
                    case 'plants':
                        $scope.qot.initItemNumbers($scope.work, 'plants');
                        $scope.newEntry =
                            Quote.newPlant($scope.work.plants.length, $scope.userProfile.business);
                    case 'items':
                        $scope.qot.initItemNumbers($scope.work, 'items');
                        $scope.newEntry = 
                            Quote.newItem($scope.work.items.length, $scope.userProfile.business);
                        break;
                    case 'labours':
                        $scope.qot.initItemNumbers($scope.work, 'labours');
                        $scope.newLabourEntry =
                            Quote.newLabour($scope.work.labours.length, $scope.userProfile.business);
                        $log.info('loadWork loaded new labour ' + angular.toJson($scope.newLabouorEntry));
                        break;
                }
            }
        }

        Quote.initItemNumbers = function(work, items) {
            
            if(work[items] == undefined) {
                work[items] = [];
            }
            var idx = 1;
            angular.forEach(work[items], function(i) {
                i.rowNumber = idx++;
            });
        }

        Quote.initRowNumbers = function(items) {
            if(items == undefined) {
                items = [];
            }
            var idx = 1;
            angular.forEach(items, function(i) {
                i.rowNumber = idx++;
            });
        }
        
        Quote.updateItemCost = function(item) {
            var margin = parseFloat(item.margin);
            var unitMargin = parseFloat(item.wholesale*margin);
            var ws = parseFloat(item.wholesale);
            var qty = parseFloat(item.quantity);
            var retail = ws + unitMargin;

            item.wholesaleTotal = (ws*qty);
            item.retail = retail;
            item.marginTotal = item.wholesaleTotal*margin;
            item.retailTotal = retail*qty;

            $log.info("updateItemCost: " +
                ' m:' + unitMargin +
                ' ws:' + ws +
                ' r:' + retail +
                ' ' + angular.toJson(item));
        }
        
        Quote.updateItemTotal = function($scope, quote, work, idx) {
            if(idx !== undefined) {
                var item = work.items[idx];
                item = Quote.updateItemCost(item);
            }
            updateWorkTotal($scope, quote, work);
        }

        Quote.updateLabourTotal = function($scope, quote, work, idx) {
            
            if(idx !== undefined) {
                var labour = work.labours[idx];
                labour = Quote.updateLabourCost(labour);
            }

            updateWorkTotal($scope, quote, work);
        }

        Quote.updateLabourCost = function(labour) {
            var inDays = parseFloat(labour.inDays);
            var hoursPerDay = parseFloat(labour.hoursPerDay);
            var hourlyRate = parseFloat(labour.hourlyRate);
            labour.inHours = inDays * hoursPerDay;
            labour.dailyRate = hourlyRate * hoursPerDay;
            labour.totalPrice = (labour.dailyRate*inDays);

            $log.info("updateLabourCost: " +
                ' ' + angular.toJson(labour));
        }
        
        Quote.updatePlantTotal = function($scope, quote, work, idx) {
            if(idx !== undefined) {
                var item = work.plants[idx];
                item = Quote.updateItemCost(item);
            }

            updateWorkTotal($scope, quote, work);
        }

        Quote.updateWorksTotal = function($scope, quote) {
            var total = {
                "finalPrice":0,
                "totalPrice":0,
                "totalDiff":0
            };
            
            $log.info("updateWorksTotal plant total: " +
                ' ' + angular.toJson(total));

            angular.forEach(quote.works, function(work) {
                $log.info("updateWorksTotal work total: " +
                    ' ' + work.finalPrice +
                    ' ' + work.totalPrice);
                
                total.finalPrice += work.finalPrice;
                total.totalPrice += work.totalPrice;
            });
            
            total.totalDiff = total.finalPrice/total.totalPrice;

            $log.info("updateWorksTotal work total: " +
                ' ' + angular.toJson(total));

            quote.finalPrice = total.finalPrice;
            quote.totalPrice = total.totalPrice;
            quote.totalDiff = total.totalDiff;

            Quote.updateSummary($scope);

            $log.info("updateWorksTotal: " +
                ' ' + angular.toJson(total));
        }

        var newTotal = function() {
            return {
                "retail":0,
                "margin":0,
                "cost":0
            };
        }
        
        function updateWorkTotal($scope, quote, work) {
            var total = newTotal();
            
            var labourTotal = 0;

            angular.forEach(work.items, function(item) {
                total.cost += item.wholesaleTotal;
                total.retail += item.retailTotal;
                total.margin += item.marginTotal;
            });
            work.itemTotal = total;
            
            $log.info("updateWorkTotal item: " +
                ' ' + angular.toJson(total));
            
            angular.forEach(work.labours, function(labour) {
                labourTotal += labour.totalPrice;
            });
            work.labourTotal = labourTotal;

            $log.info("updateWorkTotal labourTotal: " +
                ' ' + angular.toJson(labourTotal));

            var totalPrice = total.retail + work.labourTotal;
            var finalPrice = totalPrice;

            var plantTotal = newTotal();

            angular.forEach(work.plants, function(plant) {
                plantTotal.retail += parseFloat(plant.retailTotal);
                plantTotal.cost += parseFloat(plant.wholesaleTotal);
                plantTotal.margin += parseFloat(plant.marginTotal);
            });

            work.plantTotal = plantTotal;

            totalPrice += plantTotal.cost;
            finalPrice += plantTotal.retail;

            if(work.discount) {
                finalPrice = totalPrice - (totalPrice * this.editing.discount);
            }
            
            work.totalPrice = totalPrice;
            work.finalPrice = finalPrice;
            
            $log.info("updateWorkTotal finished: " +
                ' work.totalPrice:' + work.totalPrice +
                ' work.finalPrice:' + work.finalPrice);

            Quote.updateWorksTotal($scope, quote);
        }


        Quote.updateSummary = function($scope) {
            $scope.summary = {};
            $scope.summary.address = $scope.editing.address;
            $scope.summary.client = $scope.editing.client;
            $scope.summary.budget = $scope.editing.budget;
            $scope.summary.totalPrice = $scope.editing.totalPrice;
            $scope.summary.finalPrice = $scope.editing.finalPrice;
            if($scope.editing.works != undefined) {
                $scope.summary.numWorks = $scope.editing.works.length;
            }
        }

        return Quote;
    }]);

servicesModuleQuote.factory('Coolections',
    ['$log',
    function ($log) {
        var Coolections = {};

        Coolections.findById = function(items, id) {
            $log.info("Coolections id " + id);
            for(var i = 0; i < items.length; i++) {
                if(id == items[i].id) {
                    return items[i];
                }
            }
            return undefined;
        }

        Coolections.down = function(items, idx, replaceItem) {
            $log.info("down " + idx + ' of ' + items.length);
            if(idx >= items.length - 1) {
                return;
            }
            
            if(replaceItem !== undefined) {
                var toReplaceItem = items[idx][replaceItem];
                var toBeReplacedItem = items[idx+1][replaceItem];
                $log.info("replace item " + toReplaceItem + ' with ' + toBeReplacedItem);
                items[idx+1][replaceItem] = toReplaceItem;
                items[idx][replaceItem] = toBeReplacedItem;
            }
            
            var toReplace = items[idx];
            var toBeReplaced = items[idx+1];

            items[idx] = toBeReplaced;
            items[idx+1] = toReplace;
        }

        Coolections.up = function(items, idx) {
            $log.info("up " + idx);
            //var idx = id.$index;
            if(idx === 0) {
                return;
            }
            var toReplace = items[idx];
            var toBeReplaced = items[idx-1];
            items[idx] = toBeReplaced;
            items[idx-1] = toReplace;
        }

        Coolections.remove = function(items, idx) {
            $log.info("removing to " + idx + '  of items ' +items.length);
            items.splice(idx, 1);
        }
        
        Coolections.add = function(items, toAdd, idx) {
            idx = (idx!==undefined?idx + 1:items.length);
            $log.info("adding to " + idx + '  of items ' +items.length);
            items.splice(idx, 0, toAdd);
            return idx;
        }
        
        return Coolections;
    }]);

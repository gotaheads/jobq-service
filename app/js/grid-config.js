'use strict';

var servicesModuleQuote =
angular.module('jobq.quote.services', ['ngResource']);
/**
 *
 */
servicesModuleQuote.factory('QuoteService',
    ['$rootScope', '$routeParams', '$http', '$log',
    function ($rootScope, $routeParams, $http, $log) {
        var QuoteService = {};

        QuoteService.find = function(quoteId) {
            $log.info('find quoteId is ' + quoteId);
            return $http.get('/restlet/job/quote/' + quoteId);
        }

        QuoteService.findOrCreate = function($scope) {
            $scope.quoteId = $routeParams.quoteId;
            $scope.$log.info("QuoteService.findOrCreate: " + $scope.quoteId);

            $scope.itemTypes = ['Material', 'Equipment'];

            QuoteService.find($scope.quoteId).then(function(result) {
                $scope.$log.info("found " + result.data._id);
                $scope.editing = result.data;

                if($scope.editing.works !==undefined) {
                    $scope.work = $scope.editing.works[0];
                }

                $scope.updateQuoteActions($scope);

            });

            function changed(rowItem, event) {
                $scope.$log.info("changed: " + rowItem + ' ' + event);
            }
             $scope.gridOptions = {
                data: 'work.items',
                enableCellSelection: true,

                enableColumnResize:true,
                showFooter:true,
                showColumnMenu:true,
                showGroupPanel:true,
                afterSelectionChange:changed,
                columnDefs: [{field: 'item', displayName: 'Item',
                              enableFocusedCellEdit: true, enableCellEdit: true,
                              minWidth: 300},
                             {field:'itemType', displayName:'Type', width: 100,
                              enableFocusedCellEdit: false,
                              cellTemplate: 'partials/cellTemplate.html'},
                             {field:'quantity', displayName:'Qty.', width: 60,
                              enableFocusedCellEdit: true, enableCellEdit: true,},
                             {field: 'wholesale', displayName: 'W/S unit cost',
                              enableFocusedCellEdit: true, enableCellEdit: true,
                              width:70,
                              aggLabelFilter: 'currency', cellFilter:'currency'},
                             {field: 'margin', displayName: 'Margin%',
                              enableFocusedCellEdit: true, enableCellEdit: true,
                              width:50,
                              cellFilter:'number:2'},
                             {field: 'retail', displayName: 'Retail unit cost',
                              enableFocusedCellEdit: false, width:50,
                              cellFilter:'currency'},
                             {field: 'wholesaleTotal', displayName: 'W/S total',
                              enableFocusedCellEdit: false, width:70,
                              cellFilter:'currency'},
                             {field: 'marginTotal', displayName: 'Margin total ($)',
                              enableFocusedCellEdit: false, width:70,
                              cellFilter:'currency'},
                             {field: 'retailTotal', displayName: 'Retail total',
                              enableFocusedCellEdit: false, width:80,
                              cellFilter:'currency'},
                            ]
            };
        }

        return QuoteService;
    }]);


'use strict';

var servicesModuleQuote =
angular.module('jobq.quote.services', ['ngResource']);

servicesModuleQuote.factory('QuoteService',
    ['$rootScope', '$routeParams', '$http', '$log',
    function ($rootScope, $routeParams, $http, $log) {
        var QuoteService = {};

        QuoteService.find = function(quoteId) {
            $log.info('find quoteId is ' + quoteId);
            return $http.get('/restlet/job/quote/' + quoteId);
        }

        QuoteService.findOrCreate = function($scope) {
            $scope.quoteId = $routeParams.quoteId;
            $scope.$log.info("QuoteService.findOrCreate: " + $scope.quoteId);

            $scope.itemTypes = ['Material', 'Equipment'];

            QuoteService.find($scope.quoteId).then(function(result) {
                $scope.$log.info("found " + result.data._id);
                $scope.editing = result.data;
                if($scope.editing.works !==undefined) {
                    $scope.work = $scope.editing.works[0];
                }

                $scope.updateQuoteActions($scope);

            });

//            $scope.myData = [{item: "Plyflooring Exterior flooring 19x1200x2400", age: 50, type:'Material'}];
//            $scope.gridOptions = {
//              data: 'myData',
//              enableCellSelection: true,
//              canSelectRows: false,
//              displaySelectionCheckbox: false,
//              columnDefs: [{field: 'name', displayName: 'Name',
//                      enableFocusedCellEdit: true}, {field:'age', displayName:'Age'}]
//            };
//http://angular-ui.github.io/ng-grid/

         $scope.gridOptions = {
            data: 'work.items',
            enableCellSelection: true,
            enableCellEdit: true,
            enableColumnResize:true,
            columnDefs: [{field: 'item', displayName: 'Item', enableFocusedCellEdit: true, minWidth: 300},
                         {field:'itemType', displayName:'Type', enableFocusedCellEdit: false,
                          cellTemplate: 'partials/cellTemplate.html'},
                         {field:'quantity', displayName:'Qty.', maxWidth: 50,
                          cellTemplate:'<input style="width:100%;height:100%;" align="right"  class="ui-widget input right" type="text" ng-readonly="!row.selected" ng-model="row.entity[col.field]"/>'},
                         {field: 'wholesale', displayName: 'W/S unit cost', enableFocusedCellEdit: true, minWidth: 300,
                          aggLabelFilter: 'currency'},
]
        };
        }
        //    QuoteService.saveJob = function(param) {
        //        var json = JSON.stringify(param);
        //        $log.info('saveJob json is ' + json);
        //        return $http.put('/restlet/jobs/'+ param.id, json);
        //    }

        return QuoteService;
    }]);

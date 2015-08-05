'use strict';

var servicesModuleQuote =
    angular.module('jobq.quote.services', ['ngResource']);
/**
 *
 */
servicesModuleQuote.factory('QuoteService',
    ['$rootScope', '$routeParams', '$http', '$log', 'Quote',
        function ($rootScope, $routeParams, $http, $log,
                  Quote) {

            var QuoteService = {};
            $rootScope.quote = {};
            $rootScope.loadForEdit = true;
            $rootScope.editingChanged = false;
            //$rootScope.editing = {};

            var margins = [{"value":0, "label":'Margin 0%'},
                {"value":0.1, "label":'Margin 10%'},
                {"value":0.15, "label":'Margin 15%'},
                {"value":0.2, "label":'Margin 20%'},
                {"value":0.25, "label":'Margin 25%'},
                {"value":0.3, "label":'Margin 30%'},
                {"value":0.3, "label":'Margin 35%'},
                {"value":0.4, "label":'Margin kaede40%'}];

            QuoteService.find = function(quoteId) {
                $log.info('find quoteId is ' + quoteId);
                var url = createUrl('/jobs/' + quoteId);
                return $http.get(url);
            }

            QuoteService.findOrCreate = function($scope) {
                QuoteService.load($scope);
            }

            QuoteService.findOrCreateForWorks = function($scope) {
                QuoteService.load($scope);
            }

            QuoteService.hasContents = function(contract) {
                if(!contract.sections) {
                    return false;
                }
                if(contract.sections.length == 1 &&
                    !contract.sections[0].content) {
                    return false;
                }
                return true;

//            return (!contract.sections ||
//                   (contract.sections.length == 1 && !contract.sections[0]));
            }

            function loadContractTemplate(quote) {
                var c = quote.contract;
                var tempalte = $rootScope.userProfile.template;
                var changed = false;

                if(!c.dear) {
                    c.dear = quote.client;
                    changed = true;
                }

                if(!c.paymentIntro) {
                    c.paymentIntro = tempalte.paymentIntro;
                    changed = true;
                }

                if(!c.payments) {
                    c.payments = tempalte.payments;
                    changed = true;
                }

                if(!c.intro) {
                    c.intro = tempalte.intro;
                    changed = true;
                }

                if(!QuoteService.hasContents(c)) {
                    c.sections = tempalte.sections;
                    changed = true;
                }
                return changed;
            }

            QuoteService.updateStatus = function(quote, job) {
                quote.status = job.status;
                quote.updated = job.updated;
                quote.version = job.version;

                return quote;
            }

            QuoteService.updateQuoteStatus = function(job) {
                $log.info('updateQuoteStatus: ' + job.status);
                QuoteService.updateStatus($rootScope.quote, job);
                QuoteService.updateStatus($rootScope.editing, job);
                $rootScope.loadForEdit = true;
            }

            QuoteService.loadForEdit = function($scope, toLoad, job) {
                $log.info('loadForEdit start: ' + toLoad);
                $rootScope.job = job;
                var quote = job.quotes[0];

                $rootScope.editing = quote;
                $rootScope.quote = $rootScope.editing;
                $rootScope.quoteId = $rootScope.editing.id;

                if($scope.workIdx == undefined) {
                    $scope.workIdx = 0;
                }

                if(!$rootScope.editing.status) {
                    $rootScope.editing.status = 'Preparing';
                    $rootScope.quoteFinalised = false;
                }

                if($rootScope.editing.status == 'Submitted') {
                    $rootScope.quoteFinalised = true;
                }

                Quote.updateSummary($rootScope);

                switch(toLoad) {
                    case 'contract':
                        loadContractTemplate(quote);
                        break;
                    default:
                        $scope.qot.loadWork($scope, toLoad);
                }


                $scope.updateQuoteActions($scope);

                if(!$rootScope.editingChanged) {
                    $rootScope.editingChanged = false;
                }

                $rootScope.loadForEdit = true;

            }

            $rootScope.$watch('editing', function() {
                editingChanged($rootScope);
            }, true);

            function editingChanged($rootScope) {
                $log.info('editingChanged loadForEdit?: ' + $rootScope.loadForEdit
                + ' editingChanged?: ' + $rootScope.editingChanged);

                if($rootScope.loadForEdit) {
                    $log.info('editingChanged resetting loadForEdit, editingChanged dont change. ');
                    $rootScope.loadForEdit = false;
                    $rootScope.editingChanged = false;
                    return;
                }

                $log.info('editingChanged editingChanged is on.');
                $rootScope.editingChanged = true;

            }


            QuoteService.loadCachedIfCurrent = function($scope, toLoad) {
                $scope.quoteId = $routeParams.quoteId;
                $scope.workIdx = $routeParams.workIdx;

                if($rootScope.currentQuoteId == $scope.quoteId) {
                    $scope.$log.info("loading from cache: " + $rootScope.editing.id +
                    ' widx:' +$scope.workIdx +
                    ' changed?: ' + $rootScope.editingChanged);

//                if($rootScope.editingChanged) {
//                    saveCurrent($rootScope.editing);
//                }

                    QuoteService.loadForEdit($scope, toLoad, $rootScope.editing);


                    return true;
                }

                return false;
            }

            var saveCurrent = function (editing, afterSave) {
                $log.info("saveCurrent:" + editing.id);
                var worksheet = {};
                worksheet.quote = editing;

                QuoteService.save(worksheet).then(function(result) {
                    var quote = result.data.quote;

                    $log.info("QuoteService save finished updating:" + quote.id + ' u: ' + quote.updated);

                    $rootScope.loadForEdit = true;
                    $rootScope.currentQuoteId = quote.id;
                    $rootScope.quoteId = quote.id;
                    $rootScope.quote.id = quote.id;
                    $rootScope.quote.version = quote.version;
                    $rootScope.quote.updated = quote.updated;
                    $rootScope.quote.status = quote.status;

                    $rootScope.updateQuoteActions($rootScope);

                    if(afterSave !== undefined) {
                        afterSave(result.data.quote);
                    }

                });
            }

            QuoteService.saveCurrent = function(open) {
                saveCurrent($rootScope.editing, open);
            }

            QuoteService.openPrint = function(quote) {
                window.open(
                    '#/print-contract/' + quote.id,
                    '_blank'
                );
//            window.open(
//              'contract.html#/contract/' + quote.id,
//              '_blank'
//            );
            }


            QuoteService.load = function($scope, toLoad) {
                $scope.$log.info("QuoteService.load : quoteId: " + $scope.quoteId +
                ' cur:' + $rootScope.currentQuoteId);

                $scope.printQuote = function() {
                    $log.info("QuoteService print save first if changed: " + $rootScope.editing.id);

                    if($rootScope.editingChanged) {
                        $log.info("editingChanged: " + $rootScope.editingChanged);
                        saveCurrent($rootScope.editing, QuoteService.openPrint);
                        return;
                    }

                    QuoteService.openPrint($rootScope.editing);
                }


                $scope.submit = function() {
                    $rootScope.editing.status = 'Submitted';
                    saveCurrent($rootScope.editing);
                };

                $scope.save = function() {
                    saveCurrent($rootScope.editing);
                };

                //load from cache and save if changed.
                if(QuoteService.loadCachedIfCurrent($scope, toLoad)) {
                    return;
                }

                $rootScope.currentQuoteId = $scope.quoteId;

                QuoteService.find($scope.quoteId).then(function(result) {
                    var job = result.data,
                        quote = job.quotes[0];
                    $scope.$log.info("loading from repository... " + job._id);
                    QuoteService.loadForEdit($scope, toLoad, job);
                });

            }

            QuoteService.findOrCreateForItems = function($scope) {
                $scope.itemTypes = [];

                $scope.$watch('userProfile.business.itemTypes', function() {
                    $scope.userProfile.business.itemTypes.forEach(function(i) {
                        if(i != undefined) {
                            $scope.itemTypes.push(i.type)
                        }
                    });
                });


                $scope.margins = margins;


                $scope.qot.createItemGrid($scope);

                QuoteService.load($scope, 'items');

                $scope.loadWork = function(idx) {
                    $scope.$log.info("load Work " + idx);
                    $scope.workIdx = idx;
                    $scope.work = $scope.editing.works[idx];

                    $scope.qot.initItemNumbers($scope.work, 'items');

                    $scope.newEntry = Quote.newItem($scope.work.items.length,
                        $scope.userProfile.business);
                    QuoteService.focusItem();
                }
            }

            QuoteService.focusItem = function() {
                window.setTimeout(function() {
                    $('#newItem').focus();
                },100);
            }

            QuoteService.findOrCreateForLabours = function($scope) {

                $scope.$watch('userProfile.business.chargeRates', function() {
                    $scope.labourTypes = [];
                    angular.forEach($scope.userProfile.business.chargeRates,function(i) {
                        $scope.labourTypes.push(i.labour)
                    });
                });

                $scope.qot.createLabourGrid($scope);

                QuoteService.load($scope, 'labours');

                $scope.loadWork = function(idx) {
                    $scope.$log.info("load Work " + idx);
                    $scope.workIdx = idx;
                    $scope.work = $scope.editing.works[idx];

                    $scope.qot.initItemNumbers($scope.work,'labours');
                    $scope.newLabourEntry =
                        Quote.newLabour($scope.work.labours.length,
                            $scope.userProfile.business);
                    QuoteService.focusItem();
                }

            }

            QuoteService.findOrCreateForPlants = function($scope) {
                $scope.margins = margins;
                $scope.qot.createPlantsGrid($scope);
                QuoteService.load($scope, 'plants');

                $scope.loadWork = function(idx) {
                    $scope.$log.info("load Work " + idx);
                    $scope.workIdx = idx;
                    $scope.work = $scope.editing.works[idx];

                    $scope.qot.initItemNumbers($scope.work, 'plants');
                    $scope.newPlantEntry = Quote.newPlant($scope.work.plants.length,
                        $scope.userProfile.business);
                    QuoteService.focusItem();

                }

            }

            QuoteService.findOrCreateForView = function($scope) {
                QuoteService.load($scope);
            }

            QuoteService.save = function(worksheet) {
                var json = JSON.stringify(worksheet);
                $log.info('save json is ' + json);
                return $http.put('/restlet/job/worksheet/'+ worksheet.quote.id, json);
            }

            return QuoteService;
        }]);


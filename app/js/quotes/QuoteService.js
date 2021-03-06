'use strict';

var servicesModuleQuote =
  angular.module('jobq.quote.services', ['ngResource']);
angular.module('jobq.quote.services').factory('QuoteService',
  function ($rootScope, $routeParams, $http, $log,
            Quote, $location, Quotes, Apis) {

    var QuoteService = {};
    $rootScope.quote = {};
    $rootScope.loadForEdit = true;
    $rootScope.editingChanged = false;

    var margins = [{"value": 0, "label": 'Margin 0%'},
      {"value": 0.1, "label": 'Margin 10%'},
      {"value": 0.15, "label": 'Margin 15%'},
      {"value": 0.2, "label": 'Margin 20%'},
      {"value": 0.25, "label": 'Margin 25%'},
      {"value": 0.3, "label": 'Margin 30%'},
      {"value": 0.35, "label": 'Margin 35%'},
      {"value": 0.4, "label": 'Margin 40%'}];

    QuoteService.find = function (quoteId) {
      $log.info('find quoteId is ' + quoteId);
      var url = Apis.createApiUrl('/quotes/' + quoteId);
      return $http.get(url);
    }

    QuoteService.findOrCreate = function ($scope) {
      QuoteService.load($scope);
    }

    QuoteService.findOrCreateForWorks = function ($scope) {
      QuoteService.load($scope);
    }

    QuoteService.hasContents = function (contract) {
      if (!contract.sections) {
        return false;
      }
      if (contract.sections.length == 1 && !contract.sections[0].content) {
        return false;
      }
      if(contract.sections.length == 0) {
        return false;
      }
      return true;
    }

    function loadContractTemplate(quote) {
      var c = quote.contract;
      var tempalte = $rootScope.userProfile.template;
      var changed = false;

      if (!c.dear) {
        c.dear = quote.client;
        changed = true;
      }

      if (!c.paymentIntro) {
        c.paymentIntro = tempalte.paymentIntro;
        changed = true;
      }

      if (!c.payments || c.payments.length === 0) {
        c.payments = tempalte.payments;
        changed = true;
      }

      if (!c.intro) {
        c.intro = tempalte.intro;
        changed = true;
      }

      if (!QuoteService.hasContents(c)) {
        c.sections = tempalte.sections;
        changed = true;
      }
      return changed;
    }

    QuoteService.updateStatus = function (quote, job) {
      quote.status = job.status;
      quote.updated = job.updated;
      quote.version = job.version;

      return quote;
    }

    QuoteService.updateQuoteStatus = function (job) {
      $log.info('QuoteService.updateQuoteStatus: ' + job.status);
      QuoteService.updateStatus($rootScope.quote, job);
      $rootScope.loadForEdit = true;
    }

    QuoteService.loadForEdit = function ($scope, toLoad, quote) {
      $log.info('QuoteService.loadForEdit start: ' + toLoad);

      $rootScope.editing = quote;
      $rootScope.quote = $rootScope.editing;
      var quoteId = $rootScope.quoteId = $rootScope.editing._id;
      var jobId = $rootScope.editing._jobId;

      if ($scope.workIdx == undefined) {
        $scope.workIdx = 0;
      }

      if (!$rootScope.editing.status) {
        $rootScope.editing.status = 'Preparing';
        $rootScope.quoteFinalised = false;
      }

      if ($rootScope.editing.status == 'Submitted') {
        $rootScope.quoteFinalised = true;
      }

      Quote.updateSummary($rootScope);

      switch (toLoad) {
        case 'contract':
          loadContractTemplate(quote);
          break;
        default:
          $scope.qot.loadWork($scope, toLoad);
      }


      $scope.updateQuoteActions($scope, jobId, quoteId);

      if (!$rootScope.editingChanged) {
        $rootScope.editingChanged = false;
      }

      $rootScope.loadForEdit = true;

    }

    $rootScope.$watch('editing', function () {
      editingChanged($rootScope);
    }, true);

    function editingChanged($rootScope) {
      $log.info('editingChanged loadForEdit?: ' + $rootScope.loadForEdit
      + ' editingChanged?: ' + $rootScope.editingChanged);

      if ($rootScope.loadForEdit) {
        $log.info('editingChanged resetting loadForEdit, editingChanged dont change. ');
        $rootScope.loadForEdit = false;
        $rootScope.editingChanged = false;
        return;
      }

      $log.info('editingChanged editingChanged is on.');
      $rootScope.editingChanged = true;

    }


    QuoteService.loadCachedIfCurrent = function ($scope, toLoad) {
      $scope.quoteId = $routeParams.quoteId;
      $scope.workIdx = $routeParams.workIdx;

      if ($rootScope.currentQuoteId == $scope.quoteId) {
        $scope.$log.info("loading from cache: " + $rootScope.editing._id +
        ' widx:' + $scope.workIdx +
        ' changed?: ' + $rootScope.editingChanged);

        QuoteService.loadForEdit($scope, toLoad, $rootScope.editing);

        return true;
      }

      return false;
    }

    var saveCurrent = function (editing, afterSave) {
      $log.info("saveCurrent:" + editing._id);
      var quote = {};
      quote = editing,
        quote.updated = new Date(),
        quote.version++;

      quote = angular.copy(quote),
        quote.works.forEach(function (i) {
          delete i.$$hashKey;
        })

      Quotes.save(quote).then(function (result) {
        $log.info("QuoteService save finished updating:" + quote._id + ' u: ' + quote.updated);

        $rootScope.loadForEdit = true;
        $rootScope.editingChanged = false;
        var quoteId = $rootScope.currentQuoteId = quote._id;
        var jobId = quote._jobId;

        $rootScope.updateQuoteActions($rootScope, jobId, quoteId);

        if (afterSave !== undefined) {
          afterSave(quote);
        }

      });
    }

    QuoteService.saveCurrent = function (open) {
      saveCurrent($rootScope.editing, open);
    }

    QuoteService.openPrint = function (quote) {
      $location.path('print-contract/' + quote._id);
    }

    QuoteService.load = function ($scope, toLoad) {
      $scope.$log.info("QuoteService.load : quoteId: " + $scope.quoteId +
      ' cur:' + $rootScope.currentQuoteId);

      $scope.printQuote = function () {
        $log.info("QuoteService print save first if changed: " + $rootScope.editing._id);

        if ($rootScope.editingChanged) {
          $log.info("editingChanged: " + $rootScope.editingChanged);
          saveCurrent($rootScope.editing, QuoteService.openPrint);
          return;
        }

        QuoteService.openPrint($rootScope.editing);
      }


      $scope.submit = function () {
        $rootScope.editing.status = 'Submitted';
        saveCurrent($rootScope.editing);
      };

      $scope.save = function () {
        saveCurrent($rootScope.editing);
      };

      //load from cache and save if changed.
      if (QuoteService.loadCachedIfCurrent($scope, toLoad)) {
        return;
      }

      $rootScope.currentQuoteId = $scope.quoteId;

      QuoteService.find($scope.quoteId).then(function (result) {
        var quote = result.data;
        $scope.$log.info("loading from repository... " + quote._id);
        QuoteService.loadForEdit($scope, toLoad, quote);
      });

    }

    QuoteService.findOrCreateForItems = function ($scope) {
      $scope.itemTypes = [];

      $scope.$watch('userProfile.business.itemTypes', function () {
        $scope.userProfile.business.itemTypes.forEach(function (i) {
          if (i != undefined) {
            $scope.itemTypes.push(i.type)
          }
        });
      });


      $scope.margins = margins;

      $scope.qot.createItemGrid($scope);

      QuoteService.load($scope, 'items');

      $scope.loadWork = function (idx) {
        $scope.$log.info("load Work items " + idx);
        $location.path('/edit-quote/'+$scope.editing._id+'/'+idx);
      }
    }

    QuoteService.focusItem = function () {
      window.setTimeout(function () {
        $('#newItem').focus();
      }, 100);
    }

    QuoteService.findOrCreateForLabours = function ($scope) {

      $scope.$watch('userProfile.business.chargeRates', function () {
        $scope.labourTypes = [];
        angular.forEach($scope.userProfile.business.chargeRates, function (i) {
          $scope.labourTypes.push(i.labour)
        });
      });

      $scope.qot.createLabourGrid($scope);

      QuoteService.load($scope, 'labours');

      $scope.loadWork = function (idx) {
        $scope.$log.info("load Work labours " + idx);
        $location.path('/edit-labours/'+$scope.editing._id+'/'+idx);
      }

    }

    QuoteService.findOrCreateForPlants = function ($scope) {
      $scope.margins = margins;
      $scope.qot.createPlantsGrid($scope);
      QuoteService.load($scope, 'plants');

      $scope.loadWork = function (idx) {
        $scope.$log.info("load Work plants " + idx);
        $location.path('/edit-plants/'+$scope.editing._id+'/'+idx);
      }

    }

    QuoteService.findOrCreateForView = function ($scope) {
      QuoteService.load($scope);
    }

    QuoteService.save = function (quote) {
      var json = JSON.stringify(quote);
      $log.info('save json is ' + json);
      return $http.put(Apis.createApiUrl('/quotes/' + quote._id), json);
    }

    return QuoteService;
  });


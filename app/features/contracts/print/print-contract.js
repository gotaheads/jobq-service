
function ViewContractCtrl($scope, ContractService, $routeParams,QuoteService) {
  var $log = $scope.$log;

  $scope.title = 'View contract';
  $scope.quoteId = $routeParams.quoteId;
  $scope.$log.info("ViewContractCtrl " + $scope.quoteId);
  $scope.editing = {};
  $scope.predicate = '-rowNumber';

  ContractService.find($scope.quoteId).then(function(result) {
    $scope.$log.info("found " + result.data.id);
    var quote = result.data;
    $scope.contract = quote.contract;
    $scope.quote = quote;
    $scope.quote.business = $scope.userProfile.business;
    $scope.editing = quote;
    $scope.printQuote = function() {
      $log.info("ViewContractCtrl printQuote : " + $scope.quote._id);
      QuoteService.openPrint($scope.quote);
    }

    $scope.updateQuoteActions($scope);

  });
}

ViewContractCtrl.$inject = ['$scope', 'ContractService', '$routeParams','QuoteService'];

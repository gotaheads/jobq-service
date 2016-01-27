function ViewQuoteCtrl($scope, QuoteService) {
  QuoteService.findOrCreateForView($scope);

  $scope.fromNow =function(date) {
    return moment(date).fromNow();
  }

}
ViewQuoteCtrl.$inject = ['$scope', 'QuoteService'];


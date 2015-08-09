function ViewQuoteCtrl($scope, QuoteService) {
    QuoteService.findOrCreateForView($scope);
}
ViewQuoteCtrl.$inject = ['$scope', 'QuoteService'];


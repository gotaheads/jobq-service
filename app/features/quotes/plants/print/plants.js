

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



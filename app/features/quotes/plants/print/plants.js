

function PrintPlantCtrl($scope, QuoteService, $routeParams) {

  QuoteService.find($routeParams.quoteId).then(function(result) {
    $scope.$log.info("loading from repository... " + result.data._id);
    $scope.quote = result.data;
    $scope.plants = [];
    $scope.created = new Date();
    var plantTotal = {retail:0};
    var works = [];
    $scope.quote.works.forEach(function(i) {
      if(i.plants.length > 0) {
        works.push(i);
      }

      i.plants.forEach(function(j) {
        $scope.plants.push(j);
      });
      if(i.plantTotal) {
        plantTotal.retail += i.plantTotal.retail;
      }

    });
    $scope.works = works;
    $scope.plantTotal = plantTotal;
  });

}

PrintPlantCtrl.$inject = ['$scope', 'QuoteService', '$routeParams'];







function MenuCtrl($scope, $rootScope) {
    var $log = $scope.$log;
    $log.info('MenuCtrl');

    $rootScope.$watch('recentJobs', function(evt, cur, prev) {
        $log.info('recentJobs changed..');
        
        $scope.recentJobs2 = $scope.recentJobs;
        
    });

}
MenuCtrl.$inject = ['$scope', '$rootScope'];


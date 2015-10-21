



function MenuCtrl($scope, $rootScope, $location) {
    var $log = $scope.$log;
    $log.info('MenuCtrl');

    function showMenu(path) {
        switch(path) {
            case '/login':
            case '/print':
                return false;
        }
        return true;
    }

    showMenu($location.path());

    $rootScope.$watch('recentJobs', function(evt, cur, prev) {
        $log.info('recentJobs changed..');
        
        $scope.recentJobs2 = $scope.recentJobs;
        
    });
    $rootScope.$on('$routeChangeStart', function(evt, cur, prev) {
        var path = $location.path();
        $scope.showMenu = showMenu(path);
        $log.info('MenuCtrl $routeChangeStart...', path, $scope.showMenu);
    });


}
MenuCtrl.$inject = ['$scope', '$rootScope', '$location'];


'use strict';

function LoginCtrl($scope, $location, Auths) {
    Auths.logout();

    $scope.user = {};

    $scope.login = function(user) {
        var yes = Auths.authenticate(user);
        if(yes) {
            $location.path('/dashboard');
        }
    }
    //var url = createUrl('/jobs');
    //$location.get(url).success(function(jobs) {
    //});


}
LoginCtrl.$inject = ['$scope','$location', 'Auths'];

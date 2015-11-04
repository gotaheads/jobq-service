'use strict';

function LoginCtrl($scope, $location, Auths) {
    Auths.logout();

    $scope.user = {};

    $scope.login = function(user) {
        Auths.authenticate(user).then(function() {
            $location.path('/dashboard');
        }, function() {
            alert('Invalid login, please try again.');
        });

    }


}
LoginCtrl.$inject = ['$scope','$location', 'Auths'];

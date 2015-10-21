'use strict';

var servicesModuleAuths =
    angular.module('jobq.auth', []);

servicesModuleAuths.factory('Auths',
    ['$rootScope', '$routeParams', '$http', '$log','$location',
        function ($rootScope, $routeParams, $http, $log, $location) {

            var Auths = {}, authenticated = false;

            Auths.authenticate = function(user) {
                authenticated = false;
                if(user.username === 'admin' || user.password === 'dfl') {
                    authenticated =true;
                }
                return authenticated;
            }

            Auths.isAuthenticated = function() {
                return authenticated;
            }

            Auths.logout = function() {
                authenticated = false;
            }


            Auths.forwardToLogin = function(path) {
                if(path.indexOf('login') === -1 && !Auths.isAuthenticated()) {
                    $location.path('/login');
                    return;
                }
            }

            return Auths;
        }]);


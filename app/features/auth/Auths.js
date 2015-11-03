'use strict';

var servicesModuleAuths =
angular.module('jobq.auth', []).factory('Auths',
  function ($rootScope, $routeParams, $http, $log, $location, Sessions, Validations) {

            var Auths = {}, isDefined = Validations.isDefined,
                sessionKey = 'auth';

            Auths.authenticate = function(user) {
                Sessions.save(sessionKey, {});

                if(user.username === 'admin' && user.password === 'dflgertrude') {
                    user.loggedIn = new Date();
                    Sessions.save(sessionKey, user);
                    return true

                }

                return false;
            }

            Auths.isAuthenticated = function() {
                var user = Sessions.find(sessionKey);
                return (isDefined(user) && isDefined(user.loggedIn));
            }

            Auths.logout = function() {
                Sessions.save(sessionKey, {});
            }


            Auths.forwardToLogin = function(path) {
                if(path.indexOf('login') === -1 && !Auths.isAuthenticated()) {
                    $location.path('/login');
                    return;
                }
            }

            return Auths;
        });


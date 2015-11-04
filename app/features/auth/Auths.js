'use strict';

var servicesModuleAuths =
angular.module('jobq.auth', []).factory('Auths',
  function ($rootScope, $routeParams, $http, $log, $location, $q,
            Sessions, Validations, UserProfiles) {

            var Auths = {}, isDefined = Validations.isDefined
                ;

            Auths.authenticate = function(user) {
                UserProfiles.clear();

                return $http.post('/auth', user).then(function(res) {
                    var userProfile = res.data;
                    $log.info('userProfile: ', userProfile);
                    UserProfiles.save(userProfile);

                    return true;
                })
            }

            Auths.isAuthenticated = function() {
                var userProfile = UserProfiles.userProfile();
                return (isDefined(userProfile) && isDefined(userProfile.loggedIn));
            }

            Auths.logout = function() {
                UserProfiles.clear();
            }


            Auths.forwardToLogin = function(path) {
                if(path.indexOf('login') === -1 && !Auths.isAuthenticated()) {
                    $location.path('/login');
                    return;
                }
            }

            return Auths;
        });


'use strict';

/**
 * data class
 * @module data/session
 */
angular.module('jobq')
    .factory('UserProfiles',
    function ($log, Validations, Sessions) {
        var isDefined = Validations.isDefined,
            UserProfiles = {}, sessionKey = 'userProfile';

        var userProfile = function() {
            return Sessions.find(sessionKey);
        }

        UserProfiles.userProfile = function() {
            return userProfile();
        }

        UserProfiles.clear = function() {
            Sessions.clear();
        }

        UserProfiles.save = function(userProfile) {
            userProfile.recentJobs = [];
            Sessions.save(sessionKey, userProfile);
        }

        UserProfiles.addRecentJobs = function(jobId, client) {
            if(!client) {
                return;
            }

            if(isClientExisted(userProfile().recentJobs, client)) {
                return false;
            }

            if(userProfile().recentJobs.length > 3) {
                userProfile().recentJobs.splice(0, 1);
            }

            $log.info('adding recentJobs: ' + client);

            userProfile().recentJobs.push( {path:'/edit-job/'+jobId, name:client});
            return true;
        }

        function isClientExisted(jobs, client) {
            var existed = false;
            jobs.forEach(function(job) {
                if(job.name == client)  {
                    existed = true;
                }
            });
            return existed;
        }



        return UserProfiles;



    });

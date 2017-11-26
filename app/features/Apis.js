angular.module('jobq').factory('Apis',
  function ($http, $log, UserProfiles) {

    var Apis = {}
      ;
    function createApi2Url(path) {
      return '/api2' + path;
    }

    Apis.createApi2Url = createApi2Url;

    Apis.createApiUrl = function (path) {
        var apiPath = UserProfiles.userProfile().path;
        $log.info('Apis.createApiUrl apiPath: ', apiPath);
        return '/api/' + apiPath + path;
    }

      return Apis;
  });

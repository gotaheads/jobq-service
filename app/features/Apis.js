angular.module('jobq').factory('Apis',
  function ($http, $log) {

    var Apis = {}
      ;
    function createApi2Url(path) {
      return '/api2' + path;
    }

    Apis.createApi2Url = createApi2Url;

    return Apis;
  });

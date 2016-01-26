angular.module('jobq').factory('Apis',
  function ($http, $log) {

    var Apis = {}
      ;
    function createUrl(path) {
      return '/api2' + path;
    }

    Apis.createUrl = createUrl;

    return Apis;
  });

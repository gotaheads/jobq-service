
angular.module('jobq').factory('Plants',
  function ($rootScope, $http, $log, $q) {
    var Plants = {};

    Plants.sort = function(plants) {
        if(!plants) return [];

        return plants.sort(function(a,b) {
            if(a.botanicalName < b.botanicalName) return -1;
            if(a.botanicalName > b.botanicalName) return 1;
            return 0;
        })

    }
    return Plants;
});

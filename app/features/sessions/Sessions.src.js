'use strict';

/**
 * data class
 * @module data/session
 */
angular.module('jobq')
  .factory('Sessions',
  function ($log, $filter,
            Validations) {
      var isDefined = Validations.isDefined;

    function _clear() {
      sessionStorage.clear();
      return this;
    }

    function _save(key, data) {
      $log.info('saving data for key: ' + key, data);


      if(!isDefined(data)) {
        $log.error('Unable to save data... it is invalid');
        return this;
      }
      sessionStorage.setItem(key, angular.toJson(data));

      return this;
    }

    function _find(key) {
      var json = sessionStorage.getItem(key);

      if(json === null) {
        return undefined;
      }

      return angular.fromJson(json);
    }

    return {
      clear: _clear,
      save: _save,
      find: _find
    }

  });

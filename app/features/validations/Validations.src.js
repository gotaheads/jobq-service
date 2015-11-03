'use strict';
/**
 * validations class
 * @module validations
 */
angular.module('jobq')
  .factory('Validations',
  function ($log) {

    var validations = {};

    /**
     * Checks if the value is a positive number or zero
     * @method isPositiveNumberOrZero
     * @param {!number} value
     * @returns {!boolean}
     */
    validations.isPositiveNumberOrZero = function(value) {
      return (typeof value !== 'string') &&
        !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) >= 0;
    };

    /**
     * Checks if the value is a positive number
     * @method isPositiveNumber
     * @param {!number} value
     * @returns {!boolean}
     */
    validations.isPositiveNumber = function(value) {
      return validations.isPositiveNumberOrZero(value) && parseFloat(value) > 0;
    };

    /**
     * Checks if the value is alphabetic
     * @method isAlphabet
     * @param {!number} value
     * @returns {!boolean}
     */
    validations.isAlphabet =  function(value){
      var regex = /^[A-Za-z]+$/ig;
      return regex.test(value);
    };

    /**
     * Checks if the value is alphanumeric
     * @method isAlphanumeric
     * @param {!number} value
     * @returns {!boolean}
     */
    validations.isAlphanumeric =  function(value){
      var regex = /^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9 _]*$/ig;
      return regex.test(value);
    };

    /**
     * Whether value is empty, numbers and boolean are always valid, returns false for undefined and null
     * @method isEmpty
     * @param {!object} data
     * @returns {!boolean}
     */

    var isEmpty = function (data) {
      if (typeof(data) == 'number' || typeof(data) == 'boolean') {
        return false;
      }
      if (typeof(data) == 'undefined' || data === null) {
        return true;
      }
      if (typeof(data.length) != 'undefined') {
        return data.length == 0;
      }
      return false;
    };

    validations.isEmpty = isEmpty;

    /**
     * Determines if a reference is defined
     * @method isDefined
     * @param {!object} data
     * @returns {!boolean}
     */
    validations.isDefined =  angular.isDefined;

    /**
     * Determines if a reference is an Array.
     * @method isArray
     * @param {!object} value
     * @returns {!boolean}
     */
    validations.isArray =  angular.isArray;

    /**
     * Determines if a reference is an Object. Unlike typeof in JavaScript, nulls are not considered to be objects. Note that JavaScript arrays are objects.
     * @method isObject
     * @param {!object} data
     * @returns {!boolean}
     */
    validations.isObject =  angular.isObject;

    /**
     * Determines if a reference is a String.
     * @method isString
     * @param {!object} value
     * @returns {!boolean}
     */
    validations.isString =  angular.isString;

    /**
     * Determines if two objects or two values are equivalent. Supports value types, regular expressions, arrays and objects
     * @method equals
     * @param {!object} o1
     * @param {!object} o2
     * @returns {!boolean}
     */
    validations.equals = angular.equals;

    return validations;

  }
);

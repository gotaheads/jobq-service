'use strict';

describe('Service: Validations', function () {

  // load the service's module
  beforeEach(module('svAtlas'));

  // instantiate service
  var Validations;
  beforeEach(inject(function (_Validations_) {
    Validations = _Validations_;
  }));

  describe('Testing isAlphabet function with different inputs', function() {

    it('isNumber should return false for "P"', inject(function () {
      expect(Validations.isAlphabet('P')).toBeTruthy();
    }));

    it('isNumber should return false for "P"', inject(function () {
      expect(Validations.isAlphabet('SamplePage')).toBeTruthy();
    }));

    it('isNumber should return false for "P"', inject(function () {
      expect(Validations.isAlphabet('samplePage')).toBeTruthy();
    }));

    it('isNumber should return false for "2"', inject(function () {
      expect(Validations.isAlphabet('2')).toBeFalsy();
    }));

    it('isNumber should return false for "a "', inject(function () {
      expect(Validations.isAlphabet('a ')).toBeFalsy();
    }));

    it('isNumber should return false for "a%"', inject(function () {
      expect(Validations.isAlphabet('a%')).toBeFalsy();
    }));

    it('isNumber should return false for "a%a"', inject(function () {
      expect(Validations.isAlphabet('a%a')).toBeFalsy();
    }));

    it('isNumber should return false for "a a"', inject(function () {
      expect(Validations.isAlphabet('a a')).toBeFalsy();
    }));

    it('isNumber should return false for "#"', inject(function () {
      expect(Validations.isAlphabet('#')).toBeFalsy();
    }));

  });

  describe('Testing isPositiveNumber function with different inputs', function() {

    it('isNumber should return false for "P"', inject(function () {
      expect(Validations.isPositiveNumber('P')).toBeFalsy();
    }));

    it('isNumber should return true for "-2"', inject(function () {
      expect(Validations.isPositiveNumber(-2)).toBeFalsy();
    }));

    it('isNumber should return true for "-2"', inject(function () {
      expect(Validations.isPositiveNumber(-2.2322323)).toBeFalsy();
    }));

    it('isNumber should return true for "2"', inject(function () {
      expect(Validations.isPositiveNumber(2)).toBeTruthy();
    }));

    it('isNumber should return true for "2.1"', inject(function () {
      expect(Validations.isPositiveNumber(2.1)).toBeTruthy();
    }));

    it('isNumber should return true for "2"', inject(function () {
      expect(Validations.isPositiveNumber('2')).toBeFalsy();
    }));

    it('isNumber should return true for true', inject(function () {
      expect(Validations.isPositiveNumber(true)).toBeFalsy();
    }));

    it('isNumber should return true for false', inject(function () {
      expect(Validations.isPositiveNumber(false)).toBeFalsy();
    }));

    it('isNumber should return true for {}', inject(function () {
      expect(Validations.isPositiveNumber({})).toBeFalsy();
    }));
  });

  describe('isEmpty', function() {
    it('isEmpty should return true for an empty string', function () {
      expect(Validations.isEmpty('')).toBe(true);
    });

    it('isEmpty should return true for undefined', function () {
      expect(Validations.isEmpty(undefined)).toBe(true);
    });

    it('isEmpty should return true for null', function () {
      expect(Validations.isEmpty(null)).toBe(true);
    });

    it('isEmpty should return false for a space', function () {
      expect(Validations.isEmpty(' ')).toBe(false);
    });

    it('isEmpty should return false for a space', function () {
      expect(Validations.isEmpty(' ')).toBe(false);
    });

    it('isEmpty should return true for empty array', function () {
      expect(Validations.isEmpty([])).toBe(true);
    });    
  })
});

'use strict';

/* Filters */

var myFilter =  angular.module('jobq.filters', []).
filter('interpolate', ['version', function(version) {
    return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    }
}]);


myFilter.filter('nodecimal', function() {
    return function(text, length, end) {
        return text.substring(0, text.length-3);
    //return String(text).substring(0, length - 2);
    }
});

myFilter.filter('capitalize',
    function() {
        return function(input) {
            if(angular.isString(input) && input.length){
                return input.charAt(0).toUpperCase() + input.slice(1);
            }
            return input;
        };
    }
    );


myFilter.filter('percentf',
    function() {
        return function(input) {
            if(input) {
                var v = parseFloat(input);
                return (v*100) + '%';
            }
            return input;
        };
    }
    );
myFilter.filter('cmetre',
    function() {
        return function(input) {
            if(input) {
                return input + 'cm';
            }
            return input;
        };
    }
    );


myFilter.filter('dollar',
    function() {
        return function(input, curSymbol, decPlaces, thouSep, decSep) {
            var curSymbol = curSymbol || "$";
            var decPlaces = decPlaces || 2;
            var thouSep = thouSep || ",";
            var decSep = decSep || ".";

            // Check for invalid inputs
            var out = isNaN(input) || input === '' || input === null ? 0.0 : input;

            //Deal with the minus (negative numbers)
            var minus = input < 0;
            out = Math.abs(out);
            out = angular.filter.number(out, decPlaces);

            // Replace the thousand and decimal separators.
            // This is a two step process to avoid overlaps between the two
            if(thouSep != ",") out = out.replace(/\,/g, "T");
            if(decSep != ".") out = out.replace(/\./g, "D");
            out = out.replace(/T/g, thouSep);
            out = out.replace(/D/g, decSep);

            // Add the minus and the symbol
            if(minus){
                return "-" + curSymbol + out;
            }else{
                return curSymbol + out;
            }
        }
    });
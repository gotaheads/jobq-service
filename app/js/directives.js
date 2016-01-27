'use strict';

/* Directives */


var myDirective = angular.module('jobq.directives', []).
directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}]);

myDirective.directive('selectOnClick', function () {
    // Linker function
    return function (scope, element, attrs) {
        element.click(function () {
            element.select();
        });
    };
});

myDirective.directive('initFocus', function() {
    var timer;

    return function(scope, elm, attr) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
            elm.focus();
            console.log('focus', elm);
        }, 0);
    };
});

myDirective.directive('onEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.onEnter);
                });

                //event.preventDefault();
            }
        });
    };

});

myDirective.directive('capitalizeFirst', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(!inputValue) {
               return inputValue;
           }
           var capitalized = inputValue.charAt(0).toUpperCase() +
                             inputValue.substring(1);
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
});

myDirective.directive('dndList', function() {

    return function(scope, element, attrs) {

        // variables used for dnd
        var toUpdate;
        var startIndex = -1;

        // watch the model, so we always know what element
        // is at a specific position
        scope.$watch(attrs.dndList, function(value) {
            toUpdate = value;
        },true);

        // use jquery to make the element sortable (dnd). This is called
        // when the element is rendered
        $(element[0]).sortable({
            items:'li',
            start:function (event, ui) {
                // on start we define where the item is dragged from
                startIndex = ($(ui.item).index());
            },
            stop:function (event, ui) {
                // on stop we determine the new index of the
                // item and store it there
                var newIndex = ($(ui.item).index());
                var toMove = toUpdate[startIndex];
                toUpdate.splice(startIndex,1);
                toUpdate.splice(newIndex,0,toMove);

                // we move items in the array, if we want
                // to trigger an update in angular use $apply()
                // since we're outside angulars lifecycle
                scope.$apply(scope.model);
            },
            axis:'y'
        })
    }
});
    myDirective.filter('noFractionCurrency',
      [ '$filter', '$locale',
      function(filter, locale) {
        var currencyFilter = filter('currency');
        var formats = locale.NUMBER_FORMATS;
        return function(amount, currencySymbol) {
          var value = currencyFilter(amount, currencySymbol);
          var sep = value.indexOf(formats.DECIMAL_SEP);
          if(amount >= 0) {
            return value.substring(0, sep);
          }
          return value.substring(0, sep);
        };
      } ]);
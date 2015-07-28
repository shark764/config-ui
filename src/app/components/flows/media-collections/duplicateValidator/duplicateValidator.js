'use strict';

angular.module('liveopsConfigPanel')
  .directive('mediaMapDuplicate', ['MediaCollection', function () {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$validators.mediaMapDuplicate = function(modelValue) {
          var isValid = true;
          var resource = scope.$parent.$parent.resource;
          angular.forEach(resource.mediaMap, function(map) {
            isValid = isValid && (map.lookup !== modelValue);
          });
          return isValid;
        };
      }
    };
  }]);
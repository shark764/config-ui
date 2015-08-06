'use strict';

angular.module('liveopsConfigPanel')
  .directive('formError', function() {
    return {
      templateUrl : 'app/shared/directives/formError/formError.html',
      scope : {
        field : '='
      },
      link : function($scope, $elem, $attrs){
        $scope.errorTypes = {};
        angular.forEach($attrs.$attr, function(value, key){
          if(key.match(/errorType+/)){
            var errorName = key.replace(/errorType/, '');
            var firstChar = errorName.charAt(0);
            errorName = errorName.replace(/^\w/, firstChar.toLowerCase());
            $scope.errorTypes[errorName] = $attrs[key];
          }
        });
        
        $scope.isString = function(value) {
          return angular.isString(value);
        };
      }
    };
   });

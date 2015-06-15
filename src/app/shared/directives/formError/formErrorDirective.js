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
          if(value.match(/error-type-+/)){
            var errorName = value.replace(/error-type-/, '');
            $scope.errorTypes[errorName] = $attrs[key];
          }
        })
      }
    };
   });
'use strict';

angular.module('liveopsConfigPanel')
  .directive('concatStrings', [function() {
    return {
      scope : {
        models: '=',
        field: '@',
        seperator: '@'
      },
      template : '{{identifiers}}',
      link : function($scope) {
        $scope.identifiers = '';
        if (! $scope.seperator){
          $scope.seperator = '';
        }
        
        for(var i = 0; i < $scope.models.length; i++){
          if($scope.identifiers !== ''){
            $scope.identifiers += ($scope.seperator + ' ');
          }

          $scope.identifiers += $scope.models[i][$scope.field];
        }
      }
    };
   }])
;

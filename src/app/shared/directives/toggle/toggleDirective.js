'use strict';

angular.module('liveopsConfigPanel')
  .directive('toggle', ['Modal', function(Modal) {
    return {
      templateUrl : 'app/shared/directives/toggle/toggle.html',
      scope : {
        ngModel : '=',
        ngDisabled : '=',
        trueValue: '@',
        falseValue: '@',
        confirmMessage: '@'
      },
      link: function ($scope) {
        if (angular.isUndefined($scope.trueValue)){
          $scope.trueValue = true;
        }

        if(angular.isUndefined($scope.falseValue)) {
          $scope.falseValue = false;
        }
        
        $scope.onClick = function(value){
          if (value === $scope.falseValue && $scope.confirmMessage){
            $scope.ngModel = $scope.trueValue; //Flip it back for display purposes
            Modal.showConfirm({
              message: $scope.confirmMessage,
              cancelCallback: function(){
                $scope.ngModel = $scope.trueValue;
              },
              okCallback: function(){
                $scope.ngModel = $scope.falseValue;
              }
            });
          }
        };
      }
    };
   }]);
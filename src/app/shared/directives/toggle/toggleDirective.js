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
        confirmEnableMessage: '@',
        confirmDisableMessage: '@'
      },
      link: function ($scope) {
        if (angular.isUndefined($scope.trueValue)){
          $scope.trueValue = true;
        }

        if(angular.isUndefined($scope.falseValue)) {
          $scope.falseValue = false;
        }
        
        $scope.onClick = function(value){
          if (angular.isDefined($scope.confirmEnableMessage) && angular.isDefined($scope.confirmDisableMessage)){
            $scope.ngModel = (value === $scope.trueValue ? $scope.falseValue : $scope.trueValue); //Flip it back for display purposes
            Modal.showConfirm({
              message: (value === $scope.trueValue ? $scope.confirmEnableMessage : $scope.confirmDisableMessage),
              okCallback: function(){
                $scope.ngModel = value;
              }
            });
          }
        };
      }
    };
   }]);
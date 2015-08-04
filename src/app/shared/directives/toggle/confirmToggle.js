'use strict';

angular.module('liveopsConfigPanel')
  .directive('confirmToggle', ['Modal', '$timeout', function(Modal, $timeout) {
    return {
      require: ['ngModel', '^toggle'],
      link: function ($scope, $element, $attrs, controllers) {
        controllers[0].$parsers.push(function (newValue) {
          return $scope.onToggle(newValue);
        });
        
        $scope.onToggle = function(newValue){
          $timeout(function(){ //For display until confirm dialog value is resolved
            $scope.$parent.ngModel = (newValue === $scope.trueValue ? $scope.falseValue : $scope.trueValue);
          });
          
          return Modal.showConfirm({
            message: (newValue === $scope.trueValue ? $scope.confirmEnableMessage : $scope.confirmDisableMessage)
          }).then(function(){
            $scope.$parent.ngModel = newValue;
          });
        };
      }
    };
   }]);
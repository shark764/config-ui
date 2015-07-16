'use strict';

angular.module('liveopsConfigPanel')
.directive('modal', [function () {
  return {
    restrict: 'E',
    templateUrl : 'app/shared/directives/modal/modal.html'
  };
}]);
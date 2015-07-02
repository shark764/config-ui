'use strict';

angular.module('liveopsConfigPanel')
.directive('modal', [function () {
  return {
    restrict: 'E',
    scope: {
      okCallback: '&',
      cancelCallback: '&',
      title: '@',
      message: '@'
    }
  };
}]);
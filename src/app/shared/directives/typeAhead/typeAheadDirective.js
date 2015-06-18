'use strict';

angular.module('liveopsConfigPanel')
  .directive('typeAhead', ['filterFilter', '$compile', function(filterFilter, $compile) {
    return {
      restrict: 'E',
      scope : {
        items: '=',
        selectedItem: '='
      },

      templateUrl: 'app/shared/directives/typeAhead/typeAhead.html',

      link: function ($scope, ele, attrs, ctrl) {
        $scope.currentText = '';
      }
    };
  }]);

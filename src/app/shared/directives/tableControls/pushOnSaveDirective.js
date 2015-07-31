'use strict';

angular.module('liveopsConfigPanel')
  .directive('pushOnSaveEvent', ['$parse',
    function ($parse, Chain) {
      return {
        restrict: 'A',
        require: ['tableControls'],
        link: function ($scope, $elem, $attrs) {
          $scope.$on($attrs.pushOnSaveEvent, function(event, resource) {
            var items = $parse($attrs.items)($scope);
            items.push(resource);
          });
        }
      };
    }
  ]);
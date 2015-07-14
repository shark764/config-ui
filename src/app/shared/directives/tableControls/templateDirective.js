'use strict';

angular.module('liveopsConfigPanel')
  .directive('tableCell', ['$compile',
    function ($compile) {
      return {
        scope: {
          item: '=',
          name: '@'
        },
        link: function ($scope, $element, $attrs, controller, $transclude) {
          var innerScope = $scope.$new();
          $transclude(innerScope, function (clone) {
            $element.empty();
            
            angular.forEach(clone, function(include) {
              if (include.attributes &&
                include.attributes['name'] &&
                include.attributes['name'].value === $scope.name){
                $element.append(include);
              }
            });
            $element.on('$destroy', function () {
              innerScope.$destroy();
            });
          });
        }
      };
    }
  ]);
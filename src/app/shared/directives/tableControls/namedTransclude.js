'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('namedTransclude', [
    function() {
      return {
        link: function($scope, element, attrs, controller, $transclude) {
          var innerScope = $scope.$parent.$parent.$new();
          innerScope.$table = $scope.$parent;
          
          $transclude(innerScope, function(clone) {
            element.empty();

            angular.forEach(clone, function(include) {
              if (include.attributes &&
                include.attributes.name &&
                include.attributes.name.value === attrs.name) {
                element.append(include);
              }
            });

            element.on('$destroy', function() {
              innerScope.$destroy();
            });
          });
        }
      };
    }
  ]);

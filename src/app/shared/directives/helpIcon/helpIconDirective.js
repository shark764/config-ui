'use strict';

angular.module('liveopsConfigPanel')
  .directive('helpIcon', ['$document', '$compile', function($document, $compile) {
    return {
      templateUrl : 'app/shared/directives/helpIcon/helpIcon.html',
      scope : {
        text : '@',
        translateValue: '@'
      },
      link: function($scope, element){
        $scope.target = element;
        var tooltipElement;

        $scope.showTooltip = function(){
          tooltipElement = $compile('<tooltip target="target" text="{{text}}" translate-value="{{translateValue}}"></tooltip>')($scope);
          $document.find('body').append(tooltipElement);
        };

        $scope.destroyTooltip = function(){
          tooltipElement.remove();
        };
      }
    };
   }]);
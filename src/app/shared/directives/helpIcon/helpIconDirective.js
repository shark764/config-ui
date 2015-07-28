'use strict';

angular.module('liveopsConfigPanel')
  .directive('helpIcon', ['$document', '$compile', function($document, $compile) {
    return {
      templateUrl : 'app/shared/directives/helpIcon/helpIcon.html',
      scope : {
        text : '@'
      },
      link: function($scope, element){
        $scope.target = element;
        var tooltipElement;
        
        $scope.showTooltip = function(){
          tooltipElement = $compile('<tooltip target="target" text="{{text}}"></tooltip>')($scope);
          $document.find('body').append(tooltipElement);
        };
        
        $scope.destroyTooltip = function(){
          tooltipElement.remove();
        };
      }
    };
   }]);
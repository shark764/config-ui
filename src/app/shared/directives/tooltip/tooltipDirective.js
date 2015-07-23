'use strict';

angular.module('liveopsConfigPanel')
  .directive('tooltip', ['$document', '$timeout', function($document, $timeout) {
    return {
      templateUrl : 'app/shared/directives/tooltip/tooltip.html',
      scope : {
        text : '@',
        target: '='
      },
      link: function($scope, element){
        $scope.setPosition = function(){
          element.find('div').removeClass('top left right bottom');
          
          var tooltipPos;

          var tooltipWidth = element.outerWidth();
          var tooltipHeight = element.outerHeight();
          var arrowHeight = 15;
          var arrowWidth = 13;
          var arrowBase = 25;
            
          var documentWidth = $document.width();
          var documentHeight = $document.height();
          
          var targetHeight = $scope.target.outerHeight();
          var targetWidth = $scope.target.outerWidth();
          
          var targetPosition = $scope.target.offset();
          var offsetLeft = targetPosition.left;
          var offsetTop = targetPosition.top;
          
        //Calculate the vertical position styling of the tooltip
          var top = targetPosition.top;
          var left = targetPosition.left;
          
          if (top - tooltipHeight < 0) {
            if (left - tooltipWidth < 0){
              tooltipPos = 'bottom right';
              offsetLeft += targetWidth + arrowHeight;
            } else if (left + tooltipWidth > documentWidth) {
              tooltipPos = 'bottom left';
              offsetLeft += - tooltipWidth;
            } else {
              tooltipPos = 'bottom center';
              offsetTop += targetHeight + arrowHeight
              offsetLeft += - ((tooltipWidth - targetWidth) / 2);
            }
          } else if (top + tooltipHeight > documentHeight){
            if (left - tooltipWidth < 0){
              tooltipPos = 'top right';
              offsetLeft += targetWidth + arrowHeight;
              offsetTop += - tooltipHeight + arrowBase;
            } else if (left + tooltipWidth > documentWidth) {
              tooltipPos = 'top left';
              offsetLeft += - tooltipWidth - arrowHeight;
              offsetTop += - tooltipHeight + arrowBase;
            } else {
              tooltipPos = 'top center';
              offsetTop += - (tooltipHeight + arrowHeight);
              offsetLeft += - ((tooltipWidth - targetWidth) / 2);
            }
          } else {
            if (left - tooltipWidth < 0){
              tooltipPos = 'center right';
              offsetLeft += targetWidth + arrowWidth;
              offsetTop += - (tooltipHeight / 2) + (targetHeight / 2);
            } else if (left + tooltipWidth > documentWidth) {
              tooltipPos = 'center left';
              offsetLeft += - tooltipWidth - arrowWidth;
              offsetTop += - (tooltipHeight / 2) + (targetHeight / 2);
            } else {
              tooltipPos = 'top center';
              offsetTop += - (tooltipHeight + arrowHeight);
              offsetLeft += - ((tooltipWidth - targetWidth) / 2);
            }
          }
          
          //set the position styling of the tool tip
          element.find('div').addClass(tooltipPos);
          
          element.css('left', offsetLeft);
          element.css('top', offsetTop);
        };
        
        $timeout($scope.setPosition, 1);
      }
    };
   }]);
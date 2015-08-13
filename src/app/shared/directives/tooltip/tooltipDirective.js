'use strict';

angular.module('liveopsConfigPanel')
  .directive('tooltip', ['$document', '$timeout', function ($document, $timeout) {
    return {
      templateUrl: 'app/shared/directives/tooltip/tooltip.html',
      scope: {
        text: '@',
        target: '=',
        translateValue: '@'
      },
      link: function ($scope, element) {
        $scope.targetPosition = $scope.target.offset();
        $scope.tooltipWidth = 0;
        $scope.tooltipHeight = 0;

        $scope.setPosition = function () {
          element.find('div').removeClass('top left right bottom');
          $scope.tooltipWidth = element.outerWidth();
          $scope.tooltipHeight = element.outerHeight();

          var tooltipPos = $scope.getPositionClass();
          var absolutePosition = $scope.getAbsolutePosition(tooltipPos);

          element.find('div').addClass(tooltipPos);

          element.css('left', absolutePosition.left);
          element.css('top', absolutePosition.top);
        };

        $scope.getPositionClass = function () {
          var tooltipPos;

          var documentWidth = $document.width();
          var documentHeight = $document.height();

          var top = $scope.targetPosition.top;
          var left = $scope.targetPosition.left;

          if (top - $scope.tooltipHeight < 0) {
            if (left - $scope.tooltipWidth < 0) {
              tooltipPos = 'bottom right';
            } else if (left + $scope.tooltipWidth > documentWidth) {
              tooltipPos = 'bottom left';
            } else {
              tooltipPos = 'bottom center';
            }
          } else if (top + $scope.tooltipHeight > documentHeight) {
            if (left - $scope.tooltipWidth < 0) {
              tooltipPos = 'top right';
            } else if (left + $scope.tooltipWidth > documentWidth) {
              tooltipPos = 'top left';
            } else {
              tooltipPos = 'top center';
            }
          } else {
            if (left - $scope.tooltipWidth < 0) {
              tooltipPos = 'center right';
            } else if (left + $scope.tooltipWidth > documentWidth) {
              tooltipPos = 'center left';
            } else {
              tooltipPos = 'top center';
            }
          }

          return tooltipPos;
        };

        $scope.getAbsolutePosition = function (tooltipPos) {
          var arrowHeight = 15;
          var arrowWidth = 13;
          var arrowBase = 25;

          var targetHeight = $scope.target.outerHeight();
          var targetWidth = $scope.target.outerWidth();

          var offsetLeft = $scope.targetPosition.left;
          var offsetTop = $scope.targetPosition.top;

          if (tooltipPos.indexOf('left') > -1) {
            offsetLeft += -$scope.tooltipWidth - arrowWidth;
          }

          if (tooltipPos.indexOf('right') > -1) {
            offsetLeft += targetWidth + arrowWidth;
          }

          if (tooltipPos === 'bottom center') {
            offsetTop += targetHeight + arrowHeight;
            offsetLeft += -(($scope.tooltipWidth - targetWidth) / 2);
          } else if (tooltipPos === 'top center') {
            offsetTop += -($scope.tooltipHeight + arrowHeight);
            offsetLeft += -(($scope.tooltipWidth - targetWidth) / 2);
          } else if (tooltipPos === 'top right' || tooltipPos === 'top left') {
            offsetTop += -$scope.tooltipHeight + arrowBase;
          } else if (tooltipPos === 'center right' || tooltipPos === 'center left') {
            offsetTop += -($scope.tooltipHeight / 2) + (targetHeight / 2);
          }

          return {
            top: offsetTop,
            left: offsetLeft
          };
        };

        $timeout($scope.setPosition, 1);
      }
    };
  }]);
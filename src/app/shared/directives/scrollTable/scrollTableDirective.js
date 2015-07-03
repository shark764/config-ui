'use strict';

angular.module('liveopsConfigPanel')
  .directive('scrollTable', [function() {
    return {
      restrict: 'A',
      replace: 'true',
      compile: function CompilingFunction($templateElement, $templateAttributes) {
        var tableHeader = $templateElement.find('thead')[0].outerHTML;
        $templateElement.removeAttr('scroll-table');
        
        var tableBody = $templateElement[0].outerHTML;
        $templateElement.replaceWith('<div class="scrollable-table-container"><table class="clone-header table">' + tableHeader + 
            '</table><div class="table-wrapper"><div>' + tableBody + '</div></div></div>');

        return function LinkingFunction($scope, $element, $attrs) {};
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel')
  .directive('scrollTable', [function() {
    return {
      restrict: 'A',
      replace: 'true',
      compile: function CompilingFunction($templateElement) {
        $templateElement.removeAttr('scroll-table'); //Prevent infinite recursion

        var headerHeight = $templateElement.find('thead').height();
        if (headerHeight === 0){
          headerHeight = 35;
        }

        var headerCopy = $templateElement.find('thead').clone(true, true);
        headerCopy.find('th').css('height', headerHeight + 'px');

        var cloneHeaderTable = angular.element('<table class="clone-header">' + headerCopy[0].outerHTML + '</table>');
        var origClasses = $templateElement[0].className;
        cloneHeaderTable.addClass(origClasses);

        //Remove duplicated header inputs for cleaner HTML
        //Note: if a cell contains only an input and has no width explicitly set,
        //removing the input will cause misalignment between the table cells and the header cells.
        $templateElement.find('thead').find('input').remove();

        $templateElement.replaceWith('<div class="scrollable-table-container" style="padding-top:' + headerHeight + 'px;">' +
            cloneHeaderTable[0].outerHTML +
            '<div class="table-wrapper"><div>' + $templateElement[0].outerHTML + '</div></div>' +
            '</div>');

        return function($scope, element, attrs){
          if (attrs.maxHeight){
            $scope.$watch(function(){return element.find('tbody').find('tr').length;}, function(count){
              if (count > 0){
                var approxHeight = headerHeight * count;
                if (approxHeight < attrs.maxHeight){
                  element.css('height', approxHeight + headerHeight + 5 + 'px');
                } else {
                  element.css('height', attrs.maxHeight + 'px');
                }
              }
            });
          }
        };
      }
    };
  }]);

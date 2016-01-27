'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loHourExceptionOverlap', ['$moment', '$parse', function($moment, $parse) {
    return {
      restrict : 'A',
      require: ['ngModel', 'ngResource'],
      link: function ($scope, elem, attr, ctrls) {
        var ngModelCtrl = ctrls[0];
        var itemsGetter = $parse(attr.items);
        var exceptionHourGetter = $parse(attr.ngResource);

        ngModelCtrl.compareExceptionHourOverlap = function(existingExceptionHour, currentExceptionHour) {

          if(currentExceptionHour === existingExceptionHour) { 
            return false;
          }

          var newItemStart = $moment.utc(currentExceptionHour.date),
            newItemEnd = $moment.utc(currentExceptionHour.date),
            existingStart = $moment.utc(existingExceptionHour.date),
            existingEnd = $moment.utc(existingExceptionHour.date);


          if (currentExceptionHour.isAllDay) {
            newItemStart.startOf('day');
            newItemEnd.endOf('day');
          } else {
            newItemStart.add(currentExceptionHour.startTimeMinutes, 'minutes');
            newItemEnd.add(currentExceptionHour.endTimeMinutes, 'minutes');
          }

          if (existingExceptionHour.isAllDay) {
            existingStart.startOf('day');
            existingEnd.endOf('day');
          } else {
            existingStart.add(existingExceptionHour.startTimeMinutes, 'minutes');
            existingEnd.add(existingExceptionHour.endTimeMinutes, 'minutes');
          }

          var itemRange = $moment.range(newItemStart, newItemEnd),
            valRange = $moment.range(existingStart, existingEnd);

          return itemRange.overlaps(valRange);
        };

        ngModelCtrl.$validators.overlap = function() {
          var valid = true;
          var items = itemsGetter($scope);
          var currentExceptionHour = exceptionHourGetter($scope);
          for(var itemIndex = 0; itemIndex < items.length; itemIndex++) {
            var existingExceptionHour = items[itemIndex];
            valid = valid && !ngModelCtrl.compareExceptionHourOverlap(existingExceptionHour, currentExceptionHour);
          }
          return valid;
        };
      }
    };
  }]);

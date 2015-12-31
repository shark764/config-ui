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

        var compareExceptionHourOverlap = function(viewDate, targetExceptionHour, currentExceptionHour) {
          if(currentExceptionHour === targetExceptionHour) {
            return false;
          }

          var itemStart = $moment.utc(viewDate),
            itemEnd = $moment.utc(viewDate),
            valStart = $moment.utc(targetExceptionHour.date),
            valEnd = $moment.utc(targetExceptionHour.date);

          if (currentExceptionHour.isAllDay) {
            valStart.startOf('day');
            valEnd.endOf('day');
          } else {
            valStart.add(currentExceptionHour.startTimeMinutes, 'minutes');
            valEnd.add(currentExceptionHour.endTimeMinutes, 'minutes');
          }

          if (targetExceptionHour.isAllDay) {
            itemStart.startOf('day');
            itemEnd.endOf('day');
          } else {
            itemStart.add(targetExceptionHour.startTimeMinutes, 'minutes');
            itemEnd.add(targetExceptionHour.endTimeMinutes, 'minutes');
          }

          var itemRange = $moment.range(itemStart, itemEnd),
            valRange = $moment.range(valStart, valEnd);

          return itemRange.overlaps(valRange);
        };

        ngModelCtrl.$validators.overlap = function(modelValue, viewValue) {
          var valid = true;
          var items = itemsGetter($scope);
          var currentExceptionHour = exceptionHourGetter($scope);
          for(var itemIndex = 0; itemIndex < items.length; itemIndex++) {
            var exceptionHour = items[itemIndex];
            valid = valid && !compareExceptionHourOverlap(viewValue, exceptionHour, currentExceptionHour);
          }

          return valid;
        };
      }
    };
  }]);

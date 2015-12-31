'use strict';

angular.module('liveopsConfigPanel.shared.directives')
  .directive('loHourExceptionOverlap', ['$moment', '$parse', function($moment, $parse) {
    return {
      restrict : 'A',
      require: ['ngModel', 'ngResource'],
      link: function ($scope, elem, attr, ctrls) {
        var ngModelCtrl = ctrls[0];
        var itemsGetter = $parse(attr.items);

        var compareExceptionHourOverlap = function(firstExceptionHour, secondExceptionHour) {
          if(firstExceptionHour === secondExceptionHour) {
            return false;
          }

          var itemStart = $moment.utc(firstExceptionHour.date),
            itemEnd = $moment.utc(firstExceptionHour.date),
            valStart = $moment.utc(secondExceptionHour.date),
            valEnd = $moment.utc(secondExceptionHour.date);

          if (firstExceptionHour.isAllDay) {
            valStart.startOf('day');
            valEnd.endOf('day');
          } else {
            valStart.add(firstExceptionHour.startTimeMinutes, 'minutes');
            valEnd.add(firstExceptionHour.endTimeMinutes, 'minutes');
          }

          if (secondExceptionHour.isAllDay) {
            itemStart.startOf('day');
            itemEnd.endOf('day');
          } else {
            itemStart.add(secondExceptionHour.startTimeMinutes, 'minutes');
            itemEnd.add(secondExceptionHour.endTimeMinutes, 'minutes');
          }

          var itemRange = $moment.range(itemStart, itemEnd),
            valRange = $moment.range(valStart, valEnd);

          return itemRange.overlaps(valRange);
        };

        $scope.$watch(attr.ngModel, function () {
          ngModelCtrl.$validate();
        }, true);

        ngModelCtrl.$validators.loHourExceptionOverlap = function(modelValue, viewValue) {
          var valid = true;
          var items = itemsGetter($scope);
          for(var itemIndex = 0; itemIndex < items.length; itemIndex++) {
            var exceptionHour = items[itemIndex];
            valid = valid && !compareExceptionHourOverlap(viewValue, exceptionHour);
          }

          return valid;
        };
      }
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel')
  .controller('hoursExceptionController', ['$scope', '$moment', '$translate', '$q', 'Session', 'BusinessHourException', 'Alert',
    function ($scope, $moment, $translate, $q, Session, BusinessHourException, Alert) {
      var vm = this;

      vm.addHoursException = function () {
        var newLocalDate = new Date();
        var newUTCDate = $moment.utc([
          newLocalDate.getFullYear(), newLocalDate.getMonth(), newLocalDate.getDate()
        ]);

        newUTCDate.add(1, 'days');

        var newExceptionHour = new BusinessHourException({
          date: newUTCDate,
          isAllDay: true
        });

        if ($scope.hours.$exceptions && angular.isArray($scope.hours.$exceptions)) {
          $scope.hours.$exceptions.push(newExceptionHour);
        } else {
          $scope.hours.$exceptions = [newExceptionHour];
        }

        $scope.form.$setDirty();
      };

      vm.removeException = function (exceptionIndex) {
        var exception = $scope.hours.$exceptions[exceptionIndex];
        $scope.hours.$exceptions.removeItem(exception);

        return exception.$delete({
          businessHourId: $scope.hours.id
        }).then(function () {
          Alert.success($translate.instant('hours.exception.remove.success'));
        }, function () {
          Alert.error($translate.instant('hours.exception.remove.failure'));
          $scope.hours.$exceptions.push(exception);
        });
        // .finally(function () {
        //   $scope.form['date' + exceptionIndex].$validate();
        // });
      };
    }
  ]);
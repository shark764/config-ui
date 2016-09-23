'use strict';

angular.module('liveopsConfigPanel')
  .controller('hoursExceptionController', ['$scope', '$moment', '$translate', '$q', 'Session', 'BusinessHourException', 'Alert', '_',
    function ($scope, $moment, $translate, $q, Session, BusinessHourException, Alert, _) {
      var vm = this;

      var startWatcher;
      var endWatcher;

      vm.addBtnDisabled = false;

      $scope.$on('enableAddExceptionHour', function () {
        vm.addBtnDisabled = false;
        if (angular.isDefined(startWatcher)) {
          startWatcher();
          endWatcher();
        }
      });

      vm.addHoursException = function () {
        vm.addBtnDisabled = true;

        //Init date to tomorrow
        var newLocalDate = new Date();
        var newUTCDate = $moment.utc([
          newLocalDate.getFullYear(), newLocalDate.getMonth(), newLocalDate.getDate()
        ]);

        newUTCDate.add(1, 'days');

        var newExceptionHour = new BusinessHourException({
          date: newUTCDate,
          isAllDay: true,
          startTimeMinutes: -1,
          endTimeMinutes: -1
        });

        var today = new Date(newUTCDate._d);
        vm.provideDateToday = $moment(today).format('YYYY-MM-DD');

        if ($scope.hours.$exceptions && angular.isArray($scope.hours.$exceptions)) {
          $scope.hours.$exceptions.push(newExceptionHour);
        } else {
          $scope.hours.$exceptions = [newExceptionHour];
        }

        $scope.form.$setDirty();

        startWatcher = $scope.$watch(function() {
          if ($scope.hours.$exceptions) {
            return _.last($scope.hours.$exceptions).startTimeMinutes;
          }
          vm.addBtnDisabled = false;
        }, function() {
          vm.reValidateExceptionHours();
        });
        endWatcher = $scope.$watch(function() {
          if ($scope.hours.$exceptions) {
            return _.last($scope.hours.$exceptions).endTimeMinutes;
          }
          vm.addBtnDisabled = false;
        }, function() {
          vm.reValidateExceptionHours();
        });
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
          })
          .finally(vm.reValidateExceptionHours);
      };

      vm.reValidateExceptionHours = function() {
        angular.forEach($scope.hours.$exceptions, function(exception, index) {
          if('date' + index in $scope.form) {
            $scope.form['date' + index].$validate();
            $scope.form['date' + index].$setTouched();
          }
        });
      };

    }
  ]);

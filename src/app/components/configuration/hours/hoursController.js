'use strict';

angular.module('liveopsConfigPanel')
  .controller('HoursController', [
    '$scope', '$translate', '$moment', 'Session', 'BusinessHour', 'BusinessHourException', 'Timezone', 'hoursTableConfig', 'Alert', 'loEvents', '$q',
    function ($scope, $translate, $moment, Session, BusinessHour, BusinessHourException, Timezone, hoursTableConfig, Alert, loEvents, $q) {
      var vm = this;
      vm.dayPrefixes = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

      vm.loadTimezones = function () {
        vm.timezones = Timezone.query();
      };

      vm.loadHours = function () {
        vm.hours = BusinessHour.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        return vm.hours;
      };

      vm.submit = function () {
        return vm.selectedHour.save({
          tenantId: Session.tenant.tenantId
        }).catch(function (error) {
          vm.forms.detailsForm.$setPristine();
          var unbindWatch = $scope.$watch('hc.forms.detailsForm.$dirty', function (dirty) {
            if (!dirty) {
              return;
            }

            for (var errorIndex in vm.forms.detailsForm.$error) {
              var errorFields = vm.forms.detailsForm.$error[errorIndex];

              for (var errorFieldIndex = 0; errorFieldIndex < errorFields.length; errorFields++) {
                var error = errorFields[errorFieldIndex];
                error.$setValidity(errorIndex, true);
              }
            }

            unbindWatch();
          });

          return $q.reject(error);
        });
      };

      vm.reset = function (hour) {
        vm.isHoursCustom = vm.hasHours();
        vm.exceptionHour = null;

        vm.forms
          .detailsForm
          .resetController
          .reset(hour);
      };

      vm.hasHours = function () {
        if (!vm.selectedHour) {
          return false;
        }

        var hasHours = false;
        for (var index = 0; index < vm.dayPrefixes.length; index++) {
          var dayPrefix = vm.dayPrefixes[index];

          hasHours = vm.selectedHour[dayPrefix + 'StartTimeMinutes'] &&
            vm.selectedHour[dayPrefix + 'StartTimeMinutes'] !== -1;

          hasHours = hasHours || (vm.selectedHour[dayPrefix + 'EndTimeMinutes'] &&
            vm.selectedHour[dayPrefix + 'EndTimeMinutes'] !== -1);

          if (hasHours) {
            return true;
          }
        }
        return false;
      };

      vm.showCreateException = function () {
        var newLocalDate = new Date();
        var newUTCDate = $moment.utc([
          newLocalDate.getFullYear(), newLocalDate.getMonth(), newLocalDate.getDate()]);

        newUTCDate.add(1, 'days');

        vm.exceptionHour = new BusinessHourException({
          date: newUTCDate,
          isAllDay: true
        });
      };

      vm.cancelException = function () {
        vm.exceptionHour = null;
      };

      vm.submitException = function () {
        return vm.exceptionHour.save({
          tenantId: Session.tenant.tenantId,
          businessHourId: vm.selectedHour.id
        }).then(function (exceptionHour) {
          vm.selectedHour.$exceptions.push(exceptionHour);
          vm.exceptionHour = null;
          Alert.success($translate.instant('hours.exception.create.success'));
          return exceptionHour;
        }, function (error) {
          Alert.error($translate.instant('hours.exception.create.failure'));
          return $q.reject(error);
        });
      };

      vm.removeException = function (exception) {
        vm.selectedHour.$exceptions.removeItem(exception);

        return exception.$delete({
          businessHourId: vm.selectedHour.id
        }).then(function () {
          Alert.success($translate.instant('hours.exception.remove.success'));
        }, function () {
          Alert.error($translate.instant('hours.exception.remove.failure'));
          vm.selectedHour.$exceptions.push(exception);
        })
        .finally(function () {
          vm.forms.exceptionHour.date.$validate();
        });
      };

      vm.onIsHoursCustomChanged = function (isCustom) {
        if (!isCustom) {
          angular.forEach(vm.dayPrefixes, function (dayPrefix) {
            vm.selectedHour[dayPrefix + 'StartTimeMinutes'] = -1;
            vm.selectedHour[dayPrefix + 'EndTimeMinutes'] = -1;
          });
        }
      };

      vm.generateHoursMessage = function (day) {
        return {
          day: $translate.instant('hours.' + day)
        };
      };

      $scope.$watch('hc.selectedHour', function (newHour, oldHour) {
        if(oldHour) {
          vm.reset(oldHour);
        }

      });


      $scope.dateComparer = function (item) {
        var curVal = this.viewValue,
            itemStart = $moment.utc(item.date),
            itemEnd = $moment.utc(item.date),
            valStart = $moment.utc(curVal),
            valEnd = $moment.utc(curVal);

        if(vm.exceptionHour.isAllDay) {
          valStart.startOf('day');
          valEnd.endOf('day');
        } else {
          valStart.add('minutes', vm.exceptionHour.startTimeMinutes);
          valEnd.add('minutes', vm.exceptionHour.endTimeMinutes);
        }

        if (item.isAllDay) {
          itemStart.startOf('day');
          itemEnd.endOf('day');
        } else {
          itemStart.add('minutes', item.startTimeMinutes);
          itemEnd.add('minutes', item.endTimeMinutes);
        }

        var itemRange = $moment.range(itemStart, itemEnd),
            valRange = $moment.range(valStart, valEnd);

        return itemRange.overlaps(valRange);

      };

      $scope.$on('session:tenant:changed', function () {
        vm.loadHours();
      });

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        vm.selectedHour = new BusinessHour({
          tenantId: Session.tenant.tenantId,
          active: true,
          timezone: 'US/Eastern'
        });

        vm.exceptionHour = null;
      });

      vm.tableConfig = hoursTableConfig;
      vm.isHoursCustom = false;

      vm.loadTimezones();
      vm.loadHours();
    }
  ]);

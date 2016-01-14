'use strict';

angular.module('liveopsConfigPanel')
  .controller('hoursController', [
    '$scope', '$translate', '$moment', '$q', 'Session', 'BusinessHour', 'Timezone', 'hoursTableConfig', 'loEvents',
    function ($scope, $translate, $moment, $q, Session, BusinessHour, Timezone, hoursTableConfig, loEvents) {

      var vm = this;
      vm.dayPrefixes = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

      vm.loadTimezones = function() {
        vm.timezones = Timezone.query();
      };

      vm.loadHours = function() {
        vm.hours = BusinessHour.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        return vm.hours;
      };

      vm.submit = function() {
        return vm.selectedHour.save({
          tenantId: Session.tenant.tenantId
        }).then(function(hours) {
          var promises = [];
          angular.forEach(hours.$exceptions, function(exception, index) {
            if(!exception.isNew()) {
              return;
            }

            promises.push(exception.save({
              tenantId: Session.tenant.tenantId,
              businessHourId: hours.id
            }).catch(function(response) {
              angular.forEach(response.data.error.attribute, function(message, field) {
                vm.forms.detailsForm[field + index].$setValidity('api', false);
                vm.forms.detailsForm[field + index].$error.api = message;
              });

              return $q.reject(response);
            }));
          });

          return $q.all(promises);
        }).catch(vm.saveError);
      };

      vm.saveError = function(error) {
        vm.forms.detailsForm.$setPristine();
        var unbindWatch = $scope.$watch('hc.forms.detailsForm.$dirty', function (dirty) {
          if (!dirty) {
            return;
          }

          vm.forms.detailsForm.loFormResetController.resetErrors();
          unbindWatch();
        });

        return $q.reject(error);
      };

      vm.reset = function(hour) {
        vm.isHoursCustom = vm.hasHours();
        vm.exceptionHour = null;
        hour.$exceptions = angular.copy(hour.$original.$exceptions);

        vm.forms
          .detailsForm
          .resetController
          .reset(hour);
      };

      vm.hasHours = function() {
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

      vm.onIsHoursCustomChanged = function (isCustom) {
        if (!isCustom) {
          angular.forEach(vm.dayPrefixes, function(dayPrefix) {
            vm.selectedHour[dayPrefix + 'StartTimeMinutes'] = -1;
            vm.selectedHour[dayPrefix + 'EndTimeMinutes'] = -1;
          });
        }
      };

      vm.generateHoursMessage = function(day) {
        return {
          day: $translate.instant('hours.' + day)
        };
      };
      
      vm.updateActive = function(newVal){
        var hoursCopy = new BusinessHour({
          id: vm.selectedHour.id,
          tenantId: vm.selectedHour.tenantId,
          active: ! vm.selectedHour.active
        });
        
        return hoursCopy.save(function(result){
          vm.selectedHour.$original.active = result.active;
        });
      };

      $scope.$watch('hc.selectedHour', function(newHour, oldHour) {
        if (oldHour) {
          vm.reset(oldHour);
        }
      });

      $scope.$on(loEvents.tableControls.itemCreate, function() {
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

'use strict';

angular.module('liveopsConfigPanel')
  .controller('hoursController', [
    '$scope', '$rootScope', '$translate', '$moment', '$q', 'Alert','Session', 'Tenant', 'Region','BusinessHour', 'Timezone', 'hoursTableConfig', 'loEvents',
    function ($scope, $rootScope, $translate, $moment, $q, Alert, Session, Tenant, Region, BusinessHour, Timezone, hoursTableConfig, loEvents) {

      var vm = this;
      vm.dayPrefixes = [{
        short: 'sun',
        long: 'sunday'
      }, {
        short: 'mon',
        long: 'monday'
      }, {
        short: 'tue',
        long: 'tuesday'
      }, {
        short: 'wed',
        long: 'wednesday'
      }, {
        short: 'thu',
        long: 'thursday'
      }, {
        short: 'fri',
        long: 'friday'
      }, {
        short: 'sat',
        long: 'saturday'
      }];

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
                Alert.error(message);
              });

              return $q.reject(response);
            }));
          });

          // success
          $rootScope.$broadcast('enableAddExceptionHour');
          delete $rootScope.enableAddExceptionHour;

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

      vm.reset = function() {
        vm.isHoursCustom = vm.hasHours();
        vm.exceptionHour = null;
      };

      vm.hasHours = function() {
        if (!vm.selectedHour) {
          return false;
        }

        var hasHours = false;
        for (var index = 0; index < vm.dayPrefixes.length; index++) {
          var dayPrefix = vm.dayPrefixes[index].short;

          hasHours = vm.selectedHour[dayPrefix + 'StartTimeMinutes'] &&
            vm.selectedHour[dayPrefix + 'StartTimeMinutes'] !== 0;

          hasHours = hasHours || (vm.selectedHour[dayPrefix + 'EndTimeMinutes'] &&
            vm.selectedHour[dayPrefix + 'EndTimeMinutes'] !== 0);

          if (hasHours) {
            return true;
          }
        }
        return false;
      };

      vm.onIsHoursCustomChanged = function () {
        //TODO: figure out why switching between 24/7 and scheduled hours on an exsting resource will wipe the configured hours
        if (! vm.isHoursCustom) {
          angular.forEach(vm.dayPrefixes, function(dayPrefix) {
            vm.selectedHour[dayPrefix.short + 'StartTimeMinutes'] = 0;
            vm.selectedHour[dayPrefix.short + 'EndTimeMinutes'] = 0;
          });
        }
      };

      vm.generateHoursMessage = function(day) {
        return {
          day: $translate.instant('hours.' + day)
        };
      };

      vm.updateActive = function(){
        var hoursCopy = new BusinessHour({
          id: vm.selectedHour.id,
          tenantId: vm.selectedHour.tenantId,
          active: ! vm.selectedHour.active
        });

        return hoursCopy.save(function(result){
          vm.selectedHour.$original.active = result.active;
        });
      };

      $scope.$watch('hc.selectedHour', function(newHour) {
        if (newHour) {
          vm.reset(newHour);
        }
      });

      $scope.$on(loEvents.tableControls.itemCreate, function() {

        //Set up the cache and $scope.tenants so it will be a ngResource array
          var newTenant = Tenant.cachedGet({id: Session.tenant.tenantId});
          newTenant.$promise.then(function(){

            vm.selectedHour = new BusinessHour({
              tenantId: Session.tenant.tenantId,
              active: true,
              timezone: newTenant.timezone
            });

            vm.exceptionHour = null;
            vm.onIsHoursCustomChanged();
          });


      });

      vm.tableConfig = hoursTableConfig;
      vm.isHoursCustom = false;
      vm.loadTimezones();
      vm.loadHours();
    }
  ]);

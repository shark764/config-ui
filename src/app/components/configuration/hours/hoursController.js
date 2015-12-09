'use strict';

angular.module('liveopsConfigPanel')
  .controller('HoursController', ['$scope', '$filter', 'Session', 'BusinessHour', 'BusinessHourException', 'Timezone', 'hoursTableConfig', 'Alert',
    function($scope, $filter, Session, BusinessHour, BusinessHourException, Timezone, hoursTableConfig, Alert) {
      var vm = this;
      
      vm.dayPrefixes = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      
      vm.loadTimezones = function() {
        $scope.timezones = Timezone.query();
      };

      vm.loadHours = function() {
        $scope.hours = BusinessHour.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
        
        return $scope.hours;
      };

      $scope.submit = function(){
        return $scope.selectedHour.save();
      };

      $scope.hasHours = function() {
        if(!$scope.selectedHour) {
          return false;
        }
        
        var hasHours = false;
        for(var index = 0; index < vm.dayPrefixes.length; index++) {
          var dayPrefix = vm.dayPrefixes[index];
          
          hasHours = $scope.selectedHour[dayPrefix + 'StartTimeMinutes'] &&
            $scope.selectedHour[dayPrefix + 'StartTimeMinutes'] !== -1;
          
          hasHours = hasHours || ($scope.selectedHour[dayPrefix + 'EndTimeMinutes'] &&
            $scope.selectedHour[dayPrefix + 'EndTimeMinutes'] !== -1);
          
          if(hasHours) {
            return true;
          }
        }
        return false;
      };

      $scope.showCreateException = function(){
        //will probably need an external library to do this properly
        var newLocalDate = new Date();
        var newUTCDate = new Date(Date.UTC(
          newLocalDate.getFullYear(), newLocalDate.getMonth(), newLocalDate.getDate(), 0, 0, 0, 0));

        $scope.exceptionHour = new BusinessHourException({
          date: newUTCDate,
          isAllDay: true
        });
      };

      $scope.cancelException = function() {
        $scope.exceptionHour = null;
      };

      $scope.submitException = function(){
        return $scope.exceptionHour.save({
          tenantId: Session.tenant.tenantId,
          businessHourId: $scope.selectedHour.id
        }).then(function(exceptionHour) {
          $scope.selectedHour.$exceptions.push(exceptionHour);
          $scope.exceptionHour = null;
          Alert.success($filter('translate')('hours.exception.create.success'));
          return exceptionHour;
        }, function(error) {
          Alert.error($filter('translate')('hours.exception.create.failure'));
          return error;
        });
      };

      $scope.removeException = function(exception) {
        return exception.$delete({
          businessHourId: $scope.selectedHour.id
        }).then(function() {
          $scope.selectedHour.$exceptions.removeItem(exception);
          Alert.success($filter('translate')('hours.exception.remove.success'));
        }, function() {
          Alert.error($filter('translate')('hours.exception.remove.failure'));
        });
      };
      
      $scope.onIsHoursCustomChanged = function(isCustom) {
        if(!isCustom) {
          angular.forEach(vm.dayPrefixes, function(dayPrefix) {
            $scope.selectedHour[dayPrefix + 'StartTimeMinutes'] = -1;
            $scope.selectedHour[dayPrefix + 'EndTimeMinutes'] = -1;
          });
        }
      };
      
      $scope.generateHoursMessage = function(day) {
        return {
          day: $filter('translate')('hours.' + day)
        };
      };

      $scope.formatMinutes = function(minutes) {
        var hours = Math.floor(minutes / 60);
        hours = hours < 10 ? '0' + hours : hours;

        var minutesRemainder = minutes - (hours * 60);
        minutesRemainder = minutesRemainder < 10 ? '0' + minutesRemainder : minutesRemainder;

        return hours + ':' + minutesRemainder;
      };
      
      $scope.$watch('selectedHour', function() {
        $scope.isHoursCustom = $scope.hasHours();
      });
      
      $scope.$on('session:tenant:changed', function () {
        vm.loadHours();
      });
      
      $scope.$on('table:on:click:create', function() {
        $scope.selectedHour = new BusinessHour({
          tenantId: Session.tenant.tenantId,
          active: true
        });
      });
      
      $scope.tableConfig = hoursTableConfig;
      $scope.isHoursCustom = false;
      $scope.forms = {};
      
      vm.loadTimezones();
      vm.loadHours();
    }
  ]);

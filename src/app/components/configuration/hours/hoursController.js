'use strict';

angular.module('liveopsConfigPanel')
  .controller('HoursController', ['$scope', '$filter', 'Session', 'BusinessHour', 'BusinessHourException', 'Timezone', 'hoursTableConfig', 'Alert',
    function($scope, $filter, Session, BusinessHour, BusinessHourException, Timezone, hoursTableConfig, Alert) {
      var vm = this;

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
        for(var index in $scope.selectedHour) {
          if(index.indexOf('StartTimeMinutes') > -1 ||
            index.indexOf('EndTimeMinutes') > -1) {
            return true;
          }
        }
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
          Alert.success($filter('translate')('hours.exception.create.failure'));
          return error;
        });
      };

      $scope.removeException = function(exception) {
        return exception.$delete({
          businessHourId: $scope.selectedHour.id
        }).then(function() {
          $scope.selectedHour.$exceptions.removeItem(exception);
          Alert.success($filter('translate')('hours.exception.removed.success'));
        }, function() {
          Alert.error($filter('translate')('hours.exception.removed.failure'));
        });
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

      $scope.$on('table:on:click:create', function() {
        $scope.selectedHour = new BusinessHour({
          tenantId: Session.tenant.tenantId,
          active: true
        });
      });

      $scope.tableConfig = hoursTableConfig;
      $scope.forms = {};
      vm.loadTimezones();
      vm.loadHours();
    }
  ]);

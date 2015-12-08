'use strict';

angular.module('liveopsConfigPanel')
  .controller('HoursController', ['$scope', '$filter', 'Session', 'BusinessHour', 'BusinessHourException', 'Timezone', 'hoursTableConfig', 'apiHostname',
    function($scope, $filter, Session, BusinessHours, BusinessHourException, Timezone, hoursTableConfig) {
      var vm = this;
      
      vm.loadTimezones = function() {
        $scope.timezones = Timezone.query();
      };
      
      vm.loadHours = function() {
        $scope.hours = BusinessHours.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.submit = function(){
        return $scope.selectedHours.save();
      };
      
      $scope.hasHours = function() {
        for(var index in $scope.selectedHours) {
          return index.indexOf('StartTimeMinutes') > -1 ||
            index.indexOf('EndTimeMinutes') > -1;
        }
      };
      
      $scope.showCreateException = function(){
        $scope.exceptionHours = {};
      };
      
      $scope.addException = function(){
        $scope.selectedHours.exceptions.push($scope.exceptionHours);
        $scope.exceptionHours = null;
      };
      
      $scope.generateHoursMessage = function(day) {
        return {
          day: $filter('translate')('hours.' + day)
        };
      };
      
      $scope.$on('table:on:click:create', function() {
        $scope.selectedHours = new BusinessHours({
          tenantId: Session.tenant.tenantId,
          active: true
        });
      });
      
      $scope.hours = {};
      $scope.$watch('hours', function (newHours) {
        if(!newHours) {
          return;
        }
        
        for(var index in newHours) {
          var newDate = newHours[index];
          
          if(newDate) {
            $scope.selectedHours[index] = (newDate.getHours() * 60) + newDate.getMinutes();
          } else {
            delete $scope.selectedHours[index];
          }
        }
      }, true);
      
      $scope.tableConfig = hoursTableConfig;
      $scope.forms = {};
      vm.loadTimezones();
      vm.loadHours();
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel')
  .controller('HoursController', ['$scope', '$state', 'Session', 'BusinessHours', 'hoursTableConfig',
    function($scope, $state, Session, BusinessHours, hoursTableConfig) {
      
      $scope.fetchHours = function() {
        return BusinessHours.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function() {
        $scope.selectedHours = new BusinessHours({
          tenantId: Session.tenant.tenantId,
          type: 'default',
          exceptions: []
        });
      });

      $scope.tableConfig = hoursTableConfig;
      
      $scope.submit = function(){
        return $scope.selectedHours.save();
      };
      
      $scope.showCreateException = function(){
        $scope.exceptionHours = {};
      };
      
      $scope.addException = function(){
        $scope.selectedHours.exceptions.push($scope.exceptionHours);
        $scope.exceptionHours = null;
      };
    }
  ]);

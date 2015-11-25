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
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.tableConfig = hoursTableConfig;
      
      $scope.submit = function(){
        return $scope.selectedHours.save();
      };
    }
  ]);

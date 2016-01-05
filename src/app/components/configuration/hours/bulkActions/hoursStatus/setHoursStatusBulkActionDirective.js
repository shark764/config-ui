'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetHoursStatus', ['BusinessHour', 'Session', 'BulkAction', 'statuses',
    function(BusinessHour, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/hours/bulkActions/hoursStatus/setHoursStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }
          
          $scope.$evalAsync(function() {
            $scope.statuses = statuses();
          });

          $scope.bulkAction.apply = function(hours) {
            var hoursCopy = new BusinessHour();
            hoursCopy.id = hours.id;
            hoursCopy.tenantId = Session.tenant.tenantId;
            hoursCopy.active = $scope.active;
            return hoursCopy.save().then(function(hoursCopy) {
              angular.copy(hoursCopy, hours);
              hours.checked = true;
              return hours;
            });
          };

          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.active = '';
          };
        }
      };
    }
  ]);

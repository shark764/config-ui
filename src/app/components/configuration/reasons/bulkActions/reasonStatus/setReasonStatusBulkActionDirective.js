'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetReasonStatus', ['Reason', 'Session', 'BulkAction', 'statuses',
    function(Reason, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/reasons/bulkActions/reasonStatus/setReasonStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(reason) {
            var reasonCopy = new Reason();
            reasonCopy.id = reason.id;
            reasonCopy.tenantId = Session.tenant.tenantId;
            reasonCopy.active = $scope.active;
            reasonCopy.properties = reason.properties;
            return reasonCopy.save().then(function(reasonCopy) {
              angular.copy(reasonCopy, reason);
              reason.checked = true;
              return reason;
            });
          };

          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.active = false;
          };

          $scope.bulkAction.reset();
        }
      };
    }
  ]);

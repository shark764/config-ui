'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetReasonShared', ['Reason', 'Session', 'BulkAction', 'reasonsTableConfig',
    function(Reason, Session, BulkAction, reasonsTableConfig) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/reasons/bulkActions/reasonShared/setReasonSharedBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = reasonsTableConfig.fields.filter(function(item) {
            return item.name === '$original.shared';
          })[0].header.options;

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(reason) {
            var reasonCopy = new Reason();
            reasonCopy.id = reason.id;
            reasonCopy.tenantId = Session.tenant.tenantId;
            reasonCopy.shared = $scope.bulkAction.checked;
            reasonCopy.properties = reason.properties;
            return reasonCopy.save().then(function(reasonCopy) {
              angular.copy(reasonCopy, reason);
              reason.checked = true;
              return reason;
            });
          };

          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.shared = false;
          };

          $scope.bulkAction.reset();
        }
      };
    }
  ]);

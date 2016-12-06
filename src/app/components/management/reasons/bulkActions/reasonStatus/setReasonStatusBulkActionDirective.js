'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetReasonStatus', ['Reason', 'Session', 'BulkAction', 'statuses', 'Alert', '$translate', '$q',
    function(Reason, Session, BulkAction, statuses, Alert, $translate, $q) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/reasons/bulkActions/reasonStatus/setReasonStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(reason) {
            if (Session.tenant.tenantId !== reason.tenantId) {
              Alert.error($translate.instant('bulkActions.reason.fail', {reasonName: reason.name}));
              var deferred = $q.defer();
              deferred.reject('Cannot disable inherited reason');
              return deferred.promise;
            }
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

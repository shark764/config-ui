'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetDispositionStatus', ['Disposition', 'Session', 'BulkAction', 'statuses', 'Alert', '$translate', '$q',
    function(Disposition, Session, BulkAction, statuses, Alert, $translate, $q) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/flows/dispositions/bulkActions/dispositionStatus/setDispositionStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(disposition) {
            if (Session.tenant.tenantId !== disposition.tenantId) {
              Alert.error($translate.instant('bulkActions.reason.fail', {reasonName: disposition.name}))
              var deferred = $q.defer();
              deferred.reject('Cannot edit status of inherited disposition');
              return deferred.promise;
            }
            var dispositionCopy = new Disposition();
            dispositionCopy.id = disposition.id;
            dispositionCopy.tenantId = Session.tenant.tenantId;
            dispositionCopy.active = $scope.active;
            dispositionCopy.properties = disposition.properties;
            return dispositionCopy.save().then(function(dispositionCopy) {
              angular.copy(dispositionCopy, disposition);
              disposition.checked = true;
              return disposition;
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

'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetDispositionStatus', ['Disposition', 'Session', 'BulkAction', 'statuses',
    function(Disposition, Session, BulkAction, statuses) {
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

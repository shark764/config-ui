'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetDispositionShared', ['Disposition', 'Session', 'BulkAction', 'dispositionsTableConfig',
    function(Disposition, Session, BulkAction, dispositionsTableConfig) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/flows/dispositions/bulkActions/dispositionShared/setDispositionSharedBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = dispositionsTableConfig.fields.filter(function(item) {
            return item.name === '$original.shared';
          })[0].header.options;

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(disposition) {
            var dispositionCopy = new Disposition();
            dispositionCopy.id = disposition.id;
            dispositionCopy.tenantId = Session.tenant.tenantId;
            dispositionCopy.shared = $scope.bulkAction.checked;
            dispositionCopy.properties = disposition.properties;
            return dispositionCopy.save().then(function(dispositionCopy) {
              angular.copy(dispositionCopy, disposition);
              disposition.checked = true;
              return disposition;
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

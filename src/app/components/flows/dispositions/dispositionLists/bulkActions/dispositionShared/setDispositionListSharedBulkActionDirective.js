'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetDispositionListShared', ['DispositionList', 'Session', 'BulkAction', 'dispositionListsTableConfig',
    function(DispositionList, Session, BulkAction, dispositionListsTableConfig) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/dispositions/dispositionLists/bulkActions/dispositionShared/setDispositionListSharedBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = dispositionListsTableConfig.fields.filter(function(item) {
            return item.name === '$original.shared';
          })[0].header.options;

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(dispositionList) {
            var dispositionListCopy = new DispositionList();
            dispositionListCopy.id = dispositionList.id;
            dispositionListCopy.tenantId = Session.tenant.tenantId;
            dispositionListCopy.shared = $scope.bulkAction.checked;
            dispositionListCopy.properties = dispositionList.properties;
            return dispositionListCopy.save().then(function(dispositionListCopy) {
              angular.copy(dispositionListCopy, dispositionList);
              dispositionList.checked = true;
              return dispositionList;
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

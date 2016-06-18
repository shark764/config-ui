'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetDispositionListStatus', ['DispositionList', 'Session', 'BulkAction', 'statuses',
    function(DispositionList, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/dispositions/dispositionLists/bulkActions/dispositionStatus/setDispositionListStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(dispositionList) {
            var dispositionListCopy = new DispositionList();
            dispositionListCopy.id = dispositionList.id;
            dispositionListCopy.tenantId = Session.tenant.tenantId;
            dispositionListCopy.active = $scope.active;
            dispositionListCopy.properties = dispositionList.properties;
            return dispositionListCopy.save().then(function(dispositionListCopy) {
              angular.copy(dispositionListCopy, dispositionList);
              dispositionList.checked = true;
              return dispositionList;
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

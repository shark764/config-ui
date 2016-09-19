'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetDncListsStatus', ['DncLists', 'Session', 'BulkAction', 'statuses',
    function(DncLists, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/dncLists/bulkActions/setDncStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(dncLists) {
            var dncListsCopy = new DncLists();
            dncListsCopy.id = dncLists.id;
            dncListsCopy.name = dncLists.name;
            dncListsCopy.tenantId = Session.tenant.tenantId;
            dncListsCopy.active = $scope.active;
            return dncListsCopy.save().then(function(dncListsCopy) {
              angular.copy(dncListsCopy, dncLists);
              dncLists.checked = true;
              return dncLists;
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

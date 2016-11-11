'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetTransferlistStatus', ['$q', 'TransferList', 'Session', 'BulkAction', 'statuses',
    function ($q, TransferList, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/transferLists/bulkActions/setTransferlistStatusBulkAction.html',
        link: function ($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.submit = function () {
            // replace flow/queue resources with flow/queue id's
            $scope.selectedTransferList.endpoints = $scope.selectedTransferList.endpoints.map(function (item) {
              if (item.hasOwnProperty('tempIdx')) {
                delete item.tempIdx;
              }

              if (item.contactType === 'flow' || item.contactType === 'queue') {
                item.endpoint = item.endpoint.id;
              }
              return item;
            });

            return $scope.selectedTransferList.save({
              tenantId: Session.tenant.tenantId
            }, function (resp) {
              $scope.selectedTransferList = resp;
              $scope.replaceResources();
            });
          };


          $scope.bulkAction.apply = function (transferLists) {
            var transferListsCopy = new TransferList();
            transferListsCopy.id = transferLists.id;
            transferListsCopy.name = transferLists.name;
            transferListsCopy.tenantId = Session.tenant.tenantId;
            transferListsCopy.active = $scope.active;
            return transferListsCopy.save().then(function(transferListsCopy) {
              angular.copy(transferListsCopy, transferLists);
              transferLists.checked = true;
              return transferLists;
            });
        };


        $scope.bulkAction.reset = function () {
          $scope.bulkAction.checked = false;
          $scope.active = false;
        };

        $scope.bulkAction.reset();
      }
    };
  }]);

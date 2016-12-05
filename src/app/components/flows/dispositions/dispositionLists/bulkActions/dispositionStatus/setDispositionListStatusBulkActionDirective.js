'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetDispositionListStatus', ['DispositionList', 'Session', 'BulkAction', 'statuses', 'Alert', '$translate', '$q',
    function(DispositionList, Session, BulkAction, statuses, Alert, $translate, $q) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/flows/dispositions/dispositionLists/bulkActions/dispositionStatus/setDispositionListStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(dispositionList) {
            if (Session.tenant.tenantId !== dispositionList.tenantId) {
              Alert.error($translate.instant('bulkActions.reason.fail', {reasonName: dispositionList.name}));
              var deferred = $q.defer();
              deferred.reject('Cannot edit shared status of inherited disposition list');
              return deferred.promise;
            }
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

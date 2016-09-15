'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetReasonListShared', ['ReasonList', 'Session', 'BulkAction', 'reasonListsTableConfig', 'Alert', '$translate', '$q',
    function(ReasonList, Session, BulkAction, reasonListsTableConfig, Alert, $translate, $q) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/reasons/reasonLists/bulkActions/reasonShared/setReasonListSharedBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = reasonListsTableConfig.fields.filter(function(item) {
            return item.name === '$original.shared';
          })[0].header.options;

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(reasonList) {
            if (Session.tenant.tenantId !== reasonList.tenantId) {
              Alert.error($translate.instant('bulkActions.reason.fail', {reasonName: reasonList.name}))
              var deferred = $q.defer();
              deferred.reject('Cannot edit shared status of inherited reason list');
              return deferred.promise;
            }
            var reasonListCopy = new ReasonList();
            reasonListCopy.id = reasonList.id;
            reasonListCopy.tenantId = Session.tenant.tenantId;
            reasonListCopy.shared = $scope.bulkAction.checked;
            reasonListCopy.properties = reasonList.properties;
            return reasonListCopy.save().then(function(reasonListCopy) {
              angular.copy(reasonListCopy, reasonList);
              reasonList.checked = true;
              return reasonList;
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

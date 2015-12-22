'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetStatus', ['TenantUser', 'Session', '$q', 'Alert', '$translate', 'BulkAction',
    function(TenantUser, Session, $q, Alert, $translate, BulkAction) {
      return {
        restrict: 'E',
        require: '?^bulkActionExecutor',
        scope: {},
        templateUrl: 'app/components/management/users/bulkActions/userStatus/setStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(tenantUser) {
            if ($scope.status === 'disabled' && tenantUser.id === Session.user.id) {
              Alert.error($translate.instant('bulkActions.enable.users.fail'));
              var deferred = $q.defer();
              deferred.reject($translate.instant('bulkActions.enable.users.fail'));
              return deferred.promise;
            }

            var newUser = new TenantUser();
            newUser.id = tenantUser.id;
            newUser.status = $scope.status;
            newUser.tenantId = Session.tenant.tenantId;
            return newUser.save().then(function(userCopy) {
              tenantUser.status = userCopy.status;
              tenantUser.$original.status = userCopy.status;
              return tenantUser;
            });
          };

          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.status = '';
          };

          $scope.bulkAction.reset();
        }
      };
    }
  ]);

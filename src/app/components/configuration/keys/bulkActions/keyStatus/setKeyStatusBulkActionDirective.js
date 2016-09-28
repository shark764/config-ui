'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetKeyStatus', ['ApiKey', 'Session', 'BulkAction', 'statuses', 'TenantRole',
    function(ApiKey, Session, BulkAction, statuses, TenantRole) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/keys/bulkActions/keyStatus/setKeyStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          var Roles = TenantRole.cachedQuery({
            tenantId: Session.tenant.tenantId
          });

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(key) {
            var keyCopy = new ApiKey();
            keyCopy.id = key.id;
            keyCopy.tenantId = Session.tenant.tenantId;
            keyCopy.status = $scope.status;
            return keyCopy.save().then(function(keyCopy) {
              angular.copy(keyCopy, key);
              Roles.$promise.then(function(roles) {
                key.roleName = roles.filter(function(role) {
                  return role.id === key.roleId;
                })[0].name;
              });
              key.checked = true;
              return key;
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

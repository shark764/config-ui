'use strict';

angular.module('liveopsConfigPanel')
  .directive('rolePermissions', ['TenantPermission', '$filter', '$q', 'Session', 'Alert', '$translate',
    function(TenantPermission, $filter, $q, Session, Alert, $translate) {
      return {
        restrict: 'E',
        scope: {
          role: '='
        },
        templateUrl: 'app/components/management/roles/rolePermissions/rolePermissions.html',
        link: function($scope) {
          $scope.rolePermissions = [];
          $scope.Session = Session,

          $scope.save = function() {
            if (!$scope.selectedPermission || !$scope.selectedPermission.id) {
              return;
            }

            $scope.filtered.removeItem($scope.selectedPermission);
            $scope.role.permissions.push(angular.copy($scope.selectedPermission.id));
            $scope.rolePermissions.push(angular.copy($scope.selectedPermission));
            $scope.selectedPermission = null;


            if (!$scope.role.isNew()) {
              $scope.role.$update().then(function() {
                Alert.success($translate.instant('role.permission.add.success'));
              }, function() {
                Alert.error($translate.instant('role.permission.add.fail'));
              });
            } else {
              $scope.addPermission.permissionchanges.$setDirty();
            }
          };

          $scope.fetchPermissions = function() {
            return TenantPermission.cachedQuery({
              tenantId: Session.tenant.tenantId
            });
          };

          //TODO: remove when API returns list of permission objects
          $scope.fetchRolePermissions = function() {
            $scope.rolePermissions.length = 0;
            if ($scope.role) {
              angular.forEach($scope.role.permissions, function(permissionId) {
                $scope.rolePermissions.push(TenantPermission.cachedGet({
                  id: permissionId,
                  tenantId: Session.tenant.tenantId
                }, null, null, {
                  id: permissionId
                }));
              });
            }

            return $scope.rolePermissions;
          };

          $scope.updateFiltered = function() {
            $scope.filtered = $filter('objectNegation')($scope.fetchPermissions(), 'id', $scope.rolePermissions, 'id');
          };

          $scope.$watch('role', function() {
            $scope.fetchPermissions().$promise.then(function() {
              $scope.fetchRolePermissions();
              $q.all($scope.rolePermissions).then(function() {
                $scope.updateFiltered();
              });
            });
          });

          $scope.remove = function(permission) {
            $scope.filtered.push(permission);
            $scope.role.permissions.removeItem(permission.id);
            $scope.rolePermissions.removeItem(permission);

            if (!$scope.role.isNew()) {
              $scope.role.$update().then(function() {
                Alert.success($translate.instant('role.permission.remove.success'));
              }, function() {
                Alert.error($translate.instant('role.permission.remove.fail'));
              });
            } else {
              $scope.addPermission.permissionchanges.$setDirty();
            }
          };
        }
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel')
  .controller('keysController', ['$scope', 'Session', 'ApiKey', 'TenantRole', 'keysTableConfig', 'loEvents', '$q', '$translate', '$document', '$rootScope', '$compile', 'Modal', 'queryCache',
    function ($scope, Session, ApiKey, TenantRole, keysTableConfig, loEvents, $q, $translate, $document, $rootScope, $compile, Modal, queryCache) {

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.selectedKey = new ApiKey();
        $scope.keyMask = true;
      });

      $scope.$on(loEvents.tableControls.itemSelected, function() {
        $scope.keyMask = true;
      });

      $scope.fetchKeys = function() {
        return ApiKey.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchRoles = function() {
        return TenantRole.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $q.all([
        $scope.fetchKeys().$promise,
        $scope.fetchRoles().$promise
      ]).then(function(results) {
        results[0].forEach(function(apiKey) {
          apiKey.roleName = results[1].filter(function(role) {
            return role.id === apiKey.roleId;
          })[0].name;
        });
      });

      $scope.submit = function () {
        return $scope.selectedKey.save({
          tenantId: Session.tenant.tenantId
        }).then(function(response) {
          if (angular.isDefined(response.secret)) {
            showSecret(response.id, response.secret);
          }
          $scope.fetchRoles().$promise.then(function(roles) {
            $scope.selectedKey.roleName = roles.filter(function(role) {
              return role.id === $scope.selectedKey.roleId;
            })[0].name;
          });
          return response;
        });
      };

      function showSecret(id, secret) {
        var newScope = $rootScope.$new();
        newScope.modalBody = 'app/components/configuration/keys/secretModal.html';
        newScope.title = $translate.instant('keys.secret.modal.title');
        newScope.id = id;
        newScope.secret = secret;
        newScope.okCallback = function() {
          $document.find('modal').remove();
        };
        var element = $compile('<modal></modal>')(newScope);
        $document.find('body').append(element);
      }

      $scope.updateActive = function () {
        var keyCopy = new ApiKey({
          id: $scope.selectedKey.id,
          tenantId: $scope.selectedKey.tenantId,
          status: $scope.selectedKey.status === 'enabled' ? 'disabled' : 'enabled'
        });

        return keyCopy.save().then(function (result) {
          $scope.selectedKey.$original.active = result.active;
        }, function (errorResponse) {
          return $q.reject(errorResponse.data.error.attribute.active);
        });
      };

      $scope.toggleKeyMask = function() {
        $scope.keyMask = !$scope.keyMask;
        if ($scope.keyMask) {
          angular.element('#key-sid').attr('type', 'password');
        } else {
          angular.element('#key-sid').attr('type', 'text');
        }
      };

      $scope.confirmDeleteKey = function() {
        Modal.showConfirm({
          title: $translate.instant('keys.delete.modal.title'),
          message: $translate.instant('keys.delete.modal.message'),
          okCallback: deleteKey,
          cancelCallback: function() {
            $document.find('modal').remove();
          }
        });
      };

      function deleteKey() {
        return $scope.selectedKey.delete({
          tenantId: Session.tenant.tenantId,
          id: $scope.selectedKey.id
        }).then(function(result) {
          queryCache.remove('ApiKey');
          $q.all([
            $scope.fetchKeys().$promise,
            $scope.fetchRoles().$promise
          ]).then(function(results) {
            results[0].forEach(function(apiKey) {
              apiKey.roleName = results[1].filter(function(role) {
                return role.id === apiKey.roleId;
              })[0].name;
            });
          });
          return result;
        });
      }

      $scope.tableConfig = keysTableConfig;
    }
  ]);

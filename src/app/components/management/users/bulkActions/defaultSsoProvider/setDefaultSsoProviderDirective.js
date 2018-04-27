'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetDefaultSsoProvider', ['BulkAction', 'Session', 'IdentityProviders', '$translate', '$q', 'TenantUser',
    function(BulkAction, Session, IdentityProviders, $translate, $q, TenantUser) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/users/bulkActions/defaultSsoProvider/setDefaultSsoProvider.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.identityProviderList = [];
          var IdpSvc = new IdentityProviders();
          var activeIdps = IdpSvc.getActiveFilteredIdps();
          var TenantUserSvc = new TenantUser ();

          $q.when(activeIdps).then(function (idps) {
            if (
              angular.isArray(idps) &&
              idps.length
            ) {
              $scope.disableIdpSelect = false;
              idps.unshift({
                id: null,
                name: $translate.instant('user.details.tenantDefault')
              });
            } else {
              $scope.disableIdpSelect = true;
              idps = [{
                id: null,
                name: $translate.instant('user.details.noIdps')
              }];
            }
            $scope.identityProviderList = idps;
            $scope.defaultIdentityProvider = $scope.identityProviderList[0].id;
          });


          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function apply(tenantUser) {
            tenantUser.defaultIdentityProvider = $scope.defaultIdentityProvider;
            tenantUser = TenantUserSvc.removePropsBeforeSave(tenantUser);

            return tenantUser.save({
              tenantId: Session.tenant.tenantId,
            });
          };
        }
      };
    }
  ]);

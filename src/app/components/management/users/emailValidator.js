'use strict';

angular.module('liveopsConfigPanel')
  .directive('duplicateEmail', ['$q', '$parse', 'User', 'TenantUser', 'Session',
    function($q, $parse, User, TenantUser, Session) {
      return {
        require: ['ngModel', 'ngResource'],
        link: function($scope, elem, attrs, ctrl) {
          var ngModelController = ctrl[0];
          var ngResource = $parse(attrs.ngResource)($scope);
          // ngModelController.$validators.duplicateTenantEmail = function(modelValue) {
          //   if (ngModelController.$isEmpty(modelValue)) {
          //     // consider empty model valid
          //     return true;
          //   }
          //
          //   var tenantUsers = TenantUser.cachedQuery({
          //     tenantId: Session.tenant.tenantId
          //   });
          //
          //   for (var tenantUserIndex = 0; tenantUserIndex < tenantUsers.length; tenantUserIndex++) {
          //     var tenantUser = tenantUsers[tenantUserIndex];
          //     if (tenantUser.email === modelValue) {
          //       angular.copy(tenantUser, ngResource);
          //       return false;
          //     }
          //   }
          //
          //   $scope[attrs.ngResource] = new TenantUser({
          //     email: modelValue,
          //     roleId: ngResource.roleId,
          //     status: ngResource.status
          //   });
          //
          //   return true;
          // };

          ngModelController.$asyncValidators.duplicateEmail = function(modelValue) {
            if (ngModelController.$isEmpty(modelValue)) {
              // consider empty model valid
              return $q.when();
            }

            var def = $q.defer();

            User.query({
              email: modelValue
            }).$promise.then(function(result) {
              if (result.length > 0) {
                ngResource.$user = result[0];
                return def.reject();
              }

              return def.resolve();
            }, function(error) {

              // If the request 404s, assume the email is unique
              if (error.status === 404) {
                return def.resolve();
              }

              // By default, on error, reject
              return def.reject();
            });

            return def.promise;
          };
        }
      };
    }
  ]);

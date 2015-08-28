'use strict';

angular.module('liveopsConfigPanel')
  .directive('duplicateEmail', ['$q', '$parse', 'User',
    function($q, $parse, User) {
      return {
        require: ['ngModel', 'ngResource'],
        link: function($scope, elem, attrs, ctrl) {
          var ngModelController = ctrl[0];
          var ngResource = $parse(attrs.ngResource)($scope);
          
          ngModelController.$validators.duplicateEmail = function(modelValue) {
            var tenantUsers = $scope.fetchTenantUsers();
            
            for(var tenantUserIndex = 0; tenantUserIndex < tenantUsers.length; tenantUserIndex++) {
              var tenantUser = tenantUsers[tenantUserIndex];
              if(tenantUser.email === modelValue) {
                $scope.$emit('email:validator:found', tenantUser);
                return false;
              }
            }

            return true;
          };
          
          ngModelController.$asyncValidators.duplicateEmail = function(modelValue) {
            if (ngModelController.$isEmpty(modelValue)) {
              // consider empty model valid
              return $q.when();
            }

            var def = $q.defer();

            User.query({
              email: modelValue
            }).$promise.then(function(result) {
              ngResource.$user = new User({
                created: true
              });
              return def.reject();
              
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

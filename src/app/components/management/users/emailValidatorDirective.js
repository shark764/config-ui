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

            for (var tenantUserIndex = 0; tenantUserIndex < tenantUsers.length; tenantUserIndex++) {
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
            }).$promise.then(function() {
              ngResource.$user = new User({
                created: true
              });
              return def.reject();

            }, function(error) {

              // If the request 404s, assume the email is unique
              if (error.status === 404) {
                ngResource.$user = new User();
                return def.resolve();
              }

              // By default, on another error, set proper validity
              ngModelController.$setValidity('api', false);
              ngModelController.$error.api = error.data.error.attribute.email;
              ngModelController.$setPristine();

              var unbindWatch = $scope.$watch(function(){
                return ngModelController.$dirty;
              }, function(isDirty){
                if (isDirty){
                  ngModelController.$setValidity('api', true);
                  unbindWatch();
                }
              });

              return def.resolve();
            });

            return def.promise;
          };
        }
      };
    }
  ]);

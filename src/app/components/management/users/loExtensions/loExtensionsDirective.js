'use strict';

angular.module('liveopsConfigPanel')
  .directive('loExtensions', ['$q', '$parse', 'Session', 'loExtensionProviders', 'loExtensionTypes',
    function ($q, $parse, Session, loExtensionProviders, loExtensionTypes) {
      return {
        restrict: 'E',
        scope: {
          tenantUser: '='
        },
        templateUrl: 'app/components/management/users/loExtensions/loExtensions.html',
        link: function ($scope) {
          $scope.loExtensionProviders = loExtensionProviders;
          $scope.loExtensionTypes = loExtensionTypes;
          
          $scope.newExtension = {};
          
          $scope.add = function() {
            if ($scope.phoneExtension){
              $scope.newExtension.value =
                $scope.phoneNumber + 'x' + $scope.phoneExtension;
            }
            
            $scope.tenantUser.extensions.push($scope.newExtension);
            return save().then(function() {
              $scope.phoneNumber = null;
              $scope.phoneExtension = null;
            });
          };
          
          $scope.remove = function(extension) {
            $scope.tenantUser.extensions.removeItem(extension);
            return save();
          };
          
          $scope.moved = function(index) {
            $scope.tenantUser.extensions.splice(index, 1);
            return save();
          };
          
          var save = function() {
            delete $scope.tenantUser.status;
            delete $scope.tenantUser.roleId;
            
            return $scope.tenantUser.save({
              tenantId: Session.tenant.tenantId
            }).then(function(tenantUser) {
              $scope.newExtension = {};
              
              angular.forEach(['type', 'provider', 'value'], function(field) {
                $scope.userTenantExtensionForm[field].$setPristine();
                $scope.userTenantExtensionForm[field].$setUntouched();
              });
              
              return tenantUser;
            }, function(error) {
              var def = $q.defer();
              
              $scope.tenantUser.reset();
              
              def.reject(error);
              return def.promise;
            });
          };
        }
      };
    }
  ]);
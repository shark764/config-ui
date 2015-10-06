'use strict';

angular.module('liveopsConfigPanel')
  .directive('loExtensions', ['$parse', 'Session', 'loExtensionProviders', 'loExtensionTypes',
    function ($parse, Session, loExtensionProviders, loExtensionTypes) {
      return {
        restrict: 'E',
        scope: {
          tenantUser: '='
        },
        templateUrl: 'app/shared/directives/loExtensions/loExtensions.html',
        link: function ($scope, elem, attrs, controllers) {
          $scope.loExtensionProviders = loExtensionProviders;
          $scope.loExtensionTypes = loExtensionTypes;
          
          $scope.newExtension = {};
          
          $scope.add = function() {
            $scope.tenantUser.extensions.push($scope.newExtension);
            save();
          };
          
          $scope.remove = function(extension) {
            $scope.tenantUser.extensions.removeItem(extension);
            save();
          };
          
          var save = function() {
            var user = $scope.tenantUser.$user;
            return $scope.tenantUser.save({
              tenantId: Session.tenant.tenantId
            }).then(function(tenantUser) {
              $scope.newExtension = {};
              tenantUser.$user = user;
              tenantUser.id = user.id;
              
              angular.forEach(['type', 'provider', 'value'], function(field) {
                $scope.userTenantExtensionForm[field].$setPristine();
                $scope.userTenantExtensionForm[field].$setUntouched();
              });
            });
          }
        }
      };
    }
  ]);
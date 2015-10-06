'use strict';

angular.module('liveopsConfigPanel')
  .directive('loExtensions', ['$parse', 'loExtensionProviders', 'loExtensionTypes',
    function ($parse, loExtensionProviders, loExtensionTypes) {
      return {
        restrict: 'E',
        require: ['ngModel', '^form'],
        templateUrl: 'app/shared/directives/loExtensions/loExtensions.html',
        link: function ($scope, elem, attrs, controllers) {
          $scope.loExtensionProviders = loExtensionProviders;
          $scope.loExtensionTypes = loExtensionTypes;
          
          $scope.newExtension = {};
          
          var tenantUserForm = controllers[1];
          
          $scope.add = function() {
            $scope.extensions.push($scope.newExtension);
            $scope.newExtension = {};
            
            tenantUserForm.extensions.$setDirty();
            tenantUserForm.extensions.$setTouched();
          };
          
          $scope.remove = function(extension) {
            $scope.extensions.removeItem(extension);
            
            tenantUserForm.extensions.$setDirty();
            tenantUserForm.extensions.$setTouched();
          };
          
          $scope.$watch(attrs.ngModel, function(newExtension) {
            $scope.extensions = newExtension
          });
        }
      };
    }
  ]);
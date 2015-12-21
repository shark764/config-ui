'use strict';

angular.module('liveopsConfigPanel')
  .controller('loExtensionsController', ['$scope', '$q', '$parse', 'Session', 'loExtensionProviders', 'loExtensionTypes', '_',
    function ($scope, $q, $parse, Session, loExtensionProviders, loExtensionTypes, _) {
      var vm = this;
      $scope.loExtensionProviders = loExtensionProviders;
      $scope.loExtensionTypes = loExtensionTypes;
      $scope.sipPattern = '[s|S]{1}[i|I]{1}[p|P]{1}:.*';

      $scope.newExtension = {};

      vm.resetExtension = function () {
        $scope.newExtension = {};
        $scope.newExtension.type = 'webrtc';
        $scope.clearValues();
      };

      vm.save = function() {
        return $scope.tenantUser.save({
          tenantId : Session.tenant.tenantId
        }).then(function (tenantUser) {
          vm.resetExtension();
          return tenantUser;
        }, function (error) {

          $scope.tenantUser.reset();

          return $q.reject(error);
        });
      };

      $scope.add = function () {
        $scope.newExtension.value = $scope.phoneNumber;
        if ($scope.phoneExtension) {
          $scope.newExtension.value += 'x' + $scope.phoneExtension;
        } else if ($scope.sipExtension) {
          $scope.newExtension.value = $scope.sipExtension;
        }

        $scope.tenantUser.extensions.push($scope.newExtension);
        return vm.save().then(function (tenantUser) {
          vm.resetExtension();
          return tenantUser;
        });
      };

      $scope.clearExtensionError = function () {
        $scope.userTenantExtensionForm.extensions.$setValidity('api', true);
      };

      $scope.clearValues = function () {
        $scope.phoneNumber = null;
        $scope.phoneExtension = null;
        $scope.sipExtension = null;
        $scope.newExtension.description = null;
        delete($scope.newExtension.provider);

        angular.forEach([
            'type', 'provider', 'telValue', 'sipValue', 'description', 'extensions'
        ], function (field) {
          $scope.userTenantExtensionForm[field].$setPristine();
          $scope.userTenantExtensionForm[field].$setUntouched();
          $scope.userTenantExtensionForm[field].$setValidity('api', true);
        });
      };

      $scope.remove = function (extension) {
        $scope.tenantUser.extensions.removeItem(extension);
        return vm.save();
      };

      $scope.moved = function (index) {
        $scope.tenantUser.extensions.splice(index, 1);

        var defaultExtension = $scope.tenantUser.extensions[0];

        if(!_.isEqual(defaultExtension.value, $scope.tenantUser.activeExtension.value)) {
          $scope.tenantUser.activeExtension = defaultExtension;
        }

        return vm.save();
      };

      $scope.newExtension.type = 'webrtc';
    }
  ]);

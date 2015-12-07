'use strict';

angular.module('liveopsConfigPanel')
  .controller('loExtensionsController', ['$scope', '$q', '$parse', 'Session', 'loExtensionProviders', 'loExtensionTypes',
    function ($scope, $q, $parse, Session, loExtensionProviders, loExtensionTypes) {
      var vm = this;
      $scope.loExtensionProviders = loExtensionProviders;
      $scope.loExtensionTypes = loExtensionTypes;
      $scope.sipPattern = '[s|S]{1}[i|I]{1}[p|P]{1}:.*';
      
      $scope.newExtension = {};

      vm.save = function() {
        delete $scope.tenantUser.status;
        delete $scope.tenantUser.roleId;

        return $scope.tenantUser.save({
          tenantId : Session.tenant.tenantId
        }).then(function (tenantUser) {
          $scope.clearValues();

          return tenantUser;
        }, function (error) {
          var def = $q.defer();

          $scope.tenantUser.reset();

          def.reject(error);
          return def.promise;
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
          $scope.clearValues();
          return tenantUser;
        });
      };

      $scope.clearValues = function () {
        $scope.phoneNumber = null;
        $scope.phoneExtension = null;
        $scope.sipExtension = null;
        $scope.newExtension.provider = null;

        $scope.newExtension = {};
        $scope.newExtension.type = 'webrtc';

        angular.forEach([
            'type', 'provider', 'value', 'telValue', 'sipValue', 'description'
        ], function (field) {
          $scope.userTenantExtensionForm[field].$setPristine();
          $scope.userTenantExtensionForm[field].$setUntouched();
        });
      };

      $scope.remove = function (extension) {
        $scope.tenantUser.extensions.removeItem(extension);
        return vm.save();
      };

      $scope.moved = function (index) {
        $scope.tenantUser.extensions.splice(index, 1);
        return vm.save();
      };

      $scope.newExtension.type = 'webrtc';
    }
  ]);

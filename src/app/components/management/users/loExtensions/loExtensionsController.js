'use strict';

angular.module('liveopsConfigPanel')
  .controller('loExtensionsController', ['$scope', '$q', 'Session', 'loExtensionProviders', 'loExtensionTypes', '_', 'Alert',
    function($scope, $q, Session, loExtensionProviders, loExtensionTypes, _, Alert) {
      var vm = this;
      $scope.loExtensionProviders = loExtensionProviders;
      $scope.loExtensionTypes = loExtensionTypes;
      $scope.sipPattern = '[s|S]{1}[i|I]{1}[p|P]{1}:.*';

      $scope.newExtension = {};

      vm.resetExtension = function() {
        $scope.newExtension = {};
        $scope.newExtension.type = 'webrtc';
        $scope.clearValues();
      };

      vm.save = function() {
        return $scope.tenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function(tenantUser) {
          vm.resetExtension();
          Alert.success('Extensions saved succesfully!');
          return tenantUser;
        }, function(response) {
          $scope.form
            .loFormSubmitController
            .populateApiErrors(response);

          $scope.tenantUser.reset();

          Alert.success('Extensions failed to update.');

          return $q.reject(response);
        });
      };

      $scope.add = function() {
        $scope.newExtension.value = $scope.phoneNumber;
        if ($scope.phoneExtension) {
          $scope.newExtension.value += 'x' + $scope.phoneExtension;
        } else if ($scope.sipExtension) {
          $scope.newExtension.value = $scope.sipExtension;
        }

        $scope.tenantUser.extensions.push($scope.newExtension);
        return vm.save().then(function(tenantUser) {
          vm.resetExtension();
          return tenantUser;
        });
      };

      $scope.clearExtensionError = function() {
        $scope.form.extensions.$setValidity('api', true);
      };

      $scope.clearValues = function() {
        $scope.phoneNumber = null;
        $scope.phoneExtension = null;
        $scope.sipExtension = null;
        $scope.newExtension.description = null;
        delete($scope.newExtension.provider);

        angular.forEach([
          'type', 'provider', 'telValue', 'sipValue', 'extensiondescription', 'extensions'
        ], function(field) {
          $scope.form[field].$setPristine();
          $scope.form[field].$setUntouched();
          $scope.form[field].$setValidity('api', true);
        });
      };

      $scope.remove = function(extension) {
        $scope.tenantUser.extensions.removeItem(extension);

        var defaultExtension = $scope.tenantUser.extensions[0];

        $scope.setActiveExtension(defaultExtension);

        return vm.save();
      };

      $scope.moved = function(index) {
        $scope.tenantUser.extensions.splice(index, 1);

        var defaultExtension = $scope.tenantUser.extensions[0];

        $scope.setActiveExtension(defaultExtension);

        return vm.save();
      };

      $scope.setActiveExtension = function(extension) {
        if (!$scope.tenantUser.activeExtension ||
          !_.isEqual(extension.value, $scope.tenantUser.activeExtension.value)) {

          $scope.tenantUser.activeExtension = extension;
          $scope.form.activeExtension.$setDirty();
        }
      };

      $scope.newExtension.type = 'webrtc';
    }
  ]);

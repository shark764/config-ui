'use strict';

angular.module('liveopsConfigPanel')
  .controller('identityProvidersController', ['$scope', '$rootScope', '$q', '$translate', 'Session', 'Alert', 'loEvents', 'IdentityProviders', 'identityProvidersTableConfig', 'PermissionGroups',
    function ($scope, $rootScope, $q, $translate, Session, Alert, loEvents, IdentityProviders, identityProvidersTableConfig, PermissionGroups) {
      var vm = this;
      var bypassDropdownReset = false;
      var identityProvidersSvc = new IdentityProviders();

      $scope.forms = {};
      $scope.manageIdentityProviders = PermissionGroups.manageIdentityProviders;
      vm.tableConfig = identityProvidersTableConfig;
      vm.idpConfigInfoTypes = identityProvidersSvc.idpConfigInfoTypes;
      vm.downloadConfig = identityProvidersSvc.downloadConfig;
      vm.newFileUploaded = false;

      vm.identityProviders = IdentityProviders.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      // toggles the xml upload and xml download without cluttering html markup
      vm.displayUploadInput = function (selectedIdp) {
        if (
          !selectedIdp ||
          selectedIdp.isNew() ||
          selectedIdp.inEditMode ||
          vm.newFileUploaded ||
          (!selectedIdp.isNew() && angular.isUndefined(selectedIdp.metadataFile))
        ) {
          return true;
        }

        return false;
      };

      vm.handleConfigSelectChange = function () {
        if (
          vm.selectedIdentityProvider.selectedIdpConfigInfoType === 'xml' &&
          vm.newFileUploaded === true
        ) {
          vm.selectedIdentityProvider.inEditMode = true;
        } else {
          vm.selectedIdentityProvider.inEditMode = false;
        }
      };

      vm.triggerUpload = function () {
        document.getElementById('xml-file-input').click();
      };

      vm.getXmlFile = function () {
        identityProvidersSvc.parseXmlFile($scope);
      };

      vm.downloadConfig = function (xmlFile, idpName) {
        identityProvidersSvc.downloadConfig(xmlFile, idpName);
      };

      vm.onlyEditableTypes = function() {
        // there is an identityProvider ID, remove the option
        // to edit or create a new one, as it is uneditable
        return function (item) {
          if (
            vm.selectedIdentityProvider &&
            !vm.selectedIdentityProvider.isNew() &&
            item.val === 'sharedIdentityProviderLinkId'
          ) {
            return false;
          }

          return true;
        };
      };

      vm.updateActive = function () {
        var dataToCopy = {
          id: vm.selectedIdentityProvider.id,
          tenantId: Session.tenant.tenantId,
          active: !vm.selectedIdentityProvider.active,
          identityProvider: vm.selectedIdentityProvider.identityProvider,
          metadataFile: vm.selectedIdentityProvider.metadataFile,
          metadataUrl: vm.selectedIdentityProvider.metadataUrl
        };

        var trimmedData = _.omit(dataToCopy, _.isUndefined);
        var identityProviderCopy = new IdentityProviders(trimmedData);

        return identityProviderCopy.save().then(function (result) {
          vm.selectedIdentityProvider.$original.active = result.active;
        });
      };

      $scope.$on(loEvents.tableControls.itemSelected, function(event, selectedItem) {
        $q.when(selectedItem).then(function (selectedItemResponse) {
          // reset the drop-down menu for config-types unless we just saved
          if (!bypassDropdownReset) {
            selectedItemResponse.selectedIdpConfigInfoType = null;
          } else {
            bypassDropdownReset = false;
          }
        });
      });

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        vm.selectedIdentityProvider = new IdentityProviders({
          tenantId: Session.tenant.tenantId,
          active: false
        });
      });

      $scope.$on(loEvents.bulkActions.close, function () {
        vm.forceClose = true;
      });

      vm.submit = function () {
        var tempIdpData = angular.copy(vm.selectedIdentityProvider);
        identityProvidersSvc.deleteExtraneousProps($scope);

        return vm.selectedIdentityProvider.save()
        .then(function () {
          // make sure not to reset the config type dropdown after saving
          bypassDropdownReset = true;
          vm.newFileUploaded = false;
          Alert.success($translate.instant('value.saveSuccess'));
        }, function (err) {
          Alert.error($translate.instant('value.saveFail'));
          $scope.showDuplicateMsg = false;
          if (err.data.error.attribute === 'name') {
            Alert.error(err.data.error.message.capitalize());
            $scope.duplicateErrorMessage = err.data.error.message.capitalize();
            $scope.showDuplicateMsg = true;
          }
        })
        .then(function () {
          // setting it here again to avoid the risk of jank
          bypassDropdownReset = true;
          vm.selectedIdentityProvider.selectedIdpConfigInfoType = tempIdpData.selectedIdpConfigInfoType;
        });
      };
    }
  ]);

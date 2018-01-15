'use strict';

angular.module('liveopsConfigPanel')
  .controller('identityProvidersController', ['$scope', '$rootScope', '$q', '$translate', '$timeout', 'Session', 'Alert', 'loEvents', 'IdentityProviders', 'identityProvidersTableConfig', 'PermissionGroups',
    function ($scope, $rootScope, $q, $translate, $timeout, Session, Alert, loEvents, IdentityProviders, identityProvidersTableConfig, PermissionGroups) {
      var vm = this;
      var bypassDropdownReset = false;
      var identityProvidersSvc = new IdentityProviders();

      $scope.forms = {};
      $scope.manageIdentityProviders = PermissionGroups.manageIdentityProviders;
      vm.tableConfig = identityProvidersTableConfig;
      vm.idpConfigInfoTypes = identityProvidersSvc.idpConfigInfoTypes;
      vm.downloadConfig = identityProvidersSvc.downloadConfig;
      vm.newFileUploaded = false;
      vm.disableActiveToggle = true;

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

      vm.setXmlInputState = function (params) {
        vm.selectedIdentityProvider.backupXml = angular.copy(params.backupXml) || vm.selectedIdentityProvider.backupXml;

        vm.selectedIdentityProvider.isReadonly = (params.isReadonly === true || params.isReadonly === false) ? params.isReadonly : vm.selectedIdentityProvider.isReadonly;

        vm.editLinkText = params.editLinkText || vm.editLinkText;

        vm.selectedIdentityProvider.selectedIdpConfigInfoType = params.selectedIdpConfigInfoType || vm.selectedIdentityProvider.selectedIdpConfigInfoType;

        vm.selectedIdentityProvider.metadataFile = params.metadataFile || vm.selectedIdentityProvider.metadataFile;

        if (_.has($scope.forms.detailsForm, 'xmlDirectInput.$pristine')) {
          $scope.forms.detailsForm.xmlDirectInput.$pristine = params.isPristine || $scope.forms.detailsForm.xmlDirectInput.$pristine;
        }
      };

      vm.setEditState = function () {
        vm.setXmlInputState({
          backupXml: vm.selectedIdentityProvider.metadataFile,
          isReadonly: false,
          editLinkText: $translate.instant('value.cancel')
        });
      };

      vm.setCancelledState = function () {
        vm.setXmlInputState({
          metadataFile: vm.selectedIdentityProvider.backupXml,
          isReadonly: true,
          editLinkText: $translate.instant('identityProviders.details.editXmlMarkup')
        });
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

        // the XML Direct Input configType
        if (
          // the xml direct input option is selected
          vm.selectedIdentityProvider.selectedIdpConfigInfoType === 'xmlDirectInput' &&
          (
            // ...and it's either a new IDP, or an existing IDP
            // with no metadataFile value
            vm.selectedIdentityProvider.isNew() || !vm.selectedIdentityProvider.metadataFile
          )
        ) {
          vm.setXmlInputState({
            backupXml: undefined,
            isReadonly: false,
            editLinkText: ''
          });
        } else if (
            // ...we've selected xml direct input and there
            // is already saved data there
            !vm.selectedIdentityProvider.isNew() &&
            vm.selectedIdentityProvider.selectedIdpConfigInfoType === 'xmlDirectInput' &&
            vm.selectedIdentityProvider.metadataFile
        ) {
          vm.setXmlInputState({
            isReadonly: true,
            editLinkText: $translate.instant('identityProviders.details.editXmlMarkup')
          });
        } else if (_.has($scope.forms.detailsForm, 'xmlDirectInput.$pristine')) {
          if ($scope.forms.detailsForm.xmlDirectInput.$pristine !== true) {
            // ...warn the user that they will lose their changes if
            // the dropdown change completes
            Alert.confirm($translate.instant('identityProviders.details.enterXmlUnsaved'),
              // user clicks "OK"
              function() {
                vm.setXmlInputState({
                  metadataFile: vm.selectedIdentityProvider.backupXml,
                  isReadonly: true,
                  editLinkText: $translate.instant('identityProviders.details.editXmlMarkup')
                });
              },
              // user clicks "Cancel"
              function() {
                vm.setXmlInputState({
                  selectedIdpConfigInfoType: 'xmlDirectInput',
                  isReadonly: false,
                  editLinkText: (!vm.selectedIdentityProvider.isNew() && vm.selectedIdentityProvider.$original.metadataFile) ? $translate.instant('value.cancel') : ''
                });
              }
            );
          // if the XML direct input has not been modified or was modified
          // but someone hit 'cancel', then make sure that the textarea resets
          } else {
            vm.setXmlInputState({
              isReadonly: true,
              editLinkText: $translate.instant('identityProviders.details.editXmlMarkup'),
              isPristine: true
            });
          }
        }

        // prevent submit button from activating when "Type" dropdown
        // selection is changed with no file or url set
        $timeout(function () {
          if (
            !vm.selectedIdentityProvider.metadataUrl &&
            (!vm.selectedIdentityProvider.metadataFile || !vm.selectedIdentityProvider.metadataFileName)
          ) {
            $scope.forms.detailsForm.$invalid = true;
          }
        });

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

      vm.clearUploadField = function () {
        vm.selectedIdentityProvider.metadataFile = null;
        vm.selectedIdentityProvider.metadataFileName = null;
      };

      vm.updateActive = function () {
        // an extra safeguard so that in case the disabling of the UI doesn't work
        // we also prevent the updating here
        if (vm.disableActiveToggle) {
          return;
        }

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

          // here is where we set the flag the disables the enabled/disabled toggle
          // in the event that this is the IDP we are currently logged in with
          var isActiveIdp = identityProvidersSvc.isActiveIdp(selectedItemResponse.id);
          isActiveIdp.then(function (response) {
            vm.disableActiveToggle = response;

            if (vm.disableActiveToggle) {
              // this is the popup text we show on mouseover to explain why we
              // disabled the switch
              vm.displayToggleMessage = $translate.instant('identityProviders.details.cannotDisable');
            } else {
              vm.displayToggleMessage = '';
            }

            if (vm.selectedIdentityProvider.metadataFile) {
              vm.setXmlInputState({
                isReadonly: true,
                editLinkText: $translate.instant('identityProviders.details.editXmlMarkup')
              });
            } else {
              vm.setXmlInputState({
                backupXml: undefined,
                isReadonly: false,
                editLinkText: ''
              });
            }
          });
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
        .then(function (response) {
          // make sure not to reset the config type dropdown after saving
          bypassDropdownReset = true;
          vm.newFileUploaded = false;

          if (tempIdpData.selectedIdpConfigInfoType === 'xmlDirectInput') {
            vm.setXmlInputState({
              isReadonly: true,
              editLinkText: $translate.instant('identityProviders.details.editXmlMarkup'),
              metadataFile: response.metadataFile
            });
          }

          Alert.success($translate.instant('value.saveSuccess'));
        }, function (err) {
          Alert.error($translate.instant('value.saveFail'));
          $scope.showDuplicateMsg = false;
          if (err.data.error.attribute === 'name') {
            vm.selectedIdentityProvider = tempIdpData;
            Alert.error(err.data.error.message.capitalize());
            $scope.duplicateErrorMessage = err.data.error.message.capitalize();
            $scope.showDuplicateMsg = true;
            if (tempIdpData.selectedIdpConfigInfoType === 'xmlDirectInput') {
              vm.selectedIdentityProvider.metadataFile = vm.selectedIdentityProvider.$original.metadataFile;
              vm.setXmlInputState({
                selectedIdpConfigInfoType: 'xmlDirectInput',
                isReadonly: false,
                editLinkText: (!vm.selectedIdentityProvider.isNew() && vm.selectedIdentityProvider.$original.metadataFile) ? $translate.instant('value.cancel') : ''
              });
            }
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

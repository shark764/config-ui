'use strict';

angular.module('liveopsConfigPanel')
  .controller('IntegrationsController', ['$scope', '$translate', 'Alert', 'Session', 'Integration', 'Tenant', 'Listener', 'integrationTableConfig', 'loEvents', '$q', 'GlobalRegionsList', 'Region', 'appFlags',
    function ($scope, $translate, Alert, Session, Integration, Tenant, Listener, integrationTableConfig, loEvents, $q, GlobalRegionsList, Region, appFlags) {
      var integrationSvc = new Integration();
      $scope.tempScope = $scope;
      $scope.showDuplicateMsg = false;
      $scope.handleAuthMethodSelect = integrationSvc.handleAuthMethodSelect;
      $scope.deleteExtraneousData = integrationSvc.deleteExtraneousData;
      $scope.authenticationTypes = integrationSvc.authenticationTypes;

      $scope.customIntegrationTypes = [
        {
          name: $translate.instant('integration.details.properties.rest'),
          value: 'rest'
        },
        {
          name: $translate.instant('integration.details.properties.salesforce'),
          value: 'salesforce'
        },
        {
          name: $translate.instant('integration.details.properties.zendesk'),
          value: 'zendesk'
        }
      ];

      if (appFlags.VERINT_INTEGRATION) {
        $scope.customIntegrationTypes.push({
          name: $translate.instant('integration.details.properties.verint'),
          value: 'verint'
        });
      }

      if (appFlags.EMAIL_PERMS) {
        $scope.customIntegrationTypes.push({
          name: $translate.instant('integration.details.properties.email'),
          value: 'email'
        });
      }

      $scope.getTypeData = function (selectedType, property) {
        if (!selectedType) {
          return;
        }

        var selectedProperty = property || 'value';

        // here we are checking to see if the selectedType is an object
        // with a more user-friendly name that we can use for display purposes
        var evaluatedIntegrationType = _.find($scope.customIntegrationTypes, function (typeVal) {
          return selectedType === typeVal.value;
        });

        if (angular.isDefined(evaluatedIntegrationType) && selectedProperty !== 'value') {
          return evaluatedIntegrationType[selectedProperty];
        } else {
          return selectedType;
        }
      };

      $scope.smtpEncryptionTypes = [
        'ssl/tls',
        'starttls'
      ];

      $scope.twilioRegions = GlobalRegionsList;
      $scope.twilioDefaultRegion = GlobalRegionsList[0].twilioId;

      if(appFlags.SHOW_ZENDESK){
        $scope.showZendesk = true;
      }

      $scope.customTypesHideShowFields = function (selectedIntegration, customTypeValue) {
        if (selectedIntegration) {
          if ((selectedIntegration.type && selectedIntegration.type.hasOwnProperty('name') && selectedIntegration.type.value === customTypeValue) || selectedIntegration.type === customTypeValue) {
            return true;
          } else {
            return false;
          }
        }
      };

      function detectAuthMethod (integration) {
        if (integration.properties && integration.properties.token === '') {
          if (integration.properties.username === '') {
            return 'noAuth';
          } else {
            return 'basic';
          }
        } else {
          return 'token';
        }
      }

      function addAuthMethodProp (integrations) {
        var whichAuthMethod;

        return _.map(integrations, function (val, key) {
          if (val.hasOwnProperty('type') && val.type === 'rest') {
            whichAuthMethod = detectAuthMethod(val);

            return _.merge($scope.integrationList[key], {
              authType: whichAuthMethod
            });
          }
        });
      }

      $scope.integrationList = Integration.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      $q.when($scope.integrationList.$promise)
        .then(function (integrationData) {
           addAuthMethodProp(integrationData);
        });

      $scope.fetchListeners = function (invalidate) {
        return Listener.cachedQuery({
          tenantId: Session.tenant.tenantId,
          integrationId: $scope.selectedIntegration.id
        }, 'Listener' + $scope.selectedIntegration.id, invalidate);
      };

      $scope.clearInteractionFieldId = function () {
        if ($scope.selectedIntegration.properties.workItems === false) {
          $scope.selectedIntegration.properties.interactionFieldId = '';
        }
      };

      $scope.setDefaultVal = function () {
        if ($scope.selectedIntegration.type.value === 'zendesk') {
          if (angular.isUndefined($scope.selectedIntegration.properties.endpointPrefix) || $scope.selectedIntegration.properties.endpointPrefix === '') {
            $scope.selectedIntegration.properties.endpointPrefix = 'https://subdomain.zendesk.com/api/v2';
          }
        } else {
          $scope.selectedIntegration.properties.endpointPrefix = '';
        }
        if ($scope.selectedIntegration.type.value === 'email') {
          if (angular.isUndefined($scope.selectedIntegration.properties.incomingType) || $scope.sselectedIntegration.properties.incomingType === '') {
            $scope.selectedIntegration.properties.incomingType = 'imap';
          }
        }
      };

      $scope.createIntegration = function () {
        $scope.selectedIntegration = new Integration({
          properties: {},
          active: true,
          type: $scope.customIntegrationTypes[0],
          authType: 'basic'
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.createIntegration();
      });

      $scope.$watch('selectedIntegration', function() {
        $scope.showDuplicateMsg = false;

        if ($scope.selectedIntegration && $scope.selectedIntegration.type === 'email') {
          if ($scope.selectedIntegration.properties.smtpEncryptionType === 'TLS') {
            $scope.selectedIntegration.properties.smtpEncryptionType = 'starttls';
          } else if ($scope.selectedIntegration.properties.smtpEncryptionType === 'SSL') {
            $scope.selectedIntegration.properties.smtpEncryptionType = 'ssl/tls';
          }
        }
      });

      $scope.submit = function () {
        // we will use this variable after saving to set the auth type select bac to what it was
        var tempSelectedAuthType = $scope.selectedIntegration.authType;
        $scope.deleteExtraneousData($scope);

        return $scope.selectedIntegration.save({
          tenantId: Session.tenant.tenantId
        })
        .then(function () {
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
        .then(function() {
          $scope.handleAuthMethodSelect($scope, tempSelectedAuthType, $scope.authMethodCopy, 'true');
        });
      };

      $scope.updateActive = function () {
        var integrationCopy = new Integration({
          id: $scope.selectedIntegration.id,
          tenantId: $scope.selectedIntegration.tenantId,
          active: !$scope.selectedIntegration.active
        });

        var tempSelectedAuthType = $scope.selectedIntegration.authType;
        $scope.deleteExtraneousData($scope);

        return integrationCopy.save().then(function (result) {
          $scope.selectedIntegration.$original.active = result.active;
          $scope.fetchListeners(true);
        }, function (errorResponse) {
          return $q.reject(errorResponse.data.error.attribute.active);
        })
        .then(function() {
          $scope.handleAuthMethodSelect($scope, tempSelectedAuthType, 'true');
        });
      };

      $scope.tableConfig = integrationTableConfig;

      $scope.validation = {
        hostAddress: '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})',
        port: '\\d{2,4}'
      };
    }
  ]);

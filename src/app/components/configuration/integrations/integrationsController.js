'use strict';

angular.module('liveopsConfigPanel')
  .controller('IntegrationsController', ['$scope', '$translate', 'Alert', 'Session', 'Integration', 'Tenant', 'Listener', 'integrationTableConfig', 'loEvents', '$q', 'GlobalRegionsList', 'Region','appFlags',
    function ($scope, $translate, Alert, Session, Integration, Tenant, Listener, integrationTableConfig, loEvents, $q, GlobalRegionsList, Region, appFlags) {
      var integrationSvc = new Integration();
      $scope.tempScope = $scope;

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
        'TLS',
        'SSL'
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
      }

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
            $scope.selectedIntegration.properties.endpointPrefix = 'https://subdomain.zendesk.com/api/v2'
          }
        } else {
          $scope.selectedIntegration.properties.endpointPrefix = '';
        }
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.selectedIntegration = new Integration({
          properties: {},
          active: true,
          type: $scope.customIntegrationTypes[0],
          authType: 'basic'
        });
      });

      $scope.submit = function () {
        // we will use this variable after saving to set the auth type select bac to what it was
        var tempSelectedAuthType = $scope.selectedIntegration.authType;
        $scope.deleteExtraneousData($scope);

        return $scope.selectedIntegration.save({
          tenantId: Session.tenant.tenantId
        })
        .then(function (savedIntegration) {
          Alert.success($translate.instant('value.saveSuccess'));
        }, function (err) {
          Alert.error($translate.instant('value.saveFail'));
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
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel')
  .controller('IntegrationsController', ['$scope', 'Session', 'Integration', 'Tenant', 'Listener', 'integrationTableConfig', 'loEvents', '$q', 'GlobalRegionsList', 'Region','appFlags',
    function ($scope, Session, Integration, Tenant, Listener, integrationTableConfig, loEvents, $q, GlobalRegionsList, Region, appFlags) {

      $scope.customIntegrationTypes = ['salesforce', 'zendesk'];

      $scope.smtpEncryptionTypes = ['TLS', 'SSL'];

      $scope.twilioRegions = GlobalRegionsList;
      $scope.twilioDefaultRegion = GlobalRegionsList[0].twilioId;

      if(appFlags.SHOW_ZENDESK){
        $scope.showZendesk = true;
      }

      $scope.fetchIntegrations = function () {
        return Integration.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchListeners = function (invalidate) {
        return Listener.cachedQuery({
          tenantId: Session.tenant.tenantId,
          integrationId: $scope.selectedIntegration.id
        }, 'Listener' + $scope.selectedIntegration.id, invalidate);
      };

      $scope.clearInteractionFieldId = function () {
        if ($scope.selectedIntegration.properties.workItems === false) {
          $scope.selectedIntegration.properties.interactionFieldId = ''
        }
      };

      $scope.setDefaultVal = function () {
        if ($scope.selectedIntegration.type === 'zendesk') {
          if (angular.isUndefined($scope.selectedIntegration.properties.endpointPrefix) || $scope.selectedIntegration.properties.endpointPrefix === '') {
            $scope.selectedIntegration.properties.endpointPrefix = 'https://obscura.zendesk.com/api/v2'
          }
        }
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.selectedIntegration = new Integration({
          properties: {},
          active: true
        });
      });

      $scope.submit = function () {
        if ($scope.selectedIntegration.description === null) {
          delete $scope.selectedIntegration.description;
        }

        return $scope.selectedIntegration.save({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.updateActive = function () {
        var integrationCopy = new Integration({
          id: $scope.selectedIntegration.id,
          tenantId: $scope.selectedIntegration.tenantId,
          active: !$scope.selectedIntegration.active
        });

        return integrationCopy.save().then(function (result) {
          $scope.selectedIntegration.$original.active = result.active;
          $scope.fetchListeners(true);
        }, function (errorResponse) {
          return $q.reject(errorResponse.data.error.attribute.active);
        });
      };

      $scope.tableConfig = integrationTableConfig;
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignsController', [
    '$scope', '$rootScope', '$translate', '$moment', '$q', '$state', 'Alert', 'Session', 'Campaign', 'campaignsTableConfig', 'loEvents', 'campaignChannelTypes', 'Flow',
    function ($scope, $rootScope, $translate, $moment, $q, $state, Alert, Session, Campaign, campaignsTableConfig, loEvents, campaignChannelTypes, Flow) {
      var cc = this,
        campaignSvc = new Campaign(),
        currentlySelectedCampaign;

      $scope.$watch('cc.selectedCampaign', function (currentlySelectedCampaign) {
        console.log('cc.selectedCampaign', cc.selectedCampaign);
        if (currentlySelectedCampaign) {
          currentlySelectedCampaign = cc.selectedCampaign;
          cc.selectedCampaign.channel = cc.campaignChannels[0];
        }
      });

      // TODO: Centralize this
      cc.fetchFlows = function () {
        var flows = Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        _.remove(flows, function (flow) {
          return flow.tenantId !== Session.tenant.tenantId;
        });

        return flows;
      };

      cc.campaigns = Campaign.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      cc.tableConfig = campaignsTableConfig;

      // campaignChannelTypes is an array we get from index.constants.js, as the list of campaign channels
      // is not editable by the user, nor do they exist in the campaigns API
      cc.campaignChannels = campaignChannelTypes;

      cc.submit = function () {
        return cc.selectedCampaign.save({
          tenantId: Session.tenant.tenantId
        })
      };

      cc.editCampaignSettings = function (currentlySelectedCampaign) {
        console.log('clicked!', currentlySelectedCampaign);
        $state.go('content.configuration.campaignSettings', {
          id: currentlySelectedCampaign.id,
          // TODO: confirm whether or not we ultimately need ALL of the campaign data, maybe we only need
          // the ID for the settings page.
          allData: JSON.stringify(currentlySelectedCampaign)
        });
      }

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        cc.create();
      });

      cc.create = function () {
        cc.selectedCampaign = new Campaign({
          tenantId: Session.tenant.tenantId
        })
      };

      cc.startCampaign = function () {

      };

    }
  ]);

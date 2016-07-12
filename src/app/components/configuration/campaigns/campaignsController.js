'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignsController', [
    '$scope', '$rootScope', '$translate', '$moment', '$q', '$state', 'Alert', 'Session', 'Campaign', 'campaignsTableConfig', 'loEvents', 'campaignChannelTypes', 'Flow',
    function ($scope, $rootScope, $translate, $moment, $q, $state, Alert, Session, Campaign, campaignsTableConfig, loEvents, campaignChannelTypes, Flow) {
      var cc = this,
        campaignSvc = new Campaign(),
        currentlySelectedCampaign = cc.selectedCampaign;

      $scope.$watch('cc.selectedCampaign', function (currentlySelectedCampaign) {
        if (currentlySelectedCampaign) {
          currentlySelectedCampaign = cc.selectedCampaign;
          cc.selectedCampaign.channel = cc.campaignChannels[0];
        }
      });

      var campaigns = Campaign.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      var flows = Flow.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      function getFlowName(cam, flo) {
        // add a flowName property to the campaign object with the name of the
        // corresponding flow
        angular.forEach(cam, function (camp) {
          // using a try/catch because some campaigns don't
          // have a flow, and this prevents the page from breaking
          try {
            camp.flowName = flo.filter(function (flow) {
              return flow.id === camp.flowId;
            })[0].name;
          } catch (err) {}
        });
      }

      $q.all([
          campaigns.$promise,
          flows.$promise
        ])
        .then(function () {
          // get rid of all of the flows that don't belong to this tenant
          _.remove(flows, function (flow) {
            return flow.tenantId !== Session.tenant.tenantId;
          });

          getFlowName(campaigns, flows);

          // now, finally grant the page access to the list of flows and campaigns
          cc.flows = flows;
          cc.campaigns = campaigns;
        });

      // apply the table configuration
      cc.tableConfig = campaignsTableConfig;

      // campaignChannelTypes is an array we get from
      // index.constants.js, as the list of campaign channels
      // is not editable by the user, nor do they exist in the campaigns API
      cc.campaignChannels = campaignChannelTypes;

      cc.submit = function () {
        return cc.selectedCampaign.save({
          tenantId: Session.tenant.tenantId
        })
      };

      cc.editCampaignSettings = function (currentlySelectedCampaign) {
        $state.go('content.configuration.campaignSettings', {
          id: currentlySelectedCampaign.id,
          // TODO: confirm whether or not we ultimately need
          // ALL of the campaign data, maybe we only need the ID for the settings page.
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

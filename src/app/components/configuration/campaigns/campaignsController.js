'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignsController', [
    '$scope', '$rootScope', '$translate', '$moment', '$q', '$state', 'Alert', 'Session', 'Campaign', 'CampaignVersionLatest', 'CampaignVersion', 'campaignsTableConfig', 'loEvents', 'campaignChannelTypes', 'Flow',
    function ($scope, $rootScope, $translate, $moment, $q, $state, Alert, Session, Campaign, CampaignVersionLatest, CampaignVersion, campaignsTableConfig, loEvents, campaignChannelTypes, Flow) {
      var cc = this,
        campaignSvc = new Campaign(),
        latestCampaignVersionSvc = new CampaignVersionLatest(),
        currentlySelectedCampaign;

      // get all of the campaigns
      function getCampaignList () {

        var campaigns = Campaign.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        return $q.when(campaigns.$promise).then(function (response) {
          // cycle through the campaign to get the numbers
          var campaignIds = _.map(response, function (val) {
            // get the latest versions using those campaign numbers
            var latestVersions = CampaignVersionLatest.cachedGet({
              tenantId: Session.tenant.tenantId,
              campaignId: val.id
            });

            $q.when(latestVersions.$promise).then(function (response) {
              // get the latest versions using the version numbers
              var version = CampaignVersion.cachedGet({
                tenantId: Session.tenant.tenantId,
                campaignId: val.id,
                versionId: response.versionId.result.latestVersionId
              });

              $q.when(version.$promise).then(function (response) {
                console.log('response', response);
                cc.campaigns = response;
              });
            });
          });
        });
      }

      $scope.$watch('cc.selectedCampaign', function (currentlySelectedCampaign) {
        if (currentlySelectedCampaign) {
          currentlySelectedCampaign = cc.selectedCampaign;
          cc.selectedCampaign.channel = cc.campaignChannels[0];
        }
      });

      cc.loadCampaigns = function () {
        cc.campaigns = Campaign.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
        //getCampaignList();
      };

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

      cc.loadCampaigns();
      cc.tableConfig = campaignsTableConfig;

      // campaignChannelTypes is an array we get from index.constants.js, as the list of campaign channels
      // is not editable by the user, nor do they exist in the campaigns API
      cc.campaignChannels = campaignChannelTypes;

      cc.submit = function (currentlySelectedCampaign) {
        $state.go('content.configuration.campaignSettings', {
          id: currentlySelectedCampaign.id,
          allData: JSON.stringify(currentlySelectedCampaign)
        });
      };

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

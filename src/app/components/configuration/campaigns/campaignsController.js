'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignsController', [
    '$scope', '$rootScope', '$timeout', '$translate', '$moment', '$q', '$state', 'Alert', 'Session', 'Campaign', 'CampaignStart', 'CampaignCallListJobs', 'campaignsTableConfig', 'loEvents', 'campaignChannelTypes', 'Flow', 'Upload', 'DirtyForms', 'apiHostname',
    function ($scope, $rootScope, $timeout, $translate, $moment, $q, $state, Alert, Session, Campaign, CampaignStart, CampaignCallListJobs, campaignsTableConfig, loEvents, campaignChannelTypes, Flow, Upload, DirtyForms, apiHostname) {
      var cc = this,
        campaignSvc = new Campaign(),
        currentlySelectedCampaign = cc.selectedCampaign,
        jobsList;

      var campaigns = Campaign.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      var flows = Flow.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      // check to make sure that the campaign has at least one version,
      // which means that it is also a valid campaign that can actually be started
      function hasVersion () {
        cc.selectedCampaign.hasVersion = angular.isDefined(cc.selectedCampaign.latestVersion);
      };

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

      $scope.$watch('cc.selectedCampaign', function (currentlySelectedCampaign) {
        if (currentlySelectedCampaign) {
          var jobs = CampaignCallListJobs.cachedGet({
            tenantId: Session.tenant.tenantId,
            campaignId: currentlySelectedCampaign.id
          });

          hasVersion();
          $q.when(jobs.$promise).then(function () {
            cc.selectedCampaign.lastJob = jobs[0];
            console.log('cc.selectedCampaign.lastJob', cc.selectedCampaign.lastJob);
          });
          currentlySelectedCampaign = cc.selectedCampaign;
          cc.selectedCampaign.channel = cc.campaignChannels[0];
        }
      });

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

      cc.importContactList = function (fileData) {
        var upload = Upload.upload({
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns/' + cc.selectedCampaign.id + '/call-list',
          method: 'POST',
          file: cc.selectedCampaign.callListData
        });

        upload.then(function (response) {
          $timeout(function () {
            var jobData = CampaignCallListJobs.cachedGet({
              tenantId: Session.tenant.tenantId,
              campaignId: cc.selectedCampaign.id
            });

            $q.when(jobData.$promise).
            then(function () {
              getJobsList();
              console.log('jobsList[0]', jobsList[0]);
            });

            //cc.selectedCampaign.callListData.save();
            //dncEdit.contacts = [sampleContact1, sampleContact2, sampleContact3, sampleContact4];
          });
        });

        return upload;
      };


      cc.submit = function () {
        return cc.selectedCampaign.save({
          tenantId: Session.tenant.tenantId
        }).then(function () {
          // once the campaign has been saved, re-evaluate for the presence of a version
          // so that we can properly enable or disable the start/stop toggle
          hasVersion();
        })
      };

      cc.editCampaignSettings = function (currentlySelectedCampaign) {
        $state.go('content.configuration.campaignSettings', {
          id: currentlySelectedCampaign.id,
          // TODO: confirm whether or not we ultimately need ALL of the campaign data, maybe we only need the ID for the settings page.
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

      cc.startStopCampaign = function () {
        switch(cc.selectedCampaign.currentState) {
          case 'stopped':
            console.log('starting!');
            return CampaignStart.save({
              tenantId: Session.tenant.tenantId,
              campaignId: cc.selectedCampaign.id,
              versionId: cc.selectedCampaign.latestVersion,
            });
          case 'started':
            console.log('stopping!');
            return CampaignStop.save({
              tenantId: Session.tenant.tenantId,
              campaignId: cc.selectedCampaign.id,
              versionId: cc.selectedCampaign.latestVersion,
            });
        }
      };

    }
  ]);

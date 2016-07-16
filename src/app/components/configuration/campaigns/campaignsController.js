'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignsController', [
    '$scope', '$rootScope', '$timeout', '$translate', '$moment', '$q', '$state', 'Alert', 'Session', 'Campaign', 'CampaignStart', 'CampaignCallListJobs', 'CampaignCallListDownload', 'campaignsTableConfig', 'loEvents', 'campaignChannelTypes', 'Flow', 'Upload', 'DirtyForms', 'apiHostname',
    function ($scope, $rootScope, $timeout, $translate, $moment, $q, $state, Alert, Session, Campaign, CampaignStart, CampaignCallListJobs, CampaignCallListDownload, campaignsTableConfig, loEvents, campaignChannelTypes, Flow, Upload, DirtyForms, apiHostname) {
      var cc = this,
        campaignSvc = new Campaign(),
        currentlySelectedCampaign = cc.selectedCampaign

      var campaigns = Campaign.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      var flows = Flow.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      // check to make sure that the campaign has at least one version,
      // which means that it is also a valid campaign that can actually be started
      function hasVersion() {
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
          hasVersion();
          currentlySelectedCampaign = cc.selectedCampaign;

          // fixes wierd Angular issue where it adds an empty select option in
          // the drop down menus
          cc.selectedCampaign.channel = cc.campaignChannels[0];

          // get the jobs and download lists...
          // unless, of course, it's a new campaign and neither exist
          if (!cc.selectedCampaign.isNew()) {
            var jobList = CampaignCallListJobs.cachedGet({
              tenantId: Session.tenant.tenantId,
              campaignId: currentlySelectedCampaign.id
            });

            // var callListDownload = CampaignCallListDownload.cachedGet({
            //   tenantId: Session.tenant.tenantId,
            //   campaignId: currentlySelectedCampaign.id
            // });

            $q.all([
              jobList.$promise//,
              //callListDownload.$promise
            ]).then(function () {
                if (jobList.jobs.length > 0) {
                  cc.selectedCampaign.hasCallList = true;
                } else {
                  cc.selectedCampaign.hasCallList = false;
                }
            });
          }
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
        //getCampaignList();


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
            console.log('response', response);
            var jobData = CampaignCallListJobs.cachedGet({
              tenantId: Session.tenant.tenantId,
              campaignId: cc.selectedCampaign.id
            });

            $q.when(jobData).
            then(function () {
              cc.selectedCampaign.hasCallList = true;
              // var lastJobData = CampaignCallListJobs.cachedGet({
              //   tenantId: Session.tenant.tenantId,
              //   campaignId: cc.selectedCampaign.id,
              //   jobId: jobData.id
              // });
              // console.log('lastJobData', lastJobData);
            });

            //cc.selectedCampaign.callListData.save();
            //dncEdit.contacts = [sampleContact1, sampleContact2, sampleContact3, sampleContact4];
          });
        });

        return upload;
      };

      cc.downloadCallList = function () {
        var downloadCallList = CampaignCallListDownload.query({
          tenantId: Session.tenant.tenantId,
          campaignId: cc.selectedCampaign.id
        });

        $q.when(downloadCallList).then(function () {
          console.log('downloadCallList', downloadCallList);
          return downloadCallList;
        });
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
          id: currentlySelectedCampaign.id
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
        switch (cc.selectedCampaign.currentState) {
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

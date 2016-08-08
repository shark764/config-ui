'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignsController', [
    '$scope', '$rootScope', '$timeout', '$translate', '$moment', '$q', '$state', '$document', '$compile', 'Alert', 'Session', 'Campaign', 'CampaignStart', 'CampaignStop', 'CampaignCallListJobs', 'CampaignCallListDownload', 'campaignsTableConfig', 'loEvents', 'Flow', 'Upload', 'DirtyForms', 'apiHostname',
    function ($scope, $rootScope, $timeout, $translate, $moment, $q, $state, $document, $compile, Alert, Session, Campaign, CampaignStart, CampaignStop, CampaignCallListJobs, CampaignCallListDownload, campaignsTableConfig, loEvents, Flow, Upload, DirtyForms, apiHostname) {
      var cc = this;
      var CampaignCallListDownload = new CampaignCallListDownload(),
          currentlySelectedCampaign = cc.selectedCampaign;
        // load up all of the page data...

      // first call the campaigns...
      cc.campaigns = Campaign.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      // then call the flows...
      var flows = Flow.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      // wait until they're both ready to go...
      $q.all([
          cc.campaigns.$promise,
          flows.$promise
        ])
        .then(function () {
          // get rid of all of the flows that don't belong to this tenant...
          _.remove(flows, function (flow) {
            return flow.tenantId !== Session.tenant.tenantId;
          });

          getFlowName(cc.campaigns, flows);

          // now, finally grant the page access to the list of flows...
          cc.flows = flows;
        });

      // apply the table configuration
      cc.tableConfig = campaignsTableConfig;

      // check to make sure that the campaign has at least one version,
      // which means that it is also a valid campaign that can actually be started
      function hasVersion() {
        cc.selectedCampaign.hasVersion = angular.isDefined(cc.selectedCampaign.latestVersion);
      }

      function hasOne (arr) {
        if(angular.isDefined(arr)) {
          if (arr.length > 0) {
            return true;
          } else {
            return false;
          }
        }
      }

      function getJobData () {
        var jobList = CampaignCallListJobs.cachedGet({
          tenantId: Session.tenant.tenantId,
          campaignId: cc.selectedCampaign.id
        });

        jobList.$promise.then(function () {
          cc.loading = true;
          cc.selectedCampaign.hasCallList = hasOne(jobList.jobs);
          if (cc.selectedCampaign.hasCallList) {
            var latestJobId = jobList.jobs[0];

            var lastJobData = CampaignCallListJobs.cachedGet({
              tenantId: Session.tenant.tenantId,
              campaignId: cc.selectedCampaign.id,
              jobId: latestJobId
            });

            lastJobData.$promise.then(function (response) {
              cc.selectedCampaign.latestJobData = response;
            });
          }
        });
      }

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
        currentlySelectedCampaign = cc.selectedCampaign;

        if (currentlySelectedCampaign) {
          hasVersion();

          // get the jobs and download lists...
          // unless, of course, it's a new campaign and neither exist
          if (!cc.selectedCampaign.isNew()) {
            getJobData();
          }
        }
      });

      cc.updateActive = function() {
        var campaignCopy = new Campaign({
          id: cc.selectedCampaign.id,
          tenantId: Session.tenant.tenantId,
          active: !cc.selectedCampaign.active,
          name: cc.selectedCampaign.name,
          description: cc.selectedCampaign.description
        });

        return campaignCopy.save(function(result){
          cc.selectedCampaign.$original.active = result.active;
        });
      };

      cc.importContactList = function (fileData) {
        if (fileData) {
          var upload = Upload.upload({
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/campaigns/' + cc.selectedCampaign.id + '/call-list',
            method: 'POST',
            file: fileData
          });

          upload.then(function () {
            $timeout(function () {
              getJobData ();
            });
          });

          return upload;
        }
      };

      cc.openStatsModal = function () {
        var newScope = $scope.$new();
        newScope.modalBody = 'app/components/configuration/campaigns/stats.modal.html';
        newScope.title = 'Stats';

        newScope.cancelCallback = function () {
          $scope.showDispoDNC = false;
          $document.find('modal').remove();
        };

        var element = $compile('<modal></modal>')(newScope);
        $document.find('html > body').append(element);
      };

      cc.downloadCallList = function (campaignId) {
        CampaignCallListDownload.download(campaignId, Session);
      };

      cc.confirmSubmit = function() {
        if(angular.isDefined(cc.selectedCampaign.$original) && !cc.selectedCampaign.$original.shared) {
          return Modal.showConfirm({
            message: $translate.instant('disposition.details.shared.confirm'),
            okCallback: cc.submit
          });
        }
        cc.submit();
      };

      cc.submit = function () {
        return cc.selectedCampaign.save({
          tenantId: Session.tenant.tenantId
        }, function (response) {
          Alert.success($translate.instant('value.saveSuccess'));
          cc.duplicateError = false;
        }, function (err) {
          Alert.error($translate.instant('value.saveFail'));
          if (err.data.error.attribute.name) {
            cc.duplicateError = true;
            cc.duplicateErrorMessage = err.data.error.attribute.name.capitalize();
          }
        })
        .then(function (response) {
          // once the campaign has been saved, re-evaluate for the presence of a version
          // so that we can properly enable or disable the start/stop toggle
          hasVersion();
          cc.selectedCampaign.hasCallList = hasOne(response.jobs);
        });
      };

      $scope.$watch(function() {
       return cc.selectedCampaign;
     }, function() {
       cc.duplicateError = false;
     });

      cc.editCampaignSettings = function (currentlySelectedCampaign) {
        $state.go('content.configuration.campaignSettings', {
          id: currentlySelectedCampaign.id
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        cc.create();
      });

      cc.create = function () {
        cc.selectedCampaign = new Campaign({
          tenantId: Session.tenant.tenantId,
          active: true
        });
      };

      cc.startStopCampaign = function () {
        switch (cc.selectedCampaign.currentState) {
        case 'stopped':
          return CampaignStart.save({
            tenantId: Session.tenant.tenantId,
            campaignId: cc.selectedCampaign.id
          });
        case 'started':
          return CampaignStop.save({
            tenantId: Session.tenant.tenantId,
            campaignId: cc.selectedCampaign.id
          });
        }
      };

    }
  ]);

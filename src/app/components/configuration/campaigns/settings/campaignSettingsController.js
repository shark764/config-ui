'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignSettingsController', [
    '$scope', '$rootScope', '$state', '$stateParams', '$translate', '$moment', '$q', '$document', '$compile', 'Session', 'Flow', 'Timezone', 'Campaign', 'CampaignVersion', 'Disposition', 'DispositionList', 'DirtyForms', 'loEvents', 'getCampaignId',
    function ($scope, $rootScope, $state, $stateParams, $translate, $moment, $q, $document, $compile, Session, Flow, Timezone, Campaign, CampaignVersion, Disposition, DispositionList, DirtyForms, loEvents, getCampaignId) {
      $scope.forms = {};
      $scope.showDispoDNC = false;
      // adding to the scope all of the data from the campaigns page
      var csc = this;
      var campaignSettings = Campaign.cachedGet({
        tenantId: Session.tenant.tenantId,
        id: getCampaignId
      });
      csc.expiryUnit = 'hr';

      function convertTimestampToFormVal(timestamp) {
        if (angular.isDefined(timestamp)) {
          return parseInt(timestamp.split(':').shift());
        } else {
          return 0;
        }
      }

      function convertDefaultExpiryToFormValue(settings) {
        settings.defaultLeadExpiration = convertTimestampToFormVal(settings.defaultLeadExpiration);
        if (settings.defaultLeadExpiration % 24 === 0) {
          settings.defaultLeadExpiration = settings.defaultLeadExpiration / 24;
          csc.expiryUnit = 'day';
        }
      }

      function addLeadingZeros (num) {
        if (num < 10) {
          return '0' + num;
        } else {
          return num;
        }
      }

      function convertToTimestamp(time) {
        var hours;

        if (time) {
          hours = addLeadingZeros(time)
        } else {
          hours = '00';
        }
        return hours + ':00:00';
      };

      function convertExpiryToTimestamp() {
        if (angular.isDefined(csc.versionSettings.defaultLeadExpiration)) {
          if (csc.expiryUnit === 'day') {
            csc.versionSettings.defaultLeadExpiration = csc.versionSettings.defaultLeadExpiration * 24;
          }
          csc.versionSettings.defaultLeadExpiration = convertToTimestamp(csc.versionSettings.defaultLeadExpiration);
        }
      };

      campaignSettings.$promise.then(function (response) {
        if (response.latestVersion) {
          csc.versionSettings = CampaignVersion.cachedGet({
            campaignId: response.id,
            tenantId: Session.tenant.tenantId,
            versionId: response.latestVersion
          });

          csc.versionSettings.$promise.then(function () {
            convertDefaultExpiryToFormValue(csc.versionSettings);
            csc.versionSettings.defaultLeadRetryInterval = convertTimestampToFormVal(csc.versionSettings.defaultLeadRetryInterval);
          });
        } else {
          csc.versionSettings = new CampaignVersion({
            tenantId: Session.tenant.tenantId
          });

          csc.versionSettings.defaultLeadRetryInterval = 0;
          csc.versionSettings.defaultLeadExpiration = 0;
        };
      });

      // csc.versionSettings = csc.campaignSettings.latestVersion ? CampaignVersion.cachedGet({
      //   campaignId: csc.campaignSettings.id,
      //   tenantId: Session.tenant.tenantId,
      //   versionId: csc.campaignSettings.latestVersion }) : new CampaignVersion();



      // TODO: Centralize this
      csc.fetchFlows = function () {
        csc.flows = Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        _.remove(csc.flows, function (flow) {
          return flow.tenantId !== Session.tenant.tenantId;
        });

        return csc.flows;
      };

      csc.fetchDispositions = function () {
        var dispositions = Disposition.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        //console.log("dispositions: ", dispositions);
        return dispositions;
      };

      csc.currentDispositionName = [];

      csc.fetchDispositionList = function () {

        var dispositionLists = DispositionList.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        $q.when(dispositionLists).then(function () {
          csc.dispositionLists = dispositionLists;
        });

      };

      csc.loadTimezones = function () {
        csc.timezones = Timezone.query();
      };


      csc.cancel = function () {
        $state.go('content.configuration.campaigns');
      };

      csc.fetchDisposMappings = function () {

        var dispositionMappings = DispositionMappings.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        //console.log("fetchDisposMappings():", dispositionMappings);
        return dispositionMappings;
      };

      csc.changeDispoMap = function (value) {

        if (value === 'dnc') {
          $scope.showDispoDNC = true;
        } else {
          $scope.showDispoDNC = false;
        }
      };

      csc.gotoDispoMap = function (dispoId) {
        var dispositionMap = csc.versionSettings.dispositionMappings;
        var newScope = $scope.$new();

        var currentDispositionList = DispositionList.cachedGet({
          tenantId: Session.tenant.tenantId,
          id: dispoId
        });

        $q.when(currentDispositionList).then(function () {
          csc.currentDispositionList = currentDispositionList.dispositions;
        });

        newScope.modalBody = 'app/components/configuration/campaigns/settings/dispoMapping.modal.html';
        newScope.title = 'Disposition Mapping';

        newScope.cancelCallback = function () {
          $document.find('modal').remove();
        };

        newScope.okCallback = function (draft) {
          // var newFlow = new FlowDraft({
          //   flowId: version.flowId,
          //   flow: version.flow,
          //   tenantId: Session.tenant.tenantId,
          //   name: draft.name,
          //   metadata: version.metadata
          // });
        };

        var element = $compile('<modal></modal>')(newScope);
        $document.find('html > body').append(element);

      };

      csc.cancelDispoDnc = function () {
        $scope.showDispoDNC = false;
      }

      $scope.dncLists = [];

      csc.addDNC = function (newDncList) {

        $scope.dncLists.push({
          item: newDncList
        });
        console.log("dncLists: ", $scope.dncLists);

      };

      csc.removeDNC = function ($index) {

        $scope.dncLists.splice($index, 1);

      }



      $scope.days = {};

      csc.daySelected = function (value) {
        console.log(value);
      }

      csc.updateCampaign = function () {

      };

      csc.submit = function () {
        convertExpiryToTimestamp();
        csc.versionSettings.defaultLeadRetryInterval = convertToTimestamp(csc.versionSettings.defaultLeadRetryInterval);
        // Deleting id and created so that we can force the API to create a new version,
        // since versions are not to be editable
        delete csc.versionSettings.id;
        delete csc.versionSettings.created;
        csc.versionSettings.schedule[0].startTime = '12:00:00';
        csc.versionSettings.schedule[0].startTime = '01:00:00';
        csc.versionSettings.doNotContactLists = ["1869a2c0-db74-4230-9f42-0265205fae73"];
        csc.versionSettings.dispositionCodeListId = "1869a2c0-db74-4230-9f42-0265205fae73";
        console.log('csc.versionSettings', csc.versionSettings);

        csc.versionSettings.save({
          tenantId: Session.tenant.tenantId,
          campaignId: getCampaignId
        }).then(function () {
          $state.go('content.configuration.campaigns');
        });
      }



      csc.fetchDispositionList();
      csc.loadTimezones();
      csc.fetchFlows();

    }
  ]);

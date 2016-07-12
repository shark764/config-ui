'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignSettingsController', [
    '$scope', '$rootScope', '$state', '$translate', '$moment', '$q', 'Session', 'Flow', 'Timezone', 'Campaign', 'CampaignVersion', 'Disposition', 'DirtyForms', 'loEvents', 'getCampaignData',
    function ($scope, $rootScope, $state, $translate, $moment, $q, Session, Flow, Timezone, Campaign, CampaignVersion, Disposition, DirtyForms, loEvents, getCampaignData) {

      // adding to the scope all of the data from the campaigns page
      var csc = this;
      //csc.campaignSettings = getCampaignData;
      getCampaignData.tenantId = Session.tenant.tenantId;

      csc.versionSettings = new CampaignVersion();

      // START MOCK DATA ......
      csc.versionSettings.channel = "voice";
      csc.versionSettings.defaultTimeZone = "America/Moncton";
      csc.versionSettings.doNotContactLists = ["d0fabe1f-f134-4e0e-aa0e-e5cd5531d6ed", "09fbaefb-b2eb-489e-8daa-21d83a48f88e"];
      csc.versionSettings.dispositionCodeListId = "5a36616f-a080-439e-84e0-633379f9e5f8";
      csc.versionSettings.dispositionMappings = {
        "9f67ecc7-145e-4bea-b5f8-98d1c286522f": {
          action: "retry",
          interval: "03:00:00"
        },
        "d17a44da-7667-4d44-9199-cf148017cc79": {
          action: "dnc",
          listIds: [
            "25a9941a-1914-4d13-99a2-7a72e98b3ae6",
            "c8858199-05d3-452f-9a87-4f7a23a24324"
          ]
        }
      };
      csc.versionSettings.schedule = [{
        startTime: "00:00:00",
        endTime: "12:00:00",
        date: "2016-02-02",
        filter: {
          province: [
            "NS",
            "NB",
            "BC",
            "AB"
          ]
        },
        blackout: true
      }, {
        startTime: "12:00:00",
        endTime: "18:00:00",
        day: "M",
        blackout: false
      }];
      // END MOCK DATA ......

      // TODO: Centralize this
      csc.fetchFlows = function () {
        var flows = Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        _.remove(flows, function (flow) {
          return flow.tenantId !== Session.tenant.tenantId;
        });

        return flows;
      };

      csc.fetchDispositions = function () {
        var dispositions = Disposition.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        _.remove(dispositions, function (disposition) {
          return disposition.tenantId !== Session.tenant.tenantId;
        });

        return dispositions;
      };

      csc.loadTimezones = function () {
        csc.timezones = Timezone.query();
      };

      csc.updateCampaign = function () {};

      csc.cancel = function () {
        $state.go('content.configuration.campaigns');
      };

      csc.defaultExpiry = function () {

      };

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
        console.log('csc.versionSettings', csc.versionSettings);
        // Deleting id and created so that we can force the API to create a new version,
        // since versions are not to be editable
        delete csc.versionSettings.id;
        delete csc.versionSettings.created;
        csc.versionSettings.save({
          tenantId: Session.tenant.tenantId,
          campaignId:  getCampaignData.id
        }).then(function () {
          $state.go('content.configuration.campaigns');
        });


      }

      csc.fetchDispositions();
      csc.loadTimezones();
    }
  ]);
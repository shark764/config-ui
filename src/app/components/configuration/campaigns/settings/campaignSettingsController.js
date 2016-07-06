'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignSettingsController', [
    '$scope', '$rootScope', '$state', '$translate', '$moment', '$q', 'Session', 'Flow', 'Timezone', 'Campaign', 'CampaignVersion', 'Disposition', 'DirtyForms', 'loEvents', 'getCampaignData',
    function ($scope, $rootScope, $state, $translate, $moment, $q, Session, Flow, Timezone, Campaign, CampaignVersion, Disposition, DirtyForms, loEvents, getCampaignData) {

      var testVersion = new CampaignVersion({
        channel: "voice",
        flowId: "642b4e7f-6f7a-401f-bcc5-9528ee8d93bb",
        defaultTimeZone: "America/Moncton",
        doNotCallLists: [
          "d0fabe1f - f134 - 4e0 e - aa0e - e5cd5531d6ed ",
          "09 fbaefb - b2eb - 489e-8 daa - 21 d83a48f88e "
        ],
        callerId: "+442071838750",
        defaultLeadExpiration: "72:00:00",
        defaultLeadRetryInterval: "00:03:00",
        defaultLeadMaxRetries: 4,
        dispositionCodeListId: "5a36616f-a080-439e-84e0-633379f9e5f8",
        dispositionMappings: {
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
        },
        schedule: [{
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
        }]
      });




      // adding to the scope all of the data from the campaigns page
      var csc = this;
      //csc.campaignSettings = getCampaignData;
      getCampaignData.tenantId = Session.tenant.tenantId;

      var newCampaign = new Campaign({
        name: getCampaignData.name,
        description: getCampaignData.description
      });

      csc.versionSettings = new CampaignVersion(getCampaignData);

      // START MOCK DATA ......
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
        return newCampaign.save({
          tenantId: Session.tenant.tenantId
        })
        .then(function (response) {
            console.log('response from save', response);
            csc.versionSettings.save({
              tenantId: Session.tenant.tenantId,
              campaignId:  response.id
            }).then(function (response) {
              console.log('it worked:', response);
            });
          });

      }

      csc.fetchDispositions();
      csc.loadTimezones();
    }
  ]);
'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignSettingsController', [
    '$scope', '$rootScope', '$state', '$translate', '$moment', '$q', 'Session', 'Flow', 'Timezone', 'Campaign', 'CampaignVersion', 'Disposition', 'DirtyForms', 'loEvents', 'getCampaignData',
    function ($scope, $rootScope, $state, $translate, $moment, $q, Session, Flow, Timezone, Campaign, CampaignVersion, Disposition, DirtyForms, loEvents, getCampaignData) {

      $scope.forms = {};

      // adding to the scope all of the data from the campaigns page
      var csc = this;
      csc.campaignSettings = getCampaignData;
      csc.campaignSettings.tenantId = Session.tenant.tenantId;
      csc.expiryUnit = 'hr';

      csc.versionSettings = csc.campaignSettings.latestVersion ? CampaignVersion.cachedGet({
        campaignId: csc.campaignSettings.id,
        tenantId: Session.tenant.tenantId,
        versionId: csc.campaignSettings.latestVersion }) : new CampaignVersion();

      if (angular.isDefined(csc.versionSettings.$promise)) {
        csc.versionSettings.$promise.then(function(settings) {
          settings.defaultLeadExpiration = settings.defaultLeadExpiration.split(':').shift();
          if (settings.defaultLeadExpiration % 24 === 0) {
            settings.defaultLeadExpiration = settings.defaultLeadExpiration / 24;
            csc.expiryUnit = 'day';
          }
        });
      }

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
        convertExpiryToTimestamp();
        // Deleting id and created so that we can force the API to create a new version,
        // since versions are not to be editable
        delete csc.versionSettings.id;
        delete csc.versionSettings.created;
        csc.versionSettings.doNotContactLists = ["1869a2c0-db74-4230-9f42-0265205fae73"];
        csc.versionSettings.dispositionCodeListId = "1869a2c0-db74-4230-9f42-0265205fae73";
        csc.versionSettings.save({
          tenantId: Session.tenant.tenantId,
          campaignId:  getCampaignData.id
        }).then(function () {
          $state.go('content.configuration.campaigns');
        });
      }

      var convertExpiryToTimestamp = function() {
        if (csc.expiryUnit === 'day') {
          csc.versionSettings.defaultLeadExpiration = csc.versionSettings.defaultLeadExpiration * 24;
        }
        csc.versionSettings.defaultLeadExpiration = csc.versionSettings.defaultLeadExpiration + ":00:00";
      };

      csc.fetchDispositions();
      csc.loadTimezones();
      csc.fetchFlows();

    }]);

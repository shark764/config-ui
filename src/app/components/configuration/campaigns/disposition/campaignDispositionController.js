'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignDispositionController', [
    '$scope', '$rootScope', '$translate', '$moment', '$q', '$state', 'Session', 'Flow', 'Timezone', 'Campaign', 'CampaignDispositon','Disposition', 'DispositionList', 'DirtyForms', 'loEvents',
    function ($scope, $rootScope, $translate, $moment, $q, $state, Session, Flow, Timezone, Campaign,  CampaignDispositon, Disposition, DispositionList, DirtyForms, loEvents) {

      var cdc = this,
      currentDisposition;

      cdc.init = function(){
        var dispositionLists = DispositionList.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        console.log("init(): ", dispositionLists);
      }

      cdc.fetchDispositionList = function(){
        var dispositionLists = DispositionList.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        _.remove(dispositionLists, function(dispositionList){
          return dispositionList.tenantId !== Session.tenant.tenantId;
        });

        console.log("dispositionLists: ", dispositionLists);
      };


      cdc.fetchDispositions = function(){
        var dispositions = Disposition.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        _.remove(dispositions, function(disposition){
          return disposition.tenantId !== Session.tenant.tenantId;
        });

        console.log('dispositions: ', dispositions);
        return dispositions;
      };

      cdc.init();
      cdc.fetchDispositions();

    }
]);

'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignDispositionController', [
    '$scope', '$rootScope', '$translate', '$moment', '$q', '$state', 'Session', 'Flow', 'Timezone', 'Campaign', 'CampaignDispositon','Disposition', 'DispositionList', 'DirtyForms', 'loEvents',
    function ($scope, $rootScope, $translate, $moment, $q, $state, Session, Flow, Timezone, Campaign, CampaignDispositon, DispositionList, Disposition, DirtyForms, loEvents) {

      var cdc = this,
      currentDisposition;

      cdc.init = function(){
        currentDisposition = $state.params.id;

        console.log("currentDisposition: ", currentDisposition);
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

      // cdc.fetchDispositionList = function(){
      //    var dispositionLists = DispositionList.cachedQuery({
      //      tenantId: Session.tenant.tenatId
      //    });
      //
      //   //  _.remove(dispositionLists, function(dispositionLists){
      //   //    return dispositionLists.tenantId !== Session.tenant.tenantId;
      //   //  });
      //    console.log("DL: ", dispositionLists);
      //    return dispositionLists;
      // };

      cdc.init();
      cdc.fetchDispositions();
      //cdc.fetchDispositionList();

    }
]);

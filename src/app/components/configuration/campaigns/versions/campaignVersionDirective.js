'use strict';

angular.module('liveopsConfigPanel')
  .directive('campaignVersions', [function() {
    return {
      scope: {
        campaign: '=',
        onEditClick: '&'
      },
      templateUrl: 'app/components/configuration/campaigns/versions/campaignVersions.html',
      controller: 'CampaignVersionsController'
    };
  }]);

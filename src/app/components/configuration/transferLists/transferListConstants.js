'use strict';

angular.module('liveopsConfigPanel')
  .factory('transferTypes', ['$translate', function($translate) {
    return [
      {
        label: $translate.instant('transferLists.contact.details.external'),
        value: 'external'
      },
      {
        label: $translate.instant('transferLists.contact.details.internal'),
        value: 'internal'
      }
    ];
  }])
  .factory('contactTypes', ['$translate', function($translate) {
    return [
      {
        label: $translate.instant('transferLists.contact.details.PSTN'),
        value: 'PSTN'
      },

      {
        label: $translate.instant('transferLists.contact.details.SIP'),
        value: 'SIP'
      },
      // commenting this one out as it doesn't work yet
      // {
      //   label: $translate.instant('transferLists.contact.details.WebRTC'),
      //   value: 'WebRTC'
      // },
      {
        label: $translate.instant('transferLists.contact.details.queue'),
        value: 'queue'
      }
    ];
  }]);

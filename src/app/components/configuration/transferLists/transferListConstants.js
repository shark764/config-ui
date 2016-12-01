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

      // commenting these two out as they don't work yet, but
      // eventually will, so I don't want to delete them altogether
      // {
      //   label: $translate.instant('transferLists.contact.details.SIP'),
      //   value: 'SIP'
      // },
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

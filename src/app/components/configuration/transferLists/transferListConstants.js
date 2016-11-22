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
      },
      {
        label: $translate.instant('transferLists.contact.details.coldTransfer'),
        value: 'internal'
      },
      {
        label: $translate.instant('transferLists.contact.details.warmTransfer'),
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
      {
        label: $translate.instant('transferLists.contact.details.WebRTC'),
        value: 'WebRTC'
      },
      {
        label: $translate.instant('transferLists.contact.details.queue'),
        value: 'queue'
      },
      {
        label: $translate.instant('transferLists.contact.details.flow'),
        value: 'flow'
      },
      {
        label: $translate.instant('transferLists.contact.details.email'),
        value: 'email'
      }
    ];
  }]);

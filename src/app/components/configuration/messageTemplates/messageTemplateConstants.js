'use strict';

angular.module('liveopsConfigPanel')
  .factory('templateTypes', ['$translate', function($translate) {
    return [
      {
        label: $translate.instant('messageTemplates.details.templateTypes.plaintext'),
        value: 'plaintext'
      }
    ];
  }])
  .factory('channelTypes', ['$translate', function($translate) {
    return [
      {
        label: $translate.instant('value.sms'),
        value: 'sms'
      },
      {
        label: $translate.instant('value.messaging'),
        value: 'messaging'
      }
      // {
      //   label: $translate.instant('value.email'),
      //   value: 'email'
      // },
    ];
  }]);

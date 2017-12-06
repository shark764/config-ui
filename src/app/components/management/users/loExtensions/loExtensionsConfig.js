'use strict';

angular.module('liveopsConfigPanel')
  .service('loExtensionProviders', ['$translate', function ($translate) {
    return [{
      value: 'twilio',
      display: $translate.instant('twilio')
    }
    // PLIVO IS ON CODE FREEZE, SO HIDING BUT NOT DELETING YET
    // , {
    //   value: 'plivo',
    //   display: $translate.instant('plivo')
    // }
    ];
  }])
  .service('loExtensionTypes', ['$translate', function ($translate) {
    return [{
      value: 'webrtc',
      display: $translate.instant('webrtc')
    }, {
      value: 'pstn',
      display: $translate.instant('pstn')
    }, {
      value: 'sip',
      display: $translate.instant('sip')
    }];
  }]);

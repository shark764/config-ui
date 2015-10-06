'use strict';

angular.module('liveopsConfigPanel')
  .service('loExtensionProviders', [function () {
    return [{
      value: 'twilio',
      display: 'Twilio'
    }, {
      value: 'pilvo',
      display: 'Pilvo'
    }]
  }])
  .service('loExtensionTypes', [function () {
    return [{
      value: 'webRtc',
      display: 'WebRtc'
    }, {
      value: 'pstn',
      display: 'PSTN'
    }, {
      value: 'sip',
      display: 'SIP'
    }]
  }]);
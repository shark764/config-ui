'use strict';

angular.module('liveopsConfigPanel')
  .service('loExtensionProviders', ['$filter', function ($filter) {
    return [{
      value: 'twilio',
      display: $filter('translate')('twilio')
    }, {
      value: 'plivo',
      display: $filter('translate')('plivo')
    }];
  }])
  .service('loExtensionTypes', ['$filter', function ($filter) {
    return [{
      value: 'webrtc',
      display: $filter('translate')('webrtc')
    }, {
      value: 'pstn',
      display: $filter('translate')('pstn')
    }, {
      value: 'sip',
      display: $filter('translate')('sip')
    }];
  }]);
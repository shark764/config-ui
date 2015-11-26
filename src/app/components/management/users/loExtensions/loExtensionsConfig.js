'use strict';

angular.module('liveopsConfigPanel')
  .service('loExtensionProviders', ['$filter', function ($filter) {
    return [{
      value: 'twilio',
      display: $filter('translate')('twilio')
    }, {
      value: 'pilvo',
      display: $filter('translate')('pilvo')
    }];
  }])
  .service('loExtensionTypes', ['$filter', function ($filter) {
    return [{
      value: 'webrtc',
      display: $filter('translate')('webrtc')
    }, {
      value: 'pstn',
      display: $filter('translate')('pstn')
    }];
  }]);
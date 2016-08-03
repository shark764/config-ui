'use strict';

angular.module('liveopsConfigPanel')
  .service('loExtensionProviders', ['$translate', function ($translate) {
    return [{
      value: 'twilio',
      display: $translate.instant('twilio')
    }, {
      value: 'plivo',
      display: $translate.instant('plivo')
    }];
  }])
  .service('twilioRegions', ['$translate', function ($translate) {
    return [{
      value: 'default',
      display: $translate.instant('twilioRegion.tenantDefault')
    }, {
      value: 'au1',
      display: $translate.instant('twilioRegion.australia')
          }, {
      value: 'br1',
      display: $translate.instant('twilioRegion.brazil')
    }, {
      value: 'ie1',
      display: $translate.instant('twilioRegion.ireland')
    }, {
      value: 'jp1',
      display: $translate.instant('twilioRegion.japan')
    }, {
      value: 'sg1',
      display: $translate.instant('twilioRegion.singapore')
    }, {
      value: 'us1',
      display: $translate.instant('twilioRegion.usEastCoast')
    }, {
      value: 'gll',
      display: $translate.instant('twilioRegion.lowestLatency')
    }]
  }])
  .service('loExtensionTypes', ['$translate', function ($translate) {
    return [{
      value: 'webrtc',
      display: $translate.instant('webrtc')
    }, {
      value: 'pstn',
      display: $translate.instant('pstn')
    }]; //,{
    //   value: 'sip',
    //   display: $translate.instant('sip')
    // }];
  }]);

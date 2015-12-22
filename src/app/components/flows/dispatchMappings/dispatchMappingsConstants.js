'use strict';

angular.module('liveopsConfigPanel.config')
  .service('dispatchMappingChannelTypes', ['$translate', function($translate){
    return [{
      display: $translate.instant('value.voice'),
      value: 'voice'
    }];
  }])
  .service('dispatchMappingInteractionFields', ['$translate', function($translate) {
    return [{
      display: $translate.instant('value.customer'),
      value: 'customer'
    }, {
      display: $translate.instant('value.contact.point'),
      value: 'contact-point'
    }, {
      display: $translate.instant('integration.details'),
      value: 'source'
    }, {
      display: $translate.instant('value.direction'),
      value: 'direction'
    }];
  }]) 
  .service('dispatchMappingDirections', [ '$translate', function($translate) {
    return [{
      display: $translate.instant('dispatchMappings.inbound'),
      value: 'inbound'
    },
    {
      display: $translate.instant('dispatchMappings.outbound'),
      value: 'outbound'
    }];
  }]);

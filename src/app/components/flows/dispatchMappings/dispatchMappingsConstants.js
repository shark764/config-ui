'use strict';

angular.module('liveopsConfigPanel.config')
  .constant('dispatchMappingChannelTypes', [{
    display: 'Voice',
    value: 'voice'
  }])
  .constant('dispatchMappingInteractionFields', [{
    display: 'Customer',
    value: 'customer'
  }, {
    display: 'Contact Point',
    value: 'contact-point'
  }, {
    display: 'Integration',
    value: 'source'
  }, {
    display: 'Direction',
    value: 'direction'
  }])
  .service('dispatchMappingDirections', ['$translate', function($translate) {
    return [{
      display: $translate.instant('dispatchMappings.inbound'),
      value: 'inbound'
    }, {
      display: $translate.instant('dispatchMappings.outbound'),
      value: 'outbound'
    }];
  }]);

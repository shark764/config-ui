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
    value: 'integration'
  }, {
    display: 'Direction',
    value: 'direction'
  }])
  .constant('dispatchMappingDirections', [{
    display: 'Outbound',
    value: 'outbound'
  }]);

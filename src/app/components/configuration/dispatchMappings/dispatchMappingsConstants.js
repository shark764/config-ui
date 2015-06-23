'use strict';

angular.module('liveopsConfigPanel.config')
  .constant('dispatchMappingChannelTypes', [{
    display: 'Any',
    value: 'any'
  }, {
    display: 'Voice',
    value: 'voice'
  }, {
    display: 'Email',
    value: 'email'
  }, {
    display: 'SMS',
    value: 'sms'
  }, {
    display: 'Chat',
    value: 'chat'
  }, {
    display: 'Facebook',
    value: 'facebook'
  }, {
    display: 'Twitter',
    value: 'twitter'
  }, {
    display: 'etc',
    value: 'etc'
  }])
  .constant('dispatchMappingInteractionFields', [{
    display: 'Customer',
    value: 'customer'
  }, {
    display: 'Contact Point',
    value: 'contact-poing'
  }, {
    display: 'Integration',
    value: 'integration'
  }, {
    display: 'Direction',
    value: 'direction'
  }]);

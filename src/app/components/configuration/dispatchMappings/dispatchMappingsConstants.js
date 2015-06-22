'use strict';

angular.module('liveopsConfigPanel.config')
  .constant('dispatchMappingInteractionTypes', [{
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
  }])
  .constant('dispatchMappingChannelTypes', [{
    display: 'Contact Point',
    value: 'contactPoint'
  }]);
  
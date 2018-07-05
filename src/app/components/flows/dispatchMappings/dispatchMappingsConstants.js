'use strict';

angular.module('liveopsConfigPanel.config')
  .service('dispatchMappingChannelTypes', ['$translate', function($translate){
    return [
      {
        display: $translate.instant('value.voice'),
        value: 'voice'
      },
      {
        display: $translate.instant('value.sms'),
        value: 'sms'
      },
      {
        display: $translate.instant('value.email'),
        value: 'email'
      },
      {
        display: $translate.instant('value.messaging'),
        value: 'messaging'
      },
      {
        display: $translate.instant('value.workItem'),
        value: 'work-item'
      },
      {
        display: $translate.instant('value.any'),
        value: 'any'
      }
    ];
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
    }, {
      display: $translate.instant('dispatchMappings.outbound'),
      value: 'outbound'
    }, {
      display: $translate.instant('dispatchMappings.agentInitiated'),
      value: 'agent-initiated'
    }];
  }]);

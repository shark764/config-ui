'use strict';

angular.module('liveopsConfigPanel')
  .filter('telephony', function () {
    return function(input) {
      return input.filter(function(item) {
        return item.type === 'twilio' || item.type === 'plivo';
      });
    };
  });

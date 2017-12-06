'use strict';

angular.module('liveopsConfigPanel')
  .filter('telephony', function () {
    return function(input) {
      return input.filter(function(item) {
        // removing 'plivo' from this list for now since there is a code freeze
        // on that integration
        return item.active &&
          (
            (item.type === 'twilio' && item.properties.webRtc) ||
            item.type === 'serenova-voice'
          );
      });
    };
  });

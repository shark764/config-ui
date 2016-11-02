'use strict';

angular.module('liveopsConfigPanel')
  .filter('convertToTimezone', function ($moment) {
    // uses the data format for moment.js, and NOT the Angular format
    // see moment.js display format at http://momentjs.com/docs/#/displaying/
    return function(input, tenantTimezone, dateFormat) {
      if (!tenantTimezone) {
        return $moment(input).format(dateFormat);
      } else {
        return $moment(input).tz(tenantTimezone).format(dateFormat);
      }
    };
  });

'use strict';

angular.module('liveopsConfigPanel')
  .factory('flowTypes', ['$translate', function($translate) {
    return [{
      display: $translate.instant('flow.type.customer'),
      value: 'customer'
    }, {
      display: $translate.instant('flow.type.resource'),
      value: 'resource'
    }, {
      display: $translate.instant('flow.type.reusable'),
      value: 'reusable'
    }];
  }]);

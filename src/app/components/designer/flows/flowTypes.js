'use strict';

angular.module('liveopsConfigPanel')
  .constant('flowTypes', [{
    display: 'Customer',
    value: 'customer'
  }, {
    display: 'Resource',
    value: 'resource'
  }, {
    display: 'Reusable',
    value: 'reusable'
  }]);
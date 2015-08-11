'use strict';

angular.module('liveopsConfigPanel')
  .service('integrationTableConfig', ['statuses', '$translate', function (statuses, $translate) {
    return {
      'fields': [{
        'header': $translate.instant('value.type'),
        'name': 'type'
      }, {
        'header': $translate.instant('integration.table.account'),
        'name': 'properties.accountSid'
      }, {
        'header': $translate.instant('value.status'),
        'name': 'active',
        'sortable': true,
        'options': statuses(),
        'transclude': true,
        'filter': 'selectedOptions'
      }, {
        'header': $translate.instant('integration.table.webrtc'),
        'name': 'properties.webRtc',
        'sortable': true,
        'options': statuses(),
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['type'],
      'orderBy': 'type',
      'title' : $translate.instant('integration.table.title')
    };
  }]);

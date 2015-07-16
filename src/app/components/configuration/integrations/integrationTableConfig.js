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
        'name': 'status',
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
      'searchOn': ['name'],
      'orderBy': ['name'],
      'title' : $translate.instant('integration.table.title')
    };
  }]);

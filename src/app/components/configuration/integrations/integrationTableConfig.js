'use strict';

angular.module('liveopsConfigPanel')
  .service('integrationTableConfig', ['statuses', '$translate', function (statuses, $translate) {
    return {
      'fields': [{
        'header': {
          'display': $translate.instant('value.type')
        },
        'name': 'type'
      }, {
        'header': {
          'display': $translate.instant('integration.table.account')
        },
        'name': 'properties.accountSid'
      }, {
        'header': {
          'display': $translate.instant('value.status'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': 'active',
        'lookup': '$original:active',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }, {
        'header': {
          'display': $translate.instant('integration.table.webrtc'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': 'properties.webRtc',
        'lookup': '$original:properties:webRtc',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['type'],
      'orderBy': 'type',
      'title' : $translate.instant('integration.table.title')
    };
  }]);

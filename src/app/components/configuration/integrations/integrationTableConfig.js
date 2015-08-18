'use strict';

angular.module('liveopsConfigPanel')
  .service('integrationTableConfig', ['statuses', '$translate', function (statuses, $translate) {
    return {
      'fields': [{
        'header': {
          'display': $translate.instant('value.type')
        },
        'name': '$original.type'
      }, {
        'header': {
          'display': $translate.instant('integration.table.account')
        },
        'name': '$original.properties.accountSid'
      }, {
        'header': {
          'display': $translate.instant('value.status'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': '$original.active',
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
        'name': '$original.properties.webRtc',
        'lookup': '$original:properties:webRtc',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['$original.type'],
      'orderBy': '$original.type',
      'title' : $translate.instant('integration.table.title')
    };
  }]);

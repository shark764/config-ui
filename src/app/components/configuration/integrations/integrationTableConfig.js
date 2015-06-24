'use strict';

angular.module('liveopsConfigPanel')
  .service('integrationTableConfig', ['statuses', function (statuses) {
    return {
      'fields': [{
        'header': 'Type',
        'name': 'type'
      }, {
        'header': 'Account',
        'name': 'properties.accountSid'
      }, {
        'header': 'Status',
        'name': 'status',
        'sortable': true,
        'options': statuses(),
        'templateUrl': 'app/shared/templates/statuses.html',
        'filter': 'selectedOptions'
      }, {
        'header': 'WebRTC',
        'name': 'properties.webRtc',
        'sortable': true,
        'options': statuses(),
        'templateUrl': 'app/components/configuration/integrations/templates/webrtc.html',
        'filter': 'selectedOptions'
      }],
      'searchOn': ['name'],
      'orderBy': ['name'],
      'title' : 'Integration Management'
    };
  }]);

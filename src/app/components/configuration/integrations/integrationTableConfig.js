'use strict';

angular.module('liveopsConfigPanel')
  .service('integrationTableConfig', ['statuses', function (statuses) {
    return {
      'fields': [{
        'header': 'Account',
        'name': 'properties.accountSid'
      }, {
        'header': 'Secret',
        'name': 'properties.authToken'
      }, {
        'header': 'Status',
        'name': 'status',
        'sortable': true,
        'options': statuses,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['name'],
      'orderBy': ['name'],
      'title' : 'Integration Management'
    };
  }]);

'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantTableConfig', ['statuses', function (statuses) {
    return {
      'fields': [{
        'header': 'ID',
        'name': 'id'
      }, {
        'header': 'Name',
        'name': 'name'
      }, {
        'header': 'Admin ID',
        'name': 'adminUserId'
      }, {
        'header': 'Status',
        'name': 'status',
        'sortable': true,
        'options': statuses,
        'templateUrl': 'app/shared/templates/statuses.html',
        'filter': 'selectedOptions'
      }],
      'searchOn': ['name'],
      'orderBy': ['name'],
      'title' : 'Tenant Management'
    };
  }]);

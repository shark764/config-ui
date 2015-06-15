'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantTableConfig', ['userStatuses', function (userStatuses) {
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
        'options': userStatuses,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['name'],
      'orderBy': ['name'],
      'title' : 'Tenant Management'
    };
  }]);

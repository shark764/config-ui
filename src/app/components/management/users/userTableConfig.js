'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['statuses',
    function(statuses) {
      return {
        'fields': [{
          'header': 'Name',
          'name': 'fullName',
          'templateUrl': 'app/components/management/users/userFullNameTemplate.html'
        }, {
          'header': 'Display Name',
          'name': 'displayName'
        }, {
          'header': 'Email',
          'name': 'email'
        }, {
          'header': 'ID',
          'name': 'externalId'
        }, {
          'header': 'Status',
          'name': 'status',
          'templateUrl': 'app/shared/templates/statuses.html',
          'checked': false,
          'options': statuses
        }],
        'searchOn': ['firstName', 'lastName', {
          path: 'skills',
          inner: {
            path: 'name'
          }
        }],
        'orderBy': ['lastName'],
        'title': 'User Management'
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['statuses', 'userStates',
    function(statuses, userStates) {
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
          'header': 'State',
          'name': 'state',
          'templateUrl': 'app/components/management/users/userStateTemplate.html',
          'checked': false,
          'options': userStates
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

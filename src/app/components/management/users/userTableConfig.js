'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['userStatuses', 'userStates',
    function(userStatuses, userStates) {
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
          'header': 'Telephone',
          'name': 'telephone'
        }, {
          'header': 'ID',
          'name': 'externalId'
        }, {
          'header': 'Status',
          'name': 'status',
          'templateUrl': 'app/components/management/users/userStatusTemplate.html',
          'options': userStatuses
        }, {
          'header': 'State',
          'name': 'state',
          'options': userStates,
          'templateUrl': 'app/components/management/users/userStateTemplate.html',
          'checked': false
        }],
        'searchOn' : ['firstName', 'lastName'],
        'orderBy' : ['lastName'],
        'title' : 'User Management'
      };
    }
  ])

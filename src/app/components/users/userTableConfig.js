'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['userStatuses', 'userStates',
    function (userStatuses, userStates) {
      return {
        'fields': [{
          'header': 'First Name',
          'name': 'firstName'
        }, {
          'header': 'Last Name',
          'name': 'lastName'
        }, {
          'header': 'Email',
          'name': 'email'
        }, {
          'header': 'Display Name',
          'name': 'displayName'
        }, {
          'header': 'Telephone',
          'name': 'telephone'
        }, {
          'header': 'Status',
          'name': 'status',
          'options': userStatuses
        }, {
          'header': 'State',
          'name': 'state',
          'options': userStates,
          'templateUrl': 'app/shared/templates/state.html',
          'checked': false
        }],
        'searchOn' : ['firstName', 'lastName'],
        'orderBy' : ['lastName']
      };
    }
  ])

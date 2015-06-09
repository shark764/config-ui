'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['userStatuses', 'userStates',
    function (userStatuses, userStates) {
      return {
        'fields': [{
          'header': 'Name',
          'name': 'displayName'
        }, {
          'header': 'ID',
          'name': 'id'
        }, {
          'header': 'Status',
          'name': 'status',
          'options': userStatuses,
          'filter': 'selectedOptions',
          'sortable': true
        }, {
          'header': 'State',
          'name': 'state',
          'sortable': true,
          'options': userStates,
          'filter': 'selectedOptions'
        }],
        'search': {
          'fields': ['firstName', 'lastName']
        }
      };
    }
  ])
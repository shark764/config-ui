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
          'options': userStatuses
        }, {
          'header': 'State',
          'name': 'state',
          'options': userStates,
          'templateUrl': 'app/shared/templates/state.html'
        }],
        'searchOn' : ['firstName', 'lastName'],
        'orderBy' : ['lastName']
      };
    }
  ])

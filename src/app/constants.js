'use strict';

angular.module('liveopsConfigPanel.config', [])

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('userStatuses', [{
  'display': 'Disabled',
  'value': false
}, {
  'display': 'Enabled',
  'value': true
}])

.constant('userStates', [{
  'display': 'Busy',
  'value': 'BUSY'
}, {
  'display': 'Logout',
  'value': 'LOGOUT'
}, {
  'display': 'Ready',
  'value': 'READY'
}, {
  'display': 'Login',
  'value': 'LOGIN'
}, {
  'display': 'Not Ready',
  'value': 'NOT_READY'
}, {
  'display': 'Wrap',
  'value': 'WRAP'
}])

.constant('userRoles', [{
  'value': 'admin',
  'display': 'Admin'
}, {
  'value': 'user',
  'display': 'User'
}, {
  'value': 'other',
  'display': 'Other'
}])


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
    'search': {
      'fields': ['name']
    }
  };
}])

;
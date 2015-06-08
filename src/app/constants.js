'use strict';

angular.module('liveopsConfigPanel.config', [])

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('userStatuses', {
  'id': 'userStatuses',
  'showAll': true,
  'options': [{
    'display': 'Disabled',
    'value': false
  }, {
    'display': 'Enabled',
    'value': true
  }]
})

.constant('userStates', {
  'id': 'userStates',
  'showAll': true,
  'options': [{
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
  }]
})

.constant('userRoles', [{
  'value': 'admin',
  'label': 'Admin'
}, {
  'value': 'user',
  'label': 'User'
}, {
  'value': 'other',
  'label': 'Other'
}])


.service('userTableConfig', ['userStatuses', 'userStates',
  function (userStatuses, userStates) {
    return {
      'fields': [{
        'header': 'Name',
        'name': 'displayName',
        'sortable': false
      }, {
        'header': 'ID',
        'name': 'id',
        'sortable': false
      }, {
        'header': 'Status',
        'name': 'status',
        'sortable': true,
        'options': userStatuses,
        'filter': 'selectedOptions'
      }, {
        'header': 'State',
        'name': 'state',
        'sortable': true,
        'options': userStates,
        'filter': 'selectedOptions'
      }],
      "search": {
        "fields": ['firstName', 'lastName']
      }
    };
  }
])

;
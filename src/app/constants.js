'use strict';

angular.module('liveopsConfigPanel.config', [])

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('userStatuses', {
  'all': {
    'display': 'All',
    'value': 'all',
    'checked': true
  },
  'filters': [{
    'display': 'Disabled',
    'value': false,
    'checked': false
  }, {
    'display': 'Enabled',
    'value': true,
    'checked': false
  }]
})

.constant('userStates', {
  'all': {
    'display': 'All',
    'value': 'all',
    'checked': true
  },
  'filters': [{
    'display': 'Busy',
    'value': 'BUSY',
    'checked': false
  }, {
    'display': 'Logout',
    'value': 'LOGOUT',
    'checked': false
  }, {
    'display': 'Ready',
    'value': 'READY',
    'checked': false
  }, {
    'display': 'Login',
    'value': 'LOGIN',
    'checked': false
  }, {
    'display': 'Not Ready',
    'value': 'NOT_READY',
    'checked': false
  }, {
    'display': 'Wrap',
    'value': 'WRAP',
    'checked': false
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

.constant('columns', {
  'filters': {
    'name': {
      'display': 'Name',
      'value': 'name',
      'checked': true
    },
    'id': {
      'display': 'ID',
      'value': 'id',
      'checked': true
    },
    'status': {
      'display': 'Status',
      'value': 'status',
      'checked': true
    },
    'state': {
      'display': 'State',
      'value': 'state',
      'checked': true
    }
  }
})

;

'use strict';

angular.module('liveopsConfigPanel.config', [])

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('uuidcacheKey', 'LIVEOPS-CACHE-KEY')

.factory('userStatuses', function() {
  return function(){
    return [{
      'display': 'Disabled',
      'value': 'disabled'
    }, {
      'display': 'Enabled',
      'value': 'enabled'
    }, {
      'display': 'Pending',
      'value': 'pending'
    }];
  };
})

.factory('statuses', function () {
  return function(){
    return [{
      'display': 'Disabled',
      'value': false
    }, {
      'display': 'Enabled',
      'value': true
    }];
  };
})

.constant('userStates', [{
  'display': 'Busy',
  'value': 'BUSY'
}, {
  'display': 'Ready',
  'value': 'READY'
}, {
  'display': 'Not-Ready',
  'value': 'NOT_READY'
}, {
  'display': 'Allocated',
  'value': 'ALLOCATED'
}, {
  'display': 'offline',
  'value': 'offline'
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

;

'use strict';

/*global window: false */

angular.module('liveopsConfigPanel.config', [])

.constant('jsedn', window.jsedn)

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('uuidcacheKey', 'LIVEOPS-CACHE-KEY')

.constant('_', _)

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
.factory('ynStatuses', function () {
  return function(){
    return [{
      'display': 'No',
      'value': false
    }, {
      'display': 'Yes',
      'value': true
    }];
  };
})
.factory('tenantStatuses', function() {
  return function(){
    return [{
      'display': 'Disabled',
      'value': 'disabled'
    }, {
      'display': 'Expired Invitation',
      'value': 'expired'
    }, {
      'display': 'Pending Invitation',
      'value': 'pending'
    }, {
      'display': 'Accepted',
      'value': 'accepted'
    }, {
      'display': 'Pending Acceptance',
      'value': 'invited'
    }];
  };
})

.constant('userStates', [{
  'display': 'Busy',
  'value': 'busy'
}, {
  'display': 'Ready',
  'value': 'ready'
}, {
  'display': 'Not Ready',
  'value': 'not-ready'
}, {
  'display': 'Allocated',
  'value': 'allocated'
}, {
  'display': 'Offline',
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

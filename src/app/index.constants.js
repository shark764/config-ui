'use strict';

angular.module('liveopsConfigPanel.config', [])

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('uuidcacheKey', 'LIVEOPS-CACHE-KEY')

.constant('_', _)

.factory('userStatuses', function() {
  return function() {
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

//Using displayKeys to fix TITAN2-6886: select boxes not repainting after translate filter runs
.factory('statuses', ['$translate', function($translate) {
  return function() {
    return [{
      'display': $translate.instant('value.disabled'),
      'displayKey': 'value.disabled',
      'value': false
    }, {
      'display': $translate.instant('value.enabled'),
      'displayKey': 'value.enabled',
      'value': true
    }];
  };
}])

.factory('ynStatuses', function() {
  return function() {
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
  return function() {
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
  'value': 'notready'
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

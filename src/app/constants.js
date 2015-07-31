'use strict';

angular.module('liveopsConfigPanel.config', [])

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('uuidcacheKey', 'LIVEOPS-CACHE-KEY')

.factory('statuses', function() {
  return function(){
    return [{
      'display': 'Disabled',
      'value': 'disabled'
    }, {
      'display': 'Enabled',
      'value': 'enabled'
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

;

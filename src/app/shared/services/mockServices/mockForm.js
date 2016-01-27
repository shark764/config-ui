'use strict';

angular.module('liveopsConfigPanel.mockutils', [])

.factory('mockForm', function() {
  return function() {
    return {
      $setPristine: jasmine.createSpy('$setPristine'),
      $setValidity: jasmine.createSpy('$setValidity'),
      $setUntouched: jasmine.createSpy('$setUntouched'),
      $setTouched: jasmine.createSpy('$setTouched'),
      $setDirty: jasmine.createSpy('$setDirty'),
      $dirty: false,
      $pristine: true,
      $touched: false,
      $error: {}
    };
  };
})

.factory('mockModel', function() {
  return function() {
    return {
      $setPristine: jasmine.createSpy('$setPristine'),
      $setValidity: jasmine.createSpy('$setValidity'),
      $setUntouched: jasmine.createSpy('$setUntouched'),
      $setTouched: jasmine.createSpy('$setTouched'),
      $setDirty: jasmine.createSpy('$setDirty'),
      $dirty: false,
      $pristine: true,
      $touched: false,
      $error: {}
    };
  };
});
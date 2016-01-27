'use strict';

angular.module('liveopsConfigPanel.mockutils', [])

.factory('mockForm', ['mockModel', function(mockModel) {
  return function(fieldList) {
    var form = {
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

    if (angular.isArray(fieldList)){
      angular.forEach(fieldList, function(fieldName){
        form[fieldName] = mockModel();
      });
    }

    return form;
  };
}])

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
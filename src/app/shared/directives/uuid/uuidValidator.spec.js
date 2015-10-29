'use strict';

describe('uuidValidator directive', function(){
  var $scope,
    element
    ;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    
    element = $compile('<input type="text" uuid ng-model="mymodel"/>')($scope);
    $scope.$digest();
  }]));

  it('should set a uuid validator on the ngModel controller', inject(function() {
    expect(element.controller('ngModel').$validators.uuid).toBeDefined();
  }));
  
  it('should consider an empty model to be valid', inject(function() {
    expect(element.controller('ngModel').$validators.uuid()).toBeTruthy();
  }));
  
  it('should return true if the view value is a valid UUID format', inject(function() {
    expect(element.controller('ngModel').$validators.uuid('457f4900-b017-45ea-b306-b2c9f3527439', '457f4900-b017-45ea-b306-b2c9f3527439')).toBeTruthy();
    expect(element.controller('ngModel').$validators.uuid('00000000-0000-1000-a000-000000000000', '00000000-0000-1000-a000-000000000000')).toBeTruthy();
    expect(element.controller('ngModel').$validators.uuid('AAAAAAAA-AAAA-1AAA-AAAA-AAAAAAAAAAAA', 'AAAAAAAA-AAAA-1AAA-AAAA-AAAAAAAAAAAA')).toBeTruthy();
    expect(element.controller('ngModel').$validators.uuid('aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa')).toBeTruthy();
  }));
  
  it('should return false if the view value is not a valid UUID format', inject(function() {
    expect(element.controller('ngModel').$validators.uuid('457f4900-b017-45ea-b306-b2c9f3527439', '')).toBeFalsy();
    expect(element.controller('ngModel').$validators.uuid('457f4900-b017-45ea-b306-b2c9f3527439', 'some stuff')).toBeFalsy();
    expect(element.controller('ngModel').$validators.uuid('457f4900-b017-45ea-b306-b2c9f3527439', 'AAAAAAAAAAAA1AAAAAAAAAAAAAAAAAAA')).toBeFalsy();
    expect(element.controller('ngModel').$validators.uuid('457f4900-b017-45ea-b306-b2c9f3527439', '1234567')).toBeFalsy();
  }));
});

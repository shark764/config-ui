'use strict';

/* global jasmine, spyOn: false  */

describe('editField', function(){
  var $scope,
    $compile;
    
  var objectId = '1c838030-f772-11e4-ac37-45b2e1245d4b';
  var ngModel = 'Ron';
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  
  beforeEach(inject(['$compile', '$rootScope', function (_$compile_, _$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }]));
  
  it('should emit event on saveHandler', inject(function() {
    $scope.objectId = objectId;
    $scope.value = ngModel;
    
    var element = $compile('<edit-field ng-model="value" name="name" object-id="objectId" default-text="Select role"></edit-field>')($scope);
    $scope.$digest();
    
    var childScope = element.isolateScope();
    spyOn(childScope, '$emit');
    
    expect(childScope.saveHandler).toBeDefined();
    childScope.saveHandler();
    
    expect(childScope.$emit).toHaveBeenCalledWith('editField:save', {
      objectId: objectId,
      fieldName: 'name',
      fieldValue: ngModel
    });
  }));
  
  it('should set edit to true on successful broadcast', inject(function() {
    $scope.objectId = objectId;
    $scope.value = ngModel;
    
    var element = $compile('<edit-field ng-model="value" name="name" object-id="objectId" default-text="Select role"></edit-field>')($scope);
    $scope.$digest();
    
    var childScope = element.isolateScope();
    var e = {foo: 'bar'};
    var response = {
      statusCode: 200
    };
    
    childScope.edit = true;
    $scope.$broadcast('name:save', e, response);
    
    expect(childScope.edit).toEqual(false);
  }));
  
  it('should not set edit to true on unsuccessful broadcast', inject(function() {
    $scope.objectId = objectId;
    $scope.value = ngModel;
    
    var element = $compile('<edit-field ng-model="value" name="name" object-id="objectId" default-text="Select role"></edit-field>')($scope);
    $scope.$digest();
    
    var childScope = element.isolateScope();
    var e = {foo: 'bar'};
    var response = {
      statusCode: 404
    };
    
    childScope.edit = true;
    $scope.$broadcast('name:save:error', e, response);
    
    expect(childScope.edit).toEqual(true);
  }));
});
'use strict';

describe('userTable directive', function(){
  var $scope,
    $compile,
    element,
    statuses;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular')); 
  
  beforeEach(inject(['$compile', '$rootScope', function(_$compile_,_$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    
    statuses = {all : {display: 'All', value: 'all', checked: true}, filters : [{display: 'Disabled', value: 'false', checked: false}, {display: 'Enabled', value : 'true', checked: false}]};
    $scope.statuses = statuses;
    
    element = $compile('<dropdown label="Some Label" items="statuses"></dropdown>')($scope);
    $scope.$digest();
  }]));

  it('should add checkboxes for each filter value, and also one for the all value', inject(function() {
    expect(element.find('input').length).toEqual(3);
  }));
  
  it('should add the "all" class to the "all" value container', inject(function() {
    var allContainer = element[0].querySelectorAll('.all');
    expect(angular.element(allContainer).hasClass('all')).toBe(true);
    
    var allCheckbox = allContainer[0].querySelectorAll('[name=all]');
    expect(angular.element(allCheckbox)).toBeTruthy();
  }));
  
  it('should uncheck the "all" value when a filter is enabled', inject(function() {
    expect($scope.statuses.all.checked).toBe(true);
    
    $scope.statuses.filters[0].checked = true;
    $scope.$digest();
    
    expect($scope.statuses.all.checked).toBe(false);
  }));
  
  it('should uncheck the other filters when "all" is checked', inject(function() {
    statuses = {all : {display: 'All', value: 'all', checked: false}, filters : [{display: 'Disabled', value: 'false', checked: true}]};
    $scope.statuses = statuses;
    
    element = $compile('<dropdown label="Some Label" items="statuses"></dropdown>')($scope);
    $scope.$digest();
    expect($scope.statuses.all.checked).toBe(false);
    expect($scope.statuses.filters[0].checked).toBe(true);
    
    $scope.statuses.all.checked = true;
    $scope.$digest();
    expect($scope.statuses.filters[0].checked).toBe(false);
  }));
  
  it('should keep the dropdown hidden by default', inject(function() {
    var dropdown = element[0].querySelectorAll('.dropdown');
    expect(angular.element(dropdown).hasClass('ng-hide')).toBe(true);
  }));
  
  it('should show the dropdown when the label is clicked', inject(function() {
    element.find('a').click();
    var dropdown = element[0].querySelectorAll('.dropdown');
    expect(angular.element(dropdown).hasClass('ng-hide')).toBe(false);
  }));
  
  it('should hide an already-open dropdown when the label is clicked', inject(function() {
    element.find('a').click();
    element.find('a').click();
    var dropdown = element[0].querySelectorAll('.dropdown');
    expect(angular.element(dropdown).hasClass('ng-hide')).toBe(true);
  }));
});

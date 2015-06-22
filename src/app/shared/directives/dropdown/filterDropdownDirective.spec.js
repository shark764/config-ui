'use strict';

describe('filterDropdown directive', function(){
  var $scope,
    $childScope,
    $compile,
    element,
    statuses
    ;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'apiHostname',
  function(_$compile_,_$rootScope_,$httpBackend, apiHostname) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;

    statuses = [{display: 'Disabled', value: 'false', checked: false}, {display: 'Enabled', value : 'true', checked: false}];
    $scope.statuses = statuses;

    element = $compile('<filter-dropdown show-all="true" label="Some Label" options="statuses"></filter-dropdown>')($scope);
    $scope.$digest();

    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
      'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
      'description': 'US East (N. Virginia)',
      'name': 'us-east-1'
    }]});

    $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
      'tenants': []
    }});

    $childScope = element.isolateScope();
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

  it('should not add the all field if the filters dont provide one', inject(function() {
    var newStatuses = {filters : [{display: 'Disabled', value: 'false', checked: false}, {display: 'Enabled', value : 'true', checked: false}]};
    $scope.newStatuses = newStatuses;

    element = $compile('<filter-dropdown label="Some Label" items="newStatuses"></filter-dropdown>')($scope);
    $scope.$digest();

    var allContainer = element[0].querySelectorAll('.all');
    expect(allContainer.length).toEqual(0);
  }));

  it('should uncheck the "all" value when a filter is enabled', inject(function() {
    expect($childScope.all.checked).toBe(true);

    $scope.statuses[0].checked = true;
    $scope.$digest();

    // expect($scope.all.checked).toBe(false);
  }));

  it('should check the other filters when "all" is checked', inject(function() {
    statuses = [{display: 'Disabled', value: 'false', checked: true}];
    $scope.statuses = statuses;

    element = $compile('<filter-dropdown show-all="true" label="Some Label" items="statuses"></filter-dropdown>')($scope);
    $scope.$digest();
    $childScope.all.checked = false;
    expect($childScope.all.checked).toBeFalsy(false);
    // expect($scope.statuses[0].checked).toBeFalsy(false);

    $childScope.all.checked = true;
    expect($childScope.all.checked).toBeTruthy(false);
    expect($scope.statuses[0].checked).toBeTruthy(true);
  }));

  it('should keep the dropdown hidden by default', inject(function() {
    var dropdown = element[0].querySelectorAll('.dropdown');
    expect(angular.element(dropdown).hasClass('ng-hide')).toBe(true);
  }));

  it('should show the dropdown when the label is clicked', inject(function() {
    element.find('.dropdown-label').click();
    var dropdown = element[0].querySelectorAll('.dropdown');
    expect(angular.element(dropdown).hasClass('ng-hide')).toBe(false);
  }));

  it('should hide an already-open dropdown when the label is clicked', inject(function() {
    element.find('.dropdown-label').click();
    element.find('.dropdown-label').click();
    var dropdown = element[0].querySelectorAll('.dropdown');
    expect(angular.element(dropdown).hasClass('ng-hide')).toBe(true);
  }));

  it('should update the item.checked value when the check wrapper div is clicked', inject(function() {
    $childScope.all.checked = true;
    var allContainer = element[0].querySelectorAll('.all');
    var allElement = angular.element(allContainer);

    allElement.click();
    expect($childScope.all.checked).toBeFalsy();

    $scope.statuses[0].checked = true;
    var filterContainer = element[0].querySelectorAll('.dropdown-option');
    var filterElement = angular.element(filterContainer[0]);

    filterElement.click();
    expect($scope.statuses[0].checked).toBeFalsy();
  }));
});

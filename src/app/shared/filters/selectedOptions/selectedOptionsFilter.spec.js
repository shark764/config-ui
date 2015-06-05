'use strict';

describe('selectedOptions filter', function(){
  var $filter,
      users;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['$filter', '$rootScope', function(_$filter_) {
    $filter = _$filter_;
    users = [ {
              'status': false,
              'state': 'WRAP',
              'value': 4
            },
            {
              'status': true,
              'state': 'NOT_READY',
              'value' : '5'
            },
            {
              'status': 'true',
              'state': 'READY',
              'value' : '6'
            },
            {
              'status': true,
              'state': 'WRAP',
              'value' : 4
            }];
  }]));

  it('should return all users if the all value is checked', inject(function() {
    var filters = {all : {value: 'all', checked: true}, filters : [{value: 'false', checked: false}, {value : 'true', checked: false}]};
    var result = $filter('selectedOptions')(users, filters, 'status');
    expect(result.length).toEqual(users.length);
  }));

  it('should return an empty array when no filters are selected and "all" is not selected', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: 'false', checked: false}, {value : 'true', checked: false}]};
    var result = $filter('selectedOptions')(users, filters, 'status');
    expect(result.length).toEqual(0);
  }));

  it('should allow the all option to be optional', inject(function() {
    var filters = {filters : [{value: 'false', checked: true}, {value : 'true', checked: false}]};
    var result = $filter('selectedOptions')(users, filters, 'status');
    expect(result.length).toEqual(1);
  }));

  it('should return users that match one selected filter', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: 'false', checked: true}, {value : 'true', checked: false}]};
    var result = $filter('selectedOptions')(users, filters, 'status');
    expect(result.length).toEqual(1);
  }));

  it('should return users that match one of many selected filters', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: 'WRAP', checked: true}, {value : 'READY', checked: false}, {value: 'NOT_READY', checked: true}]};
    var result = $filter('selectedOptions')(users, filters, 'state');
    expect(result.length).toEqual(3);
  }));

  it('should return an empty array if no users match the filters', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: 'SOMETHINGELSE', checked: true}, {value : 'READY', checked: false}]};
    var result = $filter('selectedOptions')(users, filters, 'state');
    expect(result.length).toEqual(0);
  }));

  it('should work with string and primitive values in the field', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: 'true', checked: true}, {value : 'false', checked: false}]};
    var result = $filter('selectedOptions')(users, filters, 'status');
    expect(result.length).toEqual(3);
  }));

  it('should return users missing values when "all" is selected', inject(function() {
    var filters = {all : {value: 'all', checked: true}, filters : [{value: '5', checked: false}, {value : '4', checked: false}]};
    users.push({});

    var result = $filter('selectedOptions')(users, filters, 'value');
    expect(result.length).toEqual(5);
  }));

  it('should not return users who are missing values when "all" is not selected', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: '5', checked: true}, {value : '4', checked: false}]};
    users.push({});

    var result = $filter('selectedOptions')(users, filters, 'value');
    expect(result.length).toEqual(1);
  }));
});

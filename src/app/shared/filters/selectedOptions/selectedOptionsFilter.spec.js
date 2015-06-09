'use strict';

describe('selectedOptions filter', function () {
  var $filter,
    users;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['$filter', '$rootScope', function (_$filter_) {
    $filter = _$filter_;
    users = [{
      'status': false,
      'state': 'WRAP',
      'value': 4
    }, {
      'status': true,
      'state': 'NOT_READY',
      'value': '5'
    }, {
      'status': 'true',
      'state': 'READY',
      'value': '6'
    }, {
      'status': true,
      'state': 'WRAP',
      'value': 4
    }];
  }]));

  it('should return all users if the all values are checked', inject(function () {
    var field = {
      name: 'status',
      options: [{
        value: 'false',
        checked: true
      }, {
        value: 'true',
        checked: true
      }]
    };
    var result = $filter('selectedOptions')(users, field);
    expect(result.length).toEqual(users.length);
  }));

  it('should return users that match one selected filter', inject(function () {
    var field = {
      name: 'status',
      options: [{
        value: 'false',
        checked: true
      }, {
        value: 'true',
        checked: false
      }]
    };
    var result = $filter('selectedOptions')(users, field);
    expect(result.length).toEqual(1);
  }));

  it('should return users that match one of many selected filters', inject(function () {
    var field = {
      name: 'state',
      options: [{
        value: 'WRAP',
        checked: true
      }, {
        value: 'READY',
        checked: false
      }, {
        value: 'NOT_READY',
        checked: true
      }]
    };
    var result = $filter('selectedOptions')(users, field);
    expect(result.length).toEqual(3);
  }));

  it('should return an empty array if no users match the filters', inject(function () {
    var field = {
      name: 'state',
      options: [{
        value: 'SOMETHINGELSE',
        checked: true
      }, {
        value: 'READY',
        checked: false
      }]
    };
    var result = $filter('selectedOptions')(users, field);
    expect(result.length).toEqual(0);
  }));

  it('should work with string and primitive values in the field', inject(function () {
    var field = {
      name: 'status',
      options: [{
        value: 'true',
        checked: true
      }, {
        value: 'false',
        checked: false
      }]
    };
    var result = $filter('selectedOptions')(users, field);
    expect(result.length).toEqual(3);
  }));
});
'use strict';

describe('matchesField filter', function () {
  var filter;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$filter', function ($filter) {
    filter = $filter('matchesField');
  }]));

  it('should return undefined if missing paramaters', inject(function () {
    var result = filter();
    expect(result).toBeUndefined();
    
    result = filter([]);
    expect(result).toBeUndefined();
    
    result = filter([], 'field');
    expect(result).toBeUndefined();
    
    result = filter([], '', true);
    expect(result).toBeUndefined();
  }));
  
  it('should return given item if there is a first-level match', inject(function () {
    var item = {
      field: 'a neat value',
      name: 'Sally'
    };
    
    var result = filter(item, 'name', 'Sally');
    expect(result).toBe(item);
  }));
  
  it('should return undefined if there isn\'t a first-level match', inject(function () {
    var item = {
      field: 'a neat value',
      name: 'Sally'
    };
    
    var result = filter(item, 'name', 'Markus');
    expect(result).toBeUndefined();
  }));
  
  it('should return given item if there is a nested match', inject(function () {
    var item = {
      field: 'a neat value',
      owner:{
        name: 'Sally'
      }
    };
    
    var result = filter(item, 'owner:name', 'Sally');
    expect(result).toBe(item);
  }));
  
  it('should return undefined if there isn\'t a nested match', inject(function () {
    var item = {
      field: 'a neat value',
      owner:{
        name: 'Sally'
      }
    };
    
    var result = filter(item, 'owner:name', 'Markus');
    expect(result).toBeUndefined();
  }));
  
  it('should return given item if there is a deeply nested match', inject(function () {
    var item = {
      owner: {
        contact: {
          city: {
            name: 'fredericton'
          }
        }
      }
    };
    
    var result = filter(item, 'owner:contact:city:name', 'fredericton');
    expect(result).toBe(item);
  }));
  
  it('should return undefined if there isn\'t a deeply nested match', inject(function () {
    var item = {
      owner: {
        contact: {
          city: {
            name: 'fredericton'
          }
        }
      }
    };
    
    var result = filter(item, 'owner:contact:city:name', 'moncton');
    expect(result).toBeUndefined();
  }));
  
  it('should return undefined if the given item doesn\'t have the nested field', inject(function () {
    var item = {
      owner: {
        contact: '1234567'
      }
    };
    
    var result = filter(item, 'owner:contact:city:name', 'moncton');
    expect(result).toBeUndefined();
  }));
  
  it('should return the item if the field matches an array value', inject(function () {
    var item = {
      things: [{
        id: 'id1'
      }, {
        id: 'id2'
      }]
    };
    
    var result = filter(item, 'things:id', 'id2');
    expect(result).toBe(item);
  }));
  
  it('should return undefined if there is no match in an array value', inject(function () {
    var item = {
      things: [{
        id: 'id1'
      }, {
        id: 'id2'
      }]
    };
    
    var result = filter(item, 'things:id', 'some other string');
    expect(result).toBeUndefined();
  }));
});
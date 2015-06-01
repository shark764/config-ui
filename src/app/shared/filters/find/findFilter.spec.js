'use strict';

describe('find filter', function(){
  var filter,
    items;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$filter', function($filter) {
    items = [
             {color: 'red', count : '5', id: '726555'},
             {color: '7', id: '726557'},
             {color: 'red', count: 8,  id: '555'}
            ];

    filter = $filter('find');
    
  }]));

  it('should return all items if not given a filter', inject(function() {
    var result = filter(items);
    expect(result.length).toBe(3);
    
    result = filter(items, '');
    expect(result.length).toBe(3);
  }));
  
  it('should return only the first matching item', inject(function() {
    var result = filter(items, {color : 'red'});
    expect(result).toEqual(items[0]);
  }));
  
  it('should do a loose match for numbers/strings', inject(function() {
    var result = filter(items, {count : 5});
    expect(result).toEqual(items[0]);
    
    result = filter(items, {count : '5'});
    expect(result).toEqual(items[0]);
    
    result = filter(items, {count : '8'});
    expect(result).toEqual(items[2]);
    
    result = filter(items, {count : 8});
    expect(result).toEqual(items[2]);
  }));

  it('should return undefined when there are no matches', inject(function() {
    var result = filter(items, {id : 20});
    expect(result).toBeUndefined();
  }));
  
  it('should ignore items missing filter properties', inject(function() {
    var result = filter(items, {count : 20});
    expect(result).toBeUndefined();
  }));
  
  it('should only return exact matches', inject(function() {
    var result = filter(items, {id : '72655'});
    expect(result).toBeUndefined();
  }));
  
  it('should only return item if all fields match', inject(function() {
    var result = filter(items, {id : '726555', color : 'red'});
    expect(result).toEqual(items[0]);
    
    result = filter(items, {id : '555', color : 'red'});
    expect(result).toEqual(items[2]);
    
    result = filter(items, {id : '6', color : 'red'});
    expect(result).toBeUndefined();
  }));
  
});
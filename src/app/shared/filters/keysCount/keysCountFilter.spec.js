'use strict';

describe('keysCount filter', function () {
  var filter;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$filter', function ($filter) {
    filter = $filter('keysCount');
  }]));

  it('should return the number of properties on the object', inject(function () {
    var result = filter({});
    expect(result).toBe(0);
    
    result = filter({
      one: 1,
      two: true,
      three: '3',
      four: [4]
    });
    expect(result).toBe(4);
  }));
});
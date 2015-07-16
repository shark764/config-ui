'use strict';

describe('search filter', function () {
  var filter,
    users;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$filter', function ($filter) {
    users = [{
      'id': '3',
      'status': false,
      'state': 'WRAP',
      'lastName': 'Wazowski',
      'firstName': 'Mike',
      'email': 'mike.Wazowski@hivedom.org',
      'skills': [{
        'name': 'walking'
      }, {
        'name': 'talking'
      }],
      'test': {
        'array': [{
          'fieldName': 'fieldValue'
        }]
      },
      'text_array': [
        'text1', 'text2'
      ],
      'recur1': [{
        'recur2': [{
          'recur3': [{
            'name': 'youdidit!'
          }]
        }]
      }]
    }];

    filter = $filter('search');

  }]));

  it('should return all items if search is blank', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], '');
    expect(result.length).toBe(1);
  }));

  it('should return all items if fields are blank', inject(function () {
    var result = filter(users, null, 'ssssss');
    expect(result.length).toBe(1);
  }));

  it('should not return item if search not included in item\'s values', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'blahh');
    expect(result.length).toBe(0);
  }));

  it('should return item if search is included in first given field', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'ike');
    expect(result.length).toBe(1);
  }));

  it('should return item if search is included in multiple given fields', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'Mike Wazowski');
    expect(result.length).toBe(1);
  }));

  it('should return item if search is included in last given field', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'ski');
    expect(result.length).toBe(1);
  }));

  it('should not return if only part search is included in item fields', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'Michael Wazowski');
    expect(result.length).toBe(0);
  }));

  it('should return item if search has wildcard value only', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], '*');
    expect(result.length).toBe(1);
  }));

  it('should return item with containing partial string using wildcard in query', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'Mi*Wazowski');
    expect(result.length).toBe(1);
  }));

  it('should only return item containing partial strings using several wildcards in query', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'i*e*a');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], 'i*l*e*a');
    expect(result.length).toBe(0);
  }));

  it('should return matching item regardless of character case', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'MIKE wAzoWsKi');
    expect(result.length).toBe(1);
  }));

  it('should not return item when search string does not match any fields', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'Randall Boggs');
    expect(result.length).toBe(0);
  }));

  it('should not return item when search string with wild cards does not match any fields', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], '*boo*');
    expect(result.length).toBe(0);
  }));

  it('should not use the asterisk as a repeat operator', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'q*');
    expect(result.length).toBe(0);
  }));

  it('should use the asterisk as 0 or more of any valid character', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'M*i*W*a*z*o*i');
    expect(result.length).toBe(1);
  }));

  it('should return the same result regardless of wildcard repeats', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], 'M*****');
    expect(result.length).toBe(1);
  }));

  it('should return the same result for strings starting and ending with wildcard', inject(function () {
    var result = filter(users, ['firstName', 'lastName'], '*Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], '*Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], 'Wazow');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], 'Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], '*Wazow');
    expect(result.length).toBe(1);
  }));
  
  it('should return nothing if fields aren\'t object or strings', inject(function () {
    var result = filter(users, [5, true], 'W');
    expect(result.length).toBe(0);
  }));

  it('should return results when skills match', inject(function () {

    var result = filter(users, [{
      path: 'skills',
      inner: {
        path: 'name'
      }
    }], 'walk');
    expect(result.length).toBe(1);
  }));
  
  it('should return results when skills match', inject(function () {

    var result = filter(users, [{
      path: 'skills',
      inner: {
        path: 'name'
      }
    }], 'walk');
    expect(result.length).toBe(1);
  }));
  
  it('should return results when inner attribute matches', inject(function () {

    var result = filter(users, [{
      path: 'test.array',
      inner: {
        path: 'fieldName'
      }
    }], 'Value');
    expect(result.length).toBe(1);
  }));
  
  it('should not return results when path is incorrect', inject(function () {
    var result = filter(users, [{
      path: 'test.array_z',
      inner: {
        path: 'fieldName'
      }
    }], 'Value');
    expect(result.length).toBe(0);
  }));
  
  it('should return when query in text array', inject(function () {
    var result = filter(users, [{
      path: 'text_array'
    }], 'text');
    expect(result.length).toBe(1);
  }));
  
  it('should not return when query not in text array', inject(function () {
    var result = filter(users, [{
      path: 'text_array'
    }], 'text3');
    expect(result.length).toBe(0);
  }));
  
  it('should return even with 3x recursion', inject(function () {
    var result = filter(users, [{
      path: 'recur1',
      inner: {
        path: 'recur2',
        inner: {
          path: 'recur3',
          inner: {
            path: 'name'
          }
        }
      }
    }], 'youdidit!');
    expect(result.length).toBe(1);
  }));
  
  it('should not return even with 3x recursion because of wrong path', inject(function () {
    var result = filter(users, [{
      path: 'recur1',
      inner: {
        path: 'recur3',
        inner: {
          path: 'recur2',
          inner: {
            path: 'name'
          }
        }
      }
    }], 'youdidit!');
    expect(result.length).toBe(0);
  }));

  describe('on multiple items', function () {
    beforeEach(function () {
      users = [{
        'id': '3',
        'status': 'true',
        'state': 'WRAP',
        'lastName': 'Wazowski',
        'firstName': 'Mike',
        'email': 'mike.Wazowski@hivedom.org',
        'skills': [{
          'name': 'talking'
        }]
      }, {
        'id': '7',
        'status': true,
        'state': 'OFFLINE',
        'lastName': 'Walter',
        'firstName': 'Serge',
        'email': 'serge.walter@example.com',
        'skills': [{
          'name': 'walking'
        }]
      }];
    });

    it('should return multiple results if they match', inject(function () {

      var result = filter(users, ['firstName', 'lastName'], 'w');
      expect(result.length).toBe(2);
    }));

    it('should only return matching results', inject(function () {

      var result = filter(users, ['firstName', 'lastName'], 'se');
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(users[1]);
    }));

    it('should return results matching string and primitive fields', inject(function () {

      var result = filter(users, ['status'], 'tru');
      expect(result.length).toBe(2);
    }));
    
    it('should return one walking users', inject(function () {
      var result = filter(users, [{
        path: 'skills',
        inner: {
          path: 'name'
        }
      }], 'walking');
      expect(result.length).toBe(1);
    }));
    
    it('should return one talking users', inject(function () {
      var result = filter(users, [{
        path: 'skills',
        inner: {
          path: 'name'
        }
      }], 'talking');
      expect(result.length).toBe(1);
    }));
    
    it('should return two king users', inject(function () {
      var result = filter(users, [{
        path: 'skills',
        inner: {
          path: 'name'
        }
      }], 'king');
      expect(result.length).toBe(2);
    }));
    
  });
});
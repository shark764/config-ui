'use strict';

describe('users controller', function () {
  var userTableConfig;
  
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.roles'));

  beforeEach(inject(['userTableConfig',
    function (_userTableConfig) {
      userTableConfig = _userTableConfig;
    }
  ]));

  it('should have required fields', inject(function () {
    expect(userTableConfig.fields).toBeDefined();
    expect(userTableConfig.searchOn).toBeDefined();
    expect(userTableConfig.orderBy).toBeDefined();
    expect(userTableConfig.title).toBeDefined();
  }));
  
  it('should return $user.getDisplay', function() {
    var tenantUser = {
      $user: {
        $original: {
          getDisplay: jasmine.createSpy('$user.$original.getDisplay')
        }
      }
    };
    
    userTableConfig.fields[0].resolve(tenantUser);
    expect(tenantUser.$user.$original.getDisplay).toHaveBeenCalled();
  });
  
  it('should return skills.length', function() {
    var tenantUser = {
      skills: [{}]
    };
    
    var length = userTableConfig.fields[3].resolve(tenantUser);
    expect(length).toEqual(1);
  });
  
  it('should return groups.length', function() {
    var tenantUser = {
      groups: [{}, {}]
    };
    
    var length = userTableConfig.fields[4].resolve(tenantUser);
    expect(length).toEqual(2);
  });
  
  it('should return all tenant skills', inject(['$httpBackend', function($httpBackend) {
    var skills = userTableConfig.fields[3].header.options();
    
    $httpBackend.flush();
    
    expect(skills.length).toEqual(2);
  }]));
  
  it('should return all tenant groups', inject(['$httpBackend', function($httpBackend) {
    var groups = userTableConfig.fields[4].header.options();
    
    $httpBackend.flush();
    
    expect(groups.length).toEqual(3);
  }]));
  
  it('should return all tenant roles', inject(['$httpBackend', function($httpBackend) {
    var roles = userTableConfig.fields[5].header.options();
    
    $httpBackend.flush();
    
    expect(roles.length).toEqual(2);
  }]));
});

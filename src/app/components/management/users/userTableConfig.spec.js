'use strict';

describe('usersTableConfig', function() {
  var userTableConfig;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.skill.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.group.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.role.mock'));

  beforeEach(inject(['userTableConfig',
    function(_userTableConfig) {
      userTableConfig = _userTableConfig;
    }
  ]));

  it('should have required fields', inject(function() {
    var config = userTableConfig.getConfig();
    expect(config.fields).toBeDefined();
    expect(config.searchOn).toBeDefined();
    expect(config.orderBy).toBeDefined();
    expect(config.title).toBeDefined();
  }));

  it('should return $user.getDisplay', function() {
    var tenantUser = {
      $user: {
        $original: {
          getDisplay: jasmine.createSpy('$user.$original.getDisplay')
        }
      }
    };

    userTableConfig.getConfig().fields[0].resolve(tenantUser);
    expect(tenantUser.$user.$original.getDisplay).toHaveBeenCalled();
  });

  it('should return skills.length', inject(['UserPermissions', function(UserPermissions) {
    var tenantUser = {
      $skills: [{}]
    };

    spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
    var length = userTableConfig.getConfig().fields[2].resolve(tenantUser);
    expect(length).toEqual(1);
  }]));

  it('should return groups.length', inject(['UserPermissions', function(UserPermissions) {
    var tenantUser = {
      $groups: [{}, {}]
    };

    spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
    var length = userTableConfig.getConfig().fields[3].resolve(tenantUser);
    expect(length).toEqual(2);
  }]));

  it('should return all tenant skills if the user has permission', inject(['$httpBackend', 'UserPermissions', function($httpBackend, UserPermissions) {
    spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
    var skills = userTableConfig.getConfig().fields[2].header.options();

    $httpBackend.flush();

    expect(skills.length).toEqual(2);
  }]));

  it('should not have tenant skills if the user does not have permission', inject(['$httpBackend', 'UserPermissions', function($httpBackend, UserPermissions) {
    spyOn(UserPermissions, 'hasPermissionInList').and.callFake(function(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT' && arr[i] !== 'VIEW_ALL_SKILLS' && arr[i] !== 'MANAGE_ALL_SKILLS' && arr[i] !== 'MANAGE_ALL_USER_SKILLS' && arr[i] !== 'MANAGE_TENANT_ENROLLMENT') {
          return true;
        }
      }

      return false;
    });

    expect(userTableConfig.getConfig().fields.length).toBe(6);
  }]));

  it('should return all tenant groups if the user has permission', inject(['$httpBackend', 'UserPermissions', function($httpBackend, UserPermissions) {
    spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
    var groups = userTableConfig.getConfig().fields[3].header.options();

    $httpBackend.flush();

    expect(groups.length).toEqual(3);
  }]));

  it('should not have tenant groups if the user does not have permission', inject(['$httpBackend', 'UserPermissions', function($httpBackend, UserPermissions) {
    spyOn(UserPermissions, 'hasPermissionInList').and.callFake(function(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT' && arr[i] !== 'VIEW_ALL_GROUPS' && arr[i] !== 'MANAGE_ALL_GROUPS' && arr[i] !== 'MANAGE_ALL_GROUP_USERS' && arr[i] !== 'MANAGE_TENANT_ENROLLMENT' && arr[i] !== 'MANAGE_ALL_GROUP_OWNERS') {
          return true;
        }
      }

      return false;
    });

    expect(userTableConfig.getConfig().fields.length).toBe(6);
  }]));

  it('should return all tenant roles if the user has permission', inject(['$httpBackend', 'UserPermissions', function($httpBackend, UserPermissions) {
    spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
    var roles = userTableConfig.getConfig().fields[4].header.options();

    $httpBackend.flush();

    expect(roles.length).toEqual(2);
  }]));

  it('should not have tenant roles if the user does not have permission', inject(['$httpBackend', 'UserPermissions', function($httpBackend, UserPermissions) {
    spyOn(UserPermissions, 'hasPermissionInList').and.callFake(function(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== 'PLATFORM_CREATE_TENANT_ROLES' && arr[i] !== 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT' && arr[i] !== 'VIEW_ALL_ROLES' && arr[i] !== 'MANAGE_ALL_ROLES' && arr[i] !== 'MANAGE_TENANT_ENROLLMENT') {
          return true;
        }
      }

      return false;
    });

    expect(userTableConfig.getConfig().fields.length).toBe(6);
  }]));
});

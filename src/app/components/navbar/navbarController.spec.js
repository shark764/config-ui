'use strict';

/* global spyOn: false  */

describe('NavbarController', function () {
  var $rootScope,
    $scope,
    $state,
    $compile,
    $controller,
    $httpBackend,
    Session,
    apiHostname,
    mockTenants;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.mock'));

  beforeEach(inject(['$compile', '$rootScope', '$state', '$controller', '$httpBackend', 'Session', 'apiHostname', 'mockTenants',
    function (_$compile_, _$rootScope_, _$state_, _$controller_, _$httpBackend, _Session_, _apiHostname_, _mockTenants) {
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $state = _$state_;
      $controller = _$controller_;
      $httpBackend = $httpBackend;
      apiHostname = _apiHostname_;
      mockTenants = _mockTenants;
      Session = _Session_;
    }
  ]));

  describe('initialized with no tenants', function() {
    beforeEach(function() {
      Session.tenants = [];

      $controller('NavbarController', {
        '$scope': $scope
      });

      $rootScope.$apply();
    });

    it('should have a method to check if the path is active', function () {
      $state.go('content.management.users').then(function (){
        expect($scope.isActive('/management')).toBe(true);
        expect($scope.isActive('/configuration')).toBe(false);
      });
      $rootScope.$apply();
    });

    it('should have a method to log the user out and redirect them to the login page', function () {
      Session.token = 'abc';

      $state.transitionTo('content.management.users');

      expect(Session.isAuthenticated()).toBeTruthy();

      $scope.logout();

      expect(Session.isAuthenticated()).toBeFalsy();
    });
  });

  describe('initialized with tenants', function() {
    beforeEach(inject(function($state) {
      Session.token = 'abc';
      Session.tenants = mockTenants;
      spyOn($state, 'go');
      $controller('NavbarController', {
        '$scope': $scope
      });

      $scope.$apply();

      expect(Session.tenants).toBeDefined();
      expect(Session.tenants.length).toEqual(2);
    }));

    it('should select the first tenant retrieved as the active tenant if no tenant is set in the Session', function () {
      expect(Session.tenant.tenantId).toBe(mockTenants[0].id);
    });

    it('should switch the tenant on drop down click', function() {
      expect($scope.tenantDropdownItems).toBeDefined();
      expect($scope.tenantDropdownItems[1]).toBeDefined();
      expect($scope.tenantDropdownItems[1].onClick).toBeDefined();

      $scope.tenantDropdownItems[1].onClick();
      expect(Session.tenant.tenantId).toEqual(mockTenants[1].tenantId);
    });

    it('should call $scope.logout on logout click', function() {
      spyOn($scope, 'logout');

      $scope.userDropdownItems[0].onClick();

      expect($scope.logout).toHaveBeenCalled();
    });

    it('should call $scope.logout on logout click', function() {
      spyOn($state, 'transitionTo');

      $scope.userDropdownItems[1].onClick();

      expect($state.transitionTo).toHaveBeenCalled();
    });
  });

  describe('populateTenantsHandler function', function() {
    beforeEach(function(){
      $controller('NavbarController', {
        '$scope': $scope
      });

      $scope.$digest();
    });

    it('should do nothing if the user is not authenticated', inject(['Session', function (Session) {
      spyOn(Session, 'isAuthenticated').and.returnValue(false);
      spyOn(Session, 'setTenant');

      $scope.populateTenantsHandler();
      expect(Session.setTenant).not.toHaveBeenCalled();
    }]));

    it('should pick the first tenant if the Session has no tenant defined', inject(['Session', function (Session) {
      spyOn(Session, 'isAuthenticated').and.returnValue(true);
      spyOn(Session, 'setTenant');
      Session.tenants = [{id: 'obj1'}, {id: 'obj2'}];
      delete Session.tenant.tenantId;

      $scope.populateTenantsHandler();
      expect(Session.setTenant).toHaveBeenCalledWith(Session.tenants[0]);
    }]));
  });

  describe('isActive function', function() {
    beforeEach(function(){
      $controller('NavbarController', {
        '$scope': $scope
      });

      $scope.$digest();
    });

    it('should return true if the current state matches the given string', inject(['$state', function ($state) {
      $state.current.name = 'notempty';
      spyOn($state, 'href').and.returnValue('/mystate');

      expect($scope.isActive('mystate')).toBeTruthy();
    }]));

    it('should return false if the current state does not match the given string', inject(['$state', function ($state) {
      $state.current.name = 'notempty';
      spyOn($state, 'href').and.returnValue('/mystate');

      expect($scope.isActive('anotherstate')).toBeFalsy();
    }]));

    it('should return false if the current state is blank', inject(['$state', function ($state) {
      $state.current.name = '';

      expect($scope.isActive('anotherstate')).toBeFalsy();
    }]));
  });

  describe('tableConfig setup', function() {
    it('should add the Users link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_USERS', 'MANAGE_ALL_USER_EXTENSIONS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_ALL_USER_LOCATIONS', 'MANAGE_TENANT_ENROLLMENT'];
      var permissionsList2 = ['MANAGE_ALL_SKILLS', 'MANAGE_ALL_GROUPS'];
      var currentPermission;
      var currentSecondPermission;

      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          case currentSecondPermission:
            return true;
          default:
            return false;
        }
      });

      spyOn($state, 'transitionTo');

      for (var j = 0; j < permissionsList2.length; j++){
        currentSecondPermission = permissionsList2[j];

        for (var i = 0; i < permissionsList.length; i++){
          currentPermission = permissionsList[i];

          $controller('NavbarController', {'$scope': $scope});
          $scope.$digest();

          expect($scope.managementDropConfig).toBeDefined();
          expect($scope.managementDropConfig.length).toBeGreaterThan(0);

          var userConfigItem = filterFilter($scope.managementDropConfig, {id: 'user-management-link'});
          expect(userConfigItem.length).toBe(1);
          userConfigItem = userConfigItem[0];

          expect(userConfigItem.stateLink).toEqual('content.management.users');
        }
      }
    }]));

    it('should add the Roles link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'PLATFORM_CREATE_TENANT_ROLES', 'VIEW_ALL_ROLES', 'MANAGE_ALL_ROLES', 'MANAGE_TENANT_ENROLLMENT'];
      var currentPermission;
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          default:
            return false;
        }
      });

      for (var i = 0; i < permissionsList.length; i++){
        currentPermission = permissionsList[i];

        $controller('NavbarController', {'$scope': $scope});
        $scope.$digest();

        expect($scope.managementDropConfig).toBeDefined();
        expect($scope.managementDropConfig.length).toBeGreaterThan(0);

        var roleConfigItem = filterFilter($scope.managementDropConfig, {id: 'role-management-link'});
        expect(roleConfigItem.length).toBe(1);
        roleConfigItem = roleConfigItem[0];

        expect(roleConfigItem.stateLink).toEqual('content.management.roles');
      }
    }]));

    it('should add the Skills link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_SKILLS', 'MANAGE_ALL_SKILLS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_TENANT_ENROLLMENT'];
      var currentPermission;
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          case 'MANAGE_ALL_MEDIA':
            return true;
          default:
            return false;
        }
      });

      for (var i = 0; i < permissionsList.length; i++){
        currentPermission = permissionsList[i];

        $controller('NavbarController', {'$scope': $scope});
        $scope.$digest();

        expect($scope.managementDropConfig).toBeDefined();
        expect($scope.managementDropConfig.length).toBeGreaterThan(0);

        var skillConfigItem = filterFilter($scope.managementDropConfig, {id: 'skill-management-link'});
        expect(skillConfigItem.length).toBe(1);
        skillConfigItem = skillConfigItem[0];

        expect(skillConfigItem.stateLink).toEqual('content.management.skills');
      }
    }]));

    it('should add the Groups link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_GROUPS', 'MANAGE_ALL_GROUPS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_GROUP_OWNERS', 'MANAGE_TENANT_ENROLLMENT'];
      var currentPermission;
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          case 'MANAGE_ALL_MEDIA':
            return true;
          default:
            return false;
        }
      });

      for (var i = 0; i < permissionsList.length; i++){
        currentPermission = permissionsList[i];

        $controller('NavbarController', {'$scope': $scope});
        $scope.$digest();

        expect($scope.managementDropConfig).toBeDefined();
        expect($scope.managementDropConfig.length).toBeGreaterThan(0);

        var groupConfigItem = filterFilter($scope.managementDropConfig, {id: 'group-management-link'});
        expect(groupConfigItem.length).toBe(1);
        groupConfigItem = groupConfigItem[0];

        expect(groupConfigItem.stateLink).toEqual('content.management.groups');
      }
    }]));

    it('should add the Tenants link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['PLATFORM_VIEW_ALL_TENANTS', 'PLATFORM_MANAGE_ALL_TENANTS', 'PLATFORM_CREATE_ALL_TENANTS', 'PLATFORM_CREATE_TENANT_ROLES', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'MANAGE_TENANT'];
      var currentPermission;
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          default:
            return false;
        }
      });

      for (var i = 0; i < permissionsList.length; i++){
        currentPermission = permissionsList[i];

        $controller('NavbarController', {'$scope': $scope});
        $scope.$digest();

        expect($scope.configurationDropConfig).toBeDefined();
        expect($scope.configurationDropConfig.length).toBeGreaterThan(0);

        var tenantsConfigItem = filterFilter($scope.configurationDropConfig, {id: 'tenants-configuration-link'});
        expect(tenantsConfigItem.length).toBe(1);
        tenantsConfigItem = tenantsConfigItem[0];

        expect(tenantsConfigItem.stateLink).toEqual('content.configuration.tenants');
      }
    }]));

    it('should add the Integrations link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['VIEW_ALL_PROVIDERS', 'MANAGE_ALL_PROVIDERS'];
      var currentPermission;
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          default:
            return false;
        }
      });

      for (var i = 0; i < permissionsList.length; i++){
        currentPermission = permissionsList[i];

        $controller('NavbarController', {'$scope': $scope});
        $scope.$digest();

        expect($scope.configurationDropConfig).toBeDefined();
        expect($scope.configurationDropConfig.length).toBeGreaterThan(0);

        var integrationConfigItem = filterFilter($scope.configurationDropConfig, {id: 'integrations-configuration-link'});
        expect(integrationConfigItem.length).toBe(1);
        integrationConfigItem = integrationConfigItem[0];

        expect(integrationConfigItem.stateLink).toEqual('content.configuration.integrations');
      }
    }]));

    it('should add the Flows link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS', 'MAP_ALL_CONTACT_POINTS'];
      var currentPermission;
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          default:
            return false;
        }
      });

      for (var i = 0; i < permissionsList.length; i++){
        currentPermission = permissionsList[i];

        $controller('NavbarController', {'$scope': $scope});
        $scope.$digest();

        expect($scope.flowsDropConfig).toBeDefined();
        expect($scope.flowsDropConfig.length).toBeGreaterThan(0);

        var flowConfigItem = filterFilter($scope.flowsDropConfig, {id: 'flow-management-link'});
        expect(flowConfigItem.length).toBe(1);
        flowConfigItem = flowConfigItem[0];

        expect(flowConfigItem.stateLink).toEqual('content.flows.flowManagement');
      }
    }]));

    it('should add the Queues link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS', 'MANAGE_ALL_QUEUES'];
      var currentPermission;
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          default:
            return false;
        }
      });

      for (var i = 0; i < permissionsList.length; i++){
        currentPermission = permissionsList[i];

        $controller('NavbarController', {'$scope': $scope});

        $scope.$digest();

        expect($scope.flowsDropConfig).toBeDefined();
        expect($scope.flowsDropConfig.length).toBeGreaterThan(0);

        var queueConfigItem = filterFilter($scope.flowsDropConfig, {id: 'queue-management-link'});
        expect(queueConfigItem.length).toBe(1);
        queueConfigItem = queueConfigItem[0];

        expect(queueConfigItem.stateLink).toEqual('content.flows.queues');
      }
    }]));

    it('should add the Media Collections link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['VIEW_ALL_MEDIA', 'VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS'];
      var currentPermission;
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          default:
            return false;
        }
      });

      for (var i = 0; i < permissionsList.length; i++){
        currentPermission = permissionsList[i];

        $controller('NavbarController', {'$scope': $scope});
        $scope.$digest();

        expect($scope.flowsDropConfig).toBeDefined();
        expect($scope.flowsDropConfig.length).toBeGreaterThan(0);

        var mcConfigItem = filterFilter($scope.flowsDropConfig, {id: 'media-collection-management-link'});
        expect(mcConfigItem.length).toBe(1);
        mcConfigItem = mcConfigItem[0];

        expect(mcConfigItem.stateLink).toEqual('content.flows.media-collections');
      }
    }]));

    it('should add the Media link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['VIEW_ALL_MEDIA', 'VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS'];
      var currentPermission;
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          default:
            return false;
        }
      });

      for (var i = 0; i < permissionsList.length; i++){
        currentPermission = permissionsList[i];

        $controller('NavbarController', {'$scope': $scope});
        $scope.$digest();

        expect($scope.flowsDropConfig).toBeDefined();
        expect($scope.flowsDropConfig.length).toBeGreaterThan(0);

        var mediaConfigItem = filterFilter($scope.flowsDropConfig, {id: 'media-management-link'});
        expect(mediaConfigItem.length).toBe(1);
        mediaConfigItem = mediaConfigItem[0];

        expect(mediaConfigItem.stateLink).toEqual('content.flows.media');
      }
    }]));

    it('should add the Dispatch Mappings link if the user has permissions', inject(['UserPermissions', 'filterFilter', function (UserPermissions, filterFilter) {
      var permissionsList = ['VIEW_ALL_CONTACT_POINTS', 'MAP_ALL_CONTACT_POINTS'];
      var currentPermission;
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        switch(permission){
          case currentPermission:
            return true;
          default:
            return false;
        }
      });

      spyOn($state, 'transitionTo');

      for (var i = 0; i < permissionsList.length; i++){
        currentPermission = permissionsList[i];

        $controller('NavbarController', {'$scope': $scope});
        $scope.$digest();

        expect($scope.flowsDropConfig).toBeDefined();
        expect($scope.flowsDropConfig.length).toBeGreaterThan(0);

        var dmConfigItem = filterFilter($scope.flowsDropConfig, {id: 'dispatch-mappings-configuration-link'});
        expect(dmConfigItem.length).toBe(1);
        dmConfigItem = dmConfigItem[0];

        expect(dmConfigItem.stateLink).toEqual('content.flows.dispatchMappings');
      }
    }]));
  });
});

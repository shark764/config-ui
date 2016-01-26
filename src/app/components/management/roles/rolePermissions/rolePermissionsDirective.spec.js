'use strict';

describe('rolePermissions directive', function() {
  var $scope,
    element,
    isolateScope,
    mockRoles,
    mockTenantPermissions;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.role.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.permission.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'mockRoles', 'mockTenantPermissions',
    function($compile, $rootScope, _mockRoles, _mockTenantPermissions) {
      mockRoles = _mockRoles;
      mockTenantPermissions = _mockTenantPermissions;
      $scope = $rootScope.$new();
      $scope.role = mockRoles[0];

      element = $compile('<role-permissions role="role"></role-permissions>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  describe('save function', function() {
    it('should remove the added permission from the dropdown list', function() {
      spyOn($scope.role, '$update').and.callThrough();
      isolateScope.selectedPermission = mockTenantPermissions[0];
      isolateScope.filtered = mockTenantPermissions;
      expect(isolateScope.filtered.length).toBe(3);

      isolateScope.save();
      expect(isolateScope.filtered.length).toBe(2);
    });

    it('should do nothing if the selected permission is undefined', function() {
      isolateScope.filtered = mockTenantPermissions;
      expect(isolateScope.filtered.length).toBe(3);

      isolateScope.save();
      expect(isolateScope.filtered.length).toBe(3);
    });

    it('should add the selected permission to the permission arrays', function() {
      spyOn($scope.role, '$update').and.callThrough();
      isolateScope.filtered = mockTenantPermissions;
      isolateScope.selectedPermission = mockTenantPermissions[0];
      expect($scope.role.permissions.length).toBe(0);
      expect(isolateScope.rolePermissions.length).toBe(0);

      isolateScope.save();
      expect($scope.role.permissions.length).toBe(1);
      expect(isolateScope.rolePermissions.length).toBe(1);
    });

    it('should update the role if the role exists', function() {
      spyOn($scope.role, '$update').and.callThrough();
      isolateScope.filtered = mockTenantPermissions;
      isolateScope.selectedPermission = mockTenantPermissions[0];

      isolateScope.save();
      expect($scope.role.$update).toHaveBeenCalled();
    });
    
    it('should display an alert if updating the role succeeded', inject(function(Alert, $httpBackend, apiHostname) {
      spyOn(Alert, 'success');
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/roles/roleId1').respond(200);
      isolateScope.filtered = mockTenantPermissions;
      isolateScope.selectedPermission = mockTenantPermissions[0];

      isolateScope.save();
      $httpBackend.flush();
      expect(Alert.success).toHaveBeenCalled();
    }));
    
    it('should display an alert if updating the role failed', inject(function(Alert, $httpBackend, apiHostname) {
      spyOn(Alert, 'error');
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/roles/roleId1').respond(400);
      isolateScope.filtered = mockTenantPermissions;
      isolateScope.selectedPermission = mockTenantPermissions[0];

      isolateScope.save();
      $httpBackend.flush();
      expect(Alert.error).toHaveBeenCalled();
    }));

    it('should set the permissionchanges input dirty if the role is new', function() {
      isolateScope.filtered = mockTenantPermissions;
      spyOn($scope.role, 'isNew').and.returnValue(true);
      isolateScope.addPermission = {
        permissionchanges: {
          $setDirty: jasmine.createSpy('$setDirty')
        }
      };

      isolateScope.selectedPermission = mockTenantPermissions[0];

      isolateScope.save();
      expect(isolateScope.addPermission.permissionchanges.$setDirty).toHaveBeenCalled();
    });
  });

  describe('updateFiltered function', function() {
    it('should remove the role\'s permissions from the list of all tenant permission', function() {
      isolateScope.rolePermissions = [mockTenantPermissions[0]];
      spyOn(isolateScope, 'fetchPermissions').and.returnValue(mockTenantPermissions);

      isolateScope.updateFiltered();
      expect(isolateScope.filtered.length).toBe(2);
    });
  });

  describe('role watch function', function() {
    it('should fetch the tenant permissions', inject(function(mockRoles) {
      spyOn(isolateScope, 'fetchPermissions').and.callThrough();
      $scope.role = mockRoles[1];
      $scope.$digest();
      expect(isolateScope.fetchPermissions).toHaveBeenCalled();
    }));

    it('should fetch the role permissions', inject(['mockRoles', '$httpBackend', function(mockRoles, $httpBackend) {
      spyOn(isolateScope, 'fetchRolePermissions');

      $scope.role = mockRoles[1];
      $httpBackend.flush();
      $scope.$digest();
      $scope.$digest();
      expect(isolateScope.fetchRolePermissions).toHaveBeenCalled();
    }]));
  });

  describe('remove function', function() {
    it('should add the permission to the filtered list', function() {
      spyOn($scope.role, '$update').and.callThrough();
      isolateScope.filtered = [mockTenantPermissions[1], mockTenantPermissions[2]];
      expect(isolateScope.filtered.length).toBe(2);

      isolateScope.remove(mockTenantPermissions[0]);

      expect(isolateScope.filtered.length).toBe(3);
    });

    it('should remove the permission from the permission arrays', function() {
      spyOn($scope.role, '$update').and.callThrough();
      isolateScope.filtered = [];
      isolateScope.role.permissions = [mockTenantPermissions[0].id, mockTenantPermissions[1].id, mockTenantPermissions[2].id];
      isolateScope.rolePermissions = mockTenantPermissions;

      isolateScope.remove(mockTenantPermissions[0]);
      expect(isolateScope.role.permissions.length).toBe(2);
      expect(isolateScope.rolePermissions.length).toBe(2);
    });

    it('should update the role if the role exists', function() {
      spyOn($scope.role, '$update').and.callThrough();
      isolateScope.filtered = [];
      isolateScope.role.permissions = [mockTenantPermissions[0].id, mockTenantPermissions[1].id, mockTenantPermissions[2].id];
      isolateScope.rolePermissions = mockTenantPermissions;

      isolateScope.remove(mockTenantPermissions[0]);
      expect($scope.role.$update).toHaveBeenCalled();
    });

    it('should set the permissionchanges input dirty if the role is new', function() {
      isolateScope.filtered = [];
      isolateScope.role.permissions = [mockTenantPermissions[0].id, mockTenantPermissions[1].id, mockTenantPermissions[2].id];
      isolateScope.rolePermissions = mockTenantPermissions;
      spyOn($scope.role, 'isNew').and.returnValue(true);
      isolateScope.addPermission = {
        permissionchanges: {
          $setDirty: jasmine.createSpy('$setDirty')
        }
      };

      isolateScope.remove(mockTenantPermissions[0]);
      expect(isolateScope.addPermission.permissionchanges.$setDirty).toHaveBeenCalled();
    });
    
    it('should display an alert if updating the role succeeded', inject(function(Alert, $httpBackend, apiHostname) {
      spyOn(Alert, 'success');
      spyOn(isolateScope, 'fetchRolePermissions');
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/roles/roleId1').respond(200);
      isolateScope.filtered = [];
      isolateScope.role.permissions = [mockTenantPermissions[0].id, mockTenantPermissions[1].id, mockTenantPermissions[2].id];
      isolateScope.rolePermissions = mockTenantPermissions;

      isolateScope.remove(mockTenantPermissions[0]);
      $httpBackend.flush();
      expect(Alert.success).toHaveBeenCalled();
    }));
    
    it('should display an alert if updating the role failed', inject(function(Alert, $httpBackend, apiHostname, $q) {
      spyOn(Alert, 'error');
      spyOn(isolateScope, 'fetchRolePermissions');
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/roles/roleId1').respond(400);
      isolateScope.filtered = [];
      isolateScope.role.permissions = [mockTenantPermissions[0].id, mockTenantPermissions[1].id, mockTenantPermissions[2].id];
      isolateScope.rolePermissions = mockTenantPermissions;

      isolateScope.remove(mockTenantPermissions[0]);
      $httpBackend.flush();
      expect(Alert.error).toHaveBeenCalled();
    }));
  });
});

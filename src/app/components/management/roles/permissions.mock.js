'use strict';

angular.module('liveopsConfigPanel.mock.content.management.permissions', ['liveopsConfigPanel.mock.content'])
  .service('mockTenantPermissions', function(TenantPermission) {
    return [new TenantPermission({
      'id': 'permissionId1',
      'name': 'PERMISSION_1',
      'tenantId': 'tenant-id'
    }), new TenantPermission({
      'id': 'permissionId2',
      'name': 'PERMISSION_2',
      'tenantId': 'tenant-id'
    }), new TenantPermission({
      'id': 'permissionId3',
      'name': 'PERMISSION_3',
      'tenantId': 'tenant-id'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockTenantPermissions',
    function($httpBackend, apiHostname, mockTenantPermissions) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/permissions').respond({
        'result': [mockTenantPermissions[0], mockTenantPermissions[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/permissionId1').respond({
        'result': mockTenantPermissions[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/permissionId2').respond({
        'result': mockTenantPermissions[1]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/permissionId3').respond({
        'result': mockTenantPermissions[2]
      });
    }
  ])
  .service('mockPlatformPermissions', function(PlatformPermission) {
    return [new PlatformPermission({
      'id': 'permissionId1',
      'name': 'PLATFORM_PERMISSION_1'
    }), new PlatformPermission({
      'id': 'permissionId2',
      'name': 'PLATFORM_PERMISSION_1'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockPlatformPermissions',
    function($httpBackend, apiHostname, mockPlatformPermissions) {
      $httpBackend.when('GET', apiHostname + '/v1/permissions').respond({
        'result': [mockPlatformPermissions[0], mockPlatformPermissions[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/permissions/permissionId1').respond({
        'result': mockPlatformPermissions[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/permissions/permissionId2').respond({
        'result': mockPlatformPermissions[1]
      });
    }
  ]);

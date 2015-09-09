'use strict';

angular.module('liveopsConfigPanel.mock.content.management.roles', ['liveopsConfigPanel.mock.content'])
  .service('mockRoles', function(TenantRole) {
    return [new TenantRole({
      'id': 'roleId1',
      'name': 'roleName1',
      'tenantId': 'tenant-id',
      'permissions': []
    }), new TenantRole({
      'id': 'roleId2',
      'name': 'roleName2',
      'tenantId': 'tenant-id',
      'permissions': []
    }), new TenantRole({
      'id': 'roleId3',
      'name': 'roleName3',
      'description': 'Does not exist yet!',
      'tenantId': 'tenant-id',
      'permissions': []
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockRoles',
    function($httpBackend, apiHostname, mockRoles) {
      //GET tenants/roles
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/roles').respond({
        'result': [mockRoles[0], mockRoles[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/roles/roleId1').respond({
        'result': mockRoles[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/roles/roleId2').respond({
        'result': mockRoles[1]
      });
    }
  ])
  .service('mockPlatformRoles', function(PlatformRole) {
    return [new PlatformRole({
      'id': 'roleId1',
      'name': 'roleName1',
      'permissions': []
    }), new PlatformRole({
      'id': 'roleId2',
      'name': 'roleName2',
      'permissions': []
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockPlatformRoles',
    function($httpBackend, apiHostname, mockPlatformRoles) {
      $httpBackend.when('GET', apiHostname + '/v1/roles').respond({
        'result': [mockPlatformRoles[0], mockPlatformRoles[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/roles/roleId1').respond({
        'result': mockPlatformRoles[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/roles/roleId2').respond({
        'result': mockPlatformRoles[1]
      });
    }
  ]);

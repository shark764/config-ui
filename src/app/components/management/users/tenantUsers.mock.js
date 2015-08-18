'use strict';

angular.module('liveopsConfigPanel.mock.content.management.tenantUsers', ['liveopsConfigPanel.mock.content'])
  .service('mockTenantUsers', function (TenantUser) {
    return [new TenantUser({
      'id': 'userId1',
      'status': 'pending',
      'externalId': 73795,
      'lastName': 'Lowe',
      'firstName': 'Munoz',
      'email': 'munoz.lowe@hivedom.org',
      'tenantId': 'tenant-id',
      'roleName': 'roleName1',
      'roleId': 'roleId1',
      'skills': [],
      'groups': []
    }), new TenantUser({
      'id': 'userId2',
      'status': 'enabled',
      'externalId': 80232,
      'lastName': 'Oliver',
      'firstName': 'Michael',
      'email': 'michael.oliver@ezent.io',
      'tenantId': 'tenant-id',
      'roleName': 'roleName1',
      'roleId': 'roleId1',
      'skills': [],
      'groups': []
    }), new TenantUser({
      'id': 'userId3',
      'status': 'enabled',
      'externalId': 80233,
      'lastName': 'Moon',
      'firstName': 'Jackie',
      'email': 'jackie.moon@liveops.com',
      'tenantId': 'tenant-id',
      'roleId': 'roleId2',
      'roleName': 'roleName2',
      'skills': [],
      'groups': []
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockTenantUsers',
    function ($httpBackend, apiHostname, mockTenantUsers) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId1').respond({
        'result': mockTenantUsers[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId2').respond({
        'result': mockTenantUsers[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users').respond({
        'result': mockTenantUsers
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users').respond({
        'result': mockTenantUsers
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/userId').respond(404);
    }
  ]);
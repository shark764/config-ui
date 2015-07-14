'use strict';

angular.module('liveopsConfigPanel.mock.content.management.users.groups', [
  'liveopsConfigPanel.mock.content'])
  .service('mockGroupUsers', function(TenantGroupUsers) {
    return [new TenantGroupUsers({
      'groupId': 'groupId1',
      'memberId': 'userId1',
      'tenantId': 'tenant-id'
    }), new TenantGroupUsers({
      'groupId': 'groupId2',
      'memberId': 'userId1',
      'tenantId': 'tenant-id'
    }), new TenantGroupUsers({
      'groupId': 'groupId1',
      'memberId': 'userId2',
      'tenantId': 'tenant-id'
    })];
  })
  .service('mockUserGroups', function(TenantUserGroups) {
    return [new TenantUserGroups({
      'groupId': 'groupId1',
      'memberId': 'userId1',
      'tenantId': 'tenant-id'
    }), new TenantUserGroups({
      'groupId': 'groupId2',
      'memberId': 'userId1',
      'tenantId': 'tenant-id'
    }), new TenantUserGroups({
      'groupId': 'groupId1',
      'memberId': 'userId2',
      'tenantId': 'tenant-id'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockGroups', 'mockGroupUsers', 'mockUserGroups', 'Session',
    function($httpBackend, apiHostname, mockGroups, mockGroupUsers, mockUserGroups, Session) {
      Session.tenant.tenantId = 'tenant-id';
      
      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users', {
        userId: 'userId1'
      }).respond(200, mockUserGroups[1]);
      
      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/groups/groupId2/users', {
        userId: 'userId1'
      }).respond(200, mockUserGroups[1]);

      $httpBackend.when('DELETE', apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users/userId1')
        .respond(200);
        
      $httpBackend.when('DELETE', apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users/userId2')
        .respond(200);
        
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId1/groups').respond({
        'result': [mockUserGroups[0], mockUserGroups[1]]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId2/groups').respond({
        'result': [mockUserGroups[2]]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users').respond({
        'result': [mockGroupUsers[0], mockGroupUsers[2]]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId2/users').respond({
        'result': [mockGroupUsers[1]]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId3/users').respond({
        'result': []
      });
    }
  ]);

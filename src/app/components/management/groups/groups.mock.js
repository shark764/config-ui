'use strict';

angular.module('liveopsConfigPanel.mock.content.management.groups', ['liveopsConfigPanel.mock.content'])
  .service('mockGroups', function(Group) {
    return [new Group({
      'id': 'groupId1',
      'name': 'groupName1',
      'tenantId': 'tenant-id'
    }), new Group({
      'id': 'groupId2',
      'name': 'groupName2',
      'tenantId': 'tenant-id'
    }), new Group({
      'id': 'groupId3',
      'name': 'groupName3',
      'description': 'Does not exist yet!',
      'tenantId': 'tenant-id'
    })];
  })
  .service('mockGroupUsers', function(TenantGroupUsers) {
    return [new TenantGroupUsers({
      'groupId': 'groupId1',
      'memberId': 'userId1'
    })];
  })
  .service('mockUserGroups', function(TenantUserGroups) {
    return [new TenantUserGroups({
      'groupId': 'groupId1',
      'memberId': 'userId1'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockGroups', 'mockGroupUsers', 'mockUserGroups',
    function($httpBackend, apiHostname, mockGroups, mockGroupUsers, mockUserGroups) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId1').respond({
        'result': mockGroups[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId2').respond({
        'result': mockGroups[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users').respond({
        'result': [mockGroupUsers[0]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId2/users').respond({
        'result': []
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId1/groups').respond({
        'result': [mockUserGroups[0]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId2/groups').respond({
        'result': []
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups').respond({
        'result': [mockGroups[0], mockGroups[1]]
      });

      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/groups').respond({
        'result': mockGroups[2]
      });

      $httpBackend.when('GET', apiHostname + '/v1/groups/groupId0').respond(404);
    }
  ]);

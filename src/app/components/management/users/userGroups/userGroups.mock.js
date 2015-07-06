'use strict';

angular.module('liveopsConfigPanel.mock.content.management.users.groups', ['liveopsConfigPanel.mock.content', 'liveopsConfigPanel.mock.content.management.users'])
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
      'memberId': 'userId1',
      'tenantId': 'tenant-id'
    })];
  })
  .service('mockUserGroups', function(TenantUserGroups) {
    return [new TenantUserGroups({
      'groupId': 'groupId1',
      'memberId': 'userId1',
      'tenantId': 'tenant-id'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockGroups', 'mockGroupUsers', 'mockUserGroups', 'Session', 'mockUsers',
    function($httpBackend, apiHostname, mockGroups, mockGroupUsers, mockUserGroups, Session, mockUsers) {
      Session.tenant.tenantId = 'tenant-id';

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/groups')
        .respond(200, mockGroups);

      $httpBackend.when('POST', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/groups')
        .respond(200, mockGroups[0]);

      $httpBackend.when('DELETE', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/groups/' + mockGroups[0].id + '/users/' + mockUsers[0].id)
        .respond(200);

    }
  ]);

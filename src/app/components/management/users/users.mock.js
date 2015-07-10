'use strict';

angular.module('liveopsConfigPanel.mock.content.management.users', ['liveopsConfigPanel.mock.content'])
  .service('mockUsers', function (User) {
    return [new User({
      'id': 'userId1',
      'status': false,
      'externalId': 73795,
      'state': 'WRAP',
      'lastName': 'Lowe',
      'firstName': 'Munoz',
      'email': 'munoz.lowe@hivedom.org'
    }), new User({
      'id': 'userId2',
      'status': true,
      'externalId': 80232,
      'state': 'NOT_READY',
      'lastName': 'Oliver',
      'firstName': 'Michael',
      'email': 'michael.oliver@ezent.io'
    })];
  })
  .service('mockUserGroups', function (TenantUserGroups) {
    return [new TenantUserGroups({
      'userId': 'userId1',
      'groupId': 'groupId1'
    }), new TenantUserGroups({
      'userId': 'userId1',
      'groupId': 'groupId1'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockUsers', 'mockUserGroups',
    function ($httpBackend, apiHostname, mockUsers, mockUserGroups) {
      $httpBackend.when('GET', apiHostname + '/v1/users/userId1?tenantId=tenant-id').respond({
        'result': mockUsers[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/users/userId2?tenantId=tenant-id').respond({
        'result': mockUsers[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/users?tenantId=tenant-id').respond({
        'result': mockUsers
      });

      $httpBackend.when('GET', apiHostname + '/v1/userId0?tenantId=tenant-id').respond(404);

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId1/groups').respond({
        'result': mockUserGroups
      });
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel.mock.content.management.users', ['liveopsConfigPanel.mock.content'])
  .service('mockUsers', function (User) {
    return [new User({
      'id': 'userId1',
      'status': 'disabled',
      'externalId': 73795,
      'lastName': 'Lowe',
      'firstName': 'Munoz',
      'email': 'munoz.lowe@hivedom.org'
    }), new User({
      'id': 'userId2',
      'status': 'enabled',
      'externalId': 80232,
      'lastName': 'Oliver',
      'firstName': 'Michael',
      'email': 'michael.oliver@ezent.io'
    }), new User({
      'id': 'userId3',
      'status': 'enabled',
      'externalId': 80233,
      'lastName': 'Moon',
      'firstName': 'Jackie',
      'email': 'jackie.moon@liveops.com',
      'displayName': 'Jackie Moon'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockUsers',
    function ($httpBackend, apiHostname, mockUsers) {
      $httpBackend.when('GET', apiHostname + '/v1/users/userId1?tenantId=tenant-id').respond({
        'result': mockUsers[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/users/userId2?tenantId=tenant-id').respond({
        'result': mockUsers[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/users?tenantId=tenant-id').respond({
        'result': mockUsers
      });

      $httpBackend.when('GET', apiHostname + '/v1/users').respond({
        'result': mockUsers
      });

      $httpBackend.when('GET', apiHostname + '/v1/userId0?tenantId=tenant-id').respond(404);
    }
  ]);
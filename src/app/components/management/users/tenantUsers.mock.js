'use strict';

angular.module('liveopsConfigPanel.mock.content.management.tenantUsers', ['liveopsConfigPanel.mock.content'])
  .service('mockTenantUsers', function (User) {
    return [new User({
      'id': 'userId1',
      'status': false,
      'externalId': 73795,
      'lastName': 'Lowe',
      'firstName': 'Munoz',
      'email': 'munoz.lowe@hivedom.org'
    }), new User({
      'id': 'userId2',
      'status': true,
      'externalId': 80232,
      'lastName': 'Oliver',
      'firstName': 'Michael',
      'email': 'michael.oliver@ezent.io'
    }), new User({
      'id': 'userId3',
      'status': true,
      'externalId': 80233,
      'lastName': 'Moon',
      'firstName': 'Jackie',
      'email': 'jackie.moon@liveops.com',
      'displayName': 'Jackie Moon'
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
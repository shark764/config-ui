'use strict';

angular.module('liveopsConfigPanel.mock.content', [])
  .value('mockRegions', [{
    'id': 'regionId1',
    'description': 'US East (N. Virginia)',
    'name': 'us-east-1'
  }])
  .value('mockLogin', {
    user: {},
    tenants: []
  })
  .run(function ($httpBackend, apiHostname, mockRegions, mockLogin, Session) {
    Session.tenant.tenantId = 'tenant-id';
    Session.user = {
      id: 'userId1'
    };
    Session.activeRegionId = mockRegions[0].id;
    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({
      'result': mockRegions
    });
    $httpBackend.when('POST', apiHostname + '/v1/login').respond({
      'result': mockLogin
    });
  });

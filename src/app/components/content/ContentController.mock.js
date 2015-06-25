'use strict';

angular.module('liveopsConfigPanel.mock.content', [])
  .value('mockRegions', [{
    'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
    'description': 'US East (N. Virginia)',
    'name': 'us-east-1'
  }])
  .value('mockLogin', {
    user: {},
    tenants: []
  })
  .value('tenantId', 'c98f5fc0-f91a-11e4-a64e-000e9992be1f')
  .run(function ($httpBackend, apiHostname, mockRegions, mockLogin, Session) {
    Session.tenant.tenantId = 'tenant-id';
    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({
      'result': mockRegions
    });
    $httpBackend.when('POST', apiHostname + '/v1/login').respond({
      'result': mockLogin
    });
  });
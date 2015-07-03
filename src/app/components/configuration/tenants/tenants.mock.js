'use strict';

angular.module('liveopsConfigPanel.mock.content.configuration.tenants', ['liveopsConfigPanel.mock.content'])
  .service('mockTenants', function (Tenant) {
    return [new Tenant({
      'id': 'tenant-id'
    }), new Tenant({
      'id': 'tenant-id-2'
    })]
  })
  .run(['$httpBackend', 'apiHostname', 'mockTenants',
    function ($httpBackend, apiHostname, mockTenants) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id').respond({
        'result': mockTenants[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id-2').respond({
        'result': mockTenants[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants?regionId=regionId1').respond({
        'result': mockTenants
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id-0').respond(404);
    }
  ]);
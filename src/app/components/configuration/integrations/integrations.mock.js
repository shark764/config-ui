'use strict';

angular.module('liveopsConfigPanel.mock.content.configuration.integrations', ['liveopsConfigPanel.mock'])
  .service('mockIntegrations', function (Integration) {
    return [new Integration({
      'id': 'integrationId1'
    }), new Integration({
      'id': 'integrationId2'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockIntegrations',
    function ($httpBackend, apiHostname, mockIntegrations) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/integrations').respond({
        'result': mockIntegrations
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/integrations/integrationId1').respond({
        'result': mockIntegrations[0]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/integrations/integrationId2').respond({
        'result': mockIntegrations[1]
      });

    }
  ]);

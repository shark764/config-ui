'use strict';

angular.module('liveopsConfigPanel.mock.content.configuration.dispatchMappings.dispatchMappingsController',
  ['liveopsConfigPanel.mock.content'])
  .value('mockDispatchMappings', [{
    'id': 'id1',
  }, {
    'id': 'id2'
  }])
  .value('mockFlows', [{
    'id': 'flow-id-1'
  }, {
    'id': 'flow-id-1'
  }])
  .value('mockIntegrations', [{
    'id': 'int-id-1'
  }, {
    'id': 'int-id-1'
  }])
  .run(function($httpBackend, mockDispatchMappings, mockFlows, mockIntegrations, Session, apiHostname) {
    Session.tenant = {
      tenantId: '1'
    };

    $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/dispatch-mappings').respond(200, {
      'result': mockDispatchMappings
    });

    $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/integrations').respond(200, {
      'result': mockIntegrations
    });

    $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows').respond(200, {
      'result': mockFlows
    });
  });
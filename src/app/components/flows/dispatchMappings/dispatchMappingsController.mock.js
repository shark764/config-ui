'use strict';

angular.module('liveopsConfigPanel.mock.content.configuration.dispatchMappings.dispatchMappingsController',
  ['liveopsConfigPanel.mock.content'])
  .value('mockDispatchMappings', [{
    'id': 'dispatchMappingId1',
  }, {
    'id': 'dispatchMappingId2'
  }])
  .run(function($httpBackend, mockDispatchMappings, Session, apiHostname) {
    $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/dispatch-mappings').respond(200, {
      'result': mockDispatchMappings
    });
    
    $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/dispatch-mappings/dispatchMappingId1').respond(200, {
      'result': mockDispatchMappings[0]
    });
    
    $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/dispatch-mappings/dispatchMappingId2').respond(200, {
      'result': mockDispatchMappings[1]
    });
    
    // $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/dispatch-mappings/dispatchMappingId1').respond(200);
  });
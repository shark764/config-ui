'use strict';

angular.module('liveopsConfigPanel.mock.content.flows.versions', [
    'liveopsConfigPanel.mock',
    'liveopsConfigPanel.mock.content.flows'
  ])
  .value('mockFlowVersions', [{
    name: 'v1',
    version: 'flowVersionId1',
    flowId: 'flowId1',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'v2',
    version: 'flowVersionId2',
    flowId: 'flowId1',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'v3',
    version: 'flowVersionId3',
    flowId: 'flowId2',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'v4',
    version: 'flowVersionId4',
    flowId: 'flowId3',
    tenantId: 'tenant-id',
    flow: '[]'
  }])
  .run(['$httpBackend', 'apiHostname', 'mockFlows', 'mockFlowVersions', 'Session',
    function ($httpBackend, apiHostname, mockFlows, mockFlowVersions, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/versions/' + mockFlowVersions[0].id).respond({
        'result': mockFlowVersions[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/versions/' + mockFlowVersions[1].id).respond({
        'result': mockFlowVersions[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[1].id + '/versions/' + mockFlowVersions[2].id).respond({
        'result': mockFlowVersions[2]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/versions').respond({
        'result': [mockFlowVersions[0], mockFlowVersions[1]]
      });

      $httpBackend.when('POST', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[2].id + '/versions').respond({
        'result': mockFlowVersions[3]
      });
    }
  ]);

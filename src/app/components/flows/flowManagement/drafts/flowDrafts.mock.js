'use strict';

angular.module('liveopsConfigPanel.mock.content.flows.drafts', [
    'liveopsConfigPanel.mock.content',
    'liveopsConfigPanel.mock.content.flows'
  ])
  .value('mockFlowDrafts', [{
    name: 'Draft 1',
    version: 'flowDraftId1',
    flowId: 'flowId1',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'Draft 2',
    version: 'flowDraftId2',
    flowId: 'flowId1',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'Draft 3',
    version: 'flowDraftId3',
    flowId: 'flowId2',
    tenantId: 'tenant-id',
    flow: '[]'
  }, {
    name: 'Draft 4',
    version: 'flowDraftId4',
    flowId: 'flowId3',
    tenantId: 'tenant-id',
    flow: '[]'
  }])
  .run(['$httpBackend', 'apiHostname', 'mockFlows', 'mockFlowDrafts', 'Session',
    function ($httpBackend, apiHostname, mockFlows, mockFlowDrafts, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/drafts/' + mockFlowDrafts[0].id).respond({
        'result': mockFlowDrafts[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/drafts/' + mockFlowDrafts[1].id).respond({
        'result': mockFlowDrafts[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[1].id + '/drafts/' + mockFlowDrafts[2].id).respond({
        'result': mockFlowDrafts[2]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[0].id + '/drafts').respond({
        'result': [mockFlowDrafts[0], mockFlowDrafts[1]]
      });

      $httpBackend.when('POST', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows/' + mockFlows[2].id + '/drafts').respond({
        'result': mockFlowDrafts[3]
      });
    }
  ]);

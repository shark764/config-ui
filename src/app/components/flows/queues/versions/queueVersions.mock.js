'use strict';

angular.module('liveopsConfigPanel.mock.content.queueversions', ['liveopsConfigPanel.mock.content'])
  .service('mockQueueVersions', ['QueueVersion', function(QueueVersion) {
    return [new QueueVersion({
      version: 'qv1',
      tenantId: 'tenant-id',
      queueId: 'queueId1'
    }), new QueueVersion({
      version: 'qv2',
      tenantId: 'tenant-id',
      queueId: 'queueId2'
    }), new QueueVersion({
      version: 'qv3',
      tenantId: 'tenant-id',
      queueId: 'queueId2'
    })];
  }])
  .run(['$httpBackend', 'apiHostname', 'mockQueueVersions', 'Session',
    function ($httpBackend, apiHostname, mockQueueVersions, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues/queueId1/versions').respond({
        'result': [mockQueueVersions[0]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues/queueId2/versions').respond({
        'result': [mockQueueVersions[1], mockQueueVersions[2]]
      });
    }
  ]);
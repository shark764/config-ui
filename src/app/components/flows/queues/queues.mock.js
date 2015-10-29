'use strict';

angular.module('liveopsConfigPanel.mock.content.queues', ['liveopsConfigPanel.mock'])
  .service('mockQueues', ['Queue', function(Queue) {
    return [new Queue({
      name: 'q1',
      tenantId: 'tenant-id',
      description: 'A pretty good queue',
      id: 'queueId1'
    }), new Queue({
      name: 'q2',
      tenantId: 'tenant-id',
      description: 'Not as cool as the other queue',
      id: 'queueId2'
    }), new Queue({
      name: 'f3',
      tenantId: 'tenant-id',
      description: 'Das queue',
      id: 'queueId3'
    })];
  }])
  .run(['$httpBackend', 'apiHostname', 'mockQueues', 'Session',
    function ($httpBackend, apiHostname, mockQueues, Session) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues/' + mockQueues[0].id).respond({
        'result': mockQueues[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues/' + mockQueues[1].id).respond({
        'result': mockQueues[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues').respond({
        'result': mockQueues
      });
      
      $httpBackend.when('POST', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/queues').respond({
        'result': mockQueues[2]
      });
    }
  ]);
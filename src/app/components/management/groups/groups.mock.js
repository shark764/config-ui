'use strict';

angular.module('liveopsConfigPanel.mock.content.management.groups', ['liveopsConfigPanel.mock.content'])
  .service('mockGroups', function(Group) {
    return [new Group({
      'id': 'groupId1',
      'name': 'groupName1',
      'tenantId': 'tenant-id'
    }), new Group({
      'id': 'groupId2',
      'name': 'groupName2',
      'tenantId': 'tenant-id'
    }), new Group({
      'id': 'groupId3',
      'name': 'groupName3',
      'tenantId': 'tenant-id'
    }), new Group({
      'id': 'groupId100',
      'name': 'groupName100',
      'description': 'Does not exist yet!',
      'tenantId': 'tenant-id'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockGroups',
    function($httpBackend, apiHostname, mockGroups) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId1').respond({
        'result': mockGroups[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId2').respond({
        'result': mockGroups[1]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/groupId3').respond({
        'result': mockGroups[2]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups').respond({
        'result': [mockGroups[0], mockGroups[1], mockGroups[2]]
      });

      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/groups').respond({
        'result': mockGroups[3]
      });

      $httpBackend.when('GET', apiHostname + '/v1/groups/groupId0').respond(404);
    }
  ]);

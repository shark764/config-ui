'use strict';

angular.module('liveopsConfigPanel.mock.content.invites', ['liveopsConfigPanel.mock.content'])
  .service('mockInvites', function (Invite) {
    return [new Invite({
      'id': 'inviteId1'
    }), new Invite({
      'id': 'inviteId2'
    })]
  })
  .run(['$httpBackend', 'apiHostname', 'mockInvites',
    function ($httpBackend, apiHostname, mockInvites) {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/invites/inviteId1').respond({
        'result': mockInvites[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/invites/inviteId2').respond({
        'result': mockInvites[1]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/invites').respond({
        'result': mockInvites
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/invites/inviteId0').respond(404);
    }
  ]);
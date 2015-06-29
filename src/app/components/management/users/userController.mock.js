'use strict';

angular.module('liveopsConfigPanel.mock.content.management.users', ['liveopsConfigPanel.mock.content'])
  .value('mockUsers', [{
    'id': 'user-id-1',
    'displayName': 'nice display name 1'
  }, {
    'id': 'user-id-2',
    'displayName': 'nice display name 2'
  }])
  .run(['$httpBackend', 'apiHostname', 'mockUsers', function ($httpBackend, apiHostname, mockUsers) {
    $httpBackend.when('GET', apiHostname + '/v1/users/' + mockUsers[0].id).respond({
      'result': mockUsers[0]
    });
    
    $httpBackend.when('GET', apiHostname + '/v1/users/' + mockUsers[1].id).respond({
      'result': mockUsers[1]
    });
    
    $httpBackend.when('GET', apiHostname + '/v1/users').respond({
      'result': mockUsers
    });
    
    $httpBackend.when('GET', apiHostname + '/v1/users/user-id-0').respond(404);
  }]);
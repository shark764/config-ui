'use strict';

describe('InvitesController', function () {
  var $scope,
    $controller,
    $httpBackend,
    mockInvites;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.invites'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.tenants'));
  
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'Invite', 'apiHostname', 'mockInvites',
    function ($rootScope, _$controller_, $injector, _Invite_, apiHostname, _mockInvites) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      mockInvites = _mockInvites;

      $httpBackend = $injector.get('$httpBackend');

      $controller('InvitesController', {
        '$scope': $scope
      });
      
      $httpBackend.flush();
    }
  ]));

  it('should return invites on fetchInvites', function () {
    var invites = $scope.fetchInvites();

    expect(invites).toBeDefined();
    expect(invites[0].email).toEqual(mockInvites[0].email);
  });

  it('should have a blank newInvite', function () {
    expect($scope.newInvite).toBeDefined();
    expect($scope.newInvite.email).toBeUndefined();
  });
});
'use strict';

describe('InvitesController', function() {
    var $scope,
        $controller,
        $httpBackend,
        Invite,
        invites,
        Session,
        tenants;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(module('gulpAngular'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Invite', 'apiHostname',
      function($rootScope, _$controller_, $injector, _Invite_, apiHostname) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Invite = _Invite_;
      invites = [new Invite({email: 'atestemail@test.com', tenantId: 1}), new Invite({email: 'foorbar@test.com', tenantId: 1})];
      Session = {tenant: {tenantId : 1}};
      tenants = [{
        id: 1,
        name: 'abc'
      }];

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', apiHostname + '/v1/tenants').respond({'result' : tenants});
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/invites').respond({'result' : invites});

      $controller('InvitesController', {'$scope': $scope, 'Session' : Session});
      $httpBackend.flush();
    }]));

    it('should have invites defined', function() {
        expect($scope.invites).toBeDefined();
        expect($scope.invites[0].email).toEqual(invites[0].email);
    });

    it('should have a blank newInvite', function() {
      expect($scope.newInvite).toBeDefined();
      expect($scope.newInvite.email).toBeUndefined();
    });

    it('should reload the invites when Session tenantId changes', function() {
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/2/invites').respond({'result' : [new Invite({email: 'someotherinvite.email.com'})]});
      $scope.newInvite = new Invite({
        tenantId : 2
      });
      $scope.$digest();
      $httpBackend.flush();

      expect($scope.invites[0].email).toEqual('someotherinvite.email.com');
    });
});

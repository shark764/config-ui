'use strict';

describe('InvitesController', function() {
    var $scope,
        $controller,
        $httpBackend,
        Invite,
        invites,
        session;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Invite', function($rootScope, _$controller_, $injector, _Invite_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Invite = _Invite_;
      invites = [new Invite({email: 'atestemail@test.com', tenantId: 1}), new Invite({email: 'foorbar@test.com', tenantId: 1})];
      session = {tenantId : 1};
      
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/invites').respond({'result' : invites});

      $controller('InvitesController', {'$scope': $scope, 'Session' : session});
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
      session.tenantId = 2;
      $scope.$digest();
      $httpBackend.flush();
      
      expect($scope.invites[0].email).toEqual('someotherinvite.email.com');
    });
});
'use strict';

describe('UserProfileController', function() {
    var $scope,
        createController,
        apiHostname,
        $httpBackend,
        user,
        User,
        Session;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(module('gulpAngular'));
    beforeEach(module('liveopsConfigPanel.mock.content'));

    beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'User', 'apiHostname', 'Session',
      function($rootScope, $controller, _$httpBackend_, _User_, _apiHostname_, _Session_) {
      $scope = $rootScope.$new();
      apiHostname = _apiHostname_;
      $httpBackend = _$httpBackend_;
      User = _User_;
      Session = _Session_;

      Session.user = { id : '12345'};
      Session.tenant = { tenantId : '123' };

      user = new User({
        id: '12345',
        firstName: 'Bob',
        lastName: 'Bobberton',
        email: 'bobbobberton@example.com',
        displayName: 'B.Bobberton'
      });

      createController = function(){
        $controller('UserProfileController', {'$scope': $scope});
      };

    }]));

    it('should load the user from the id in session', function() {
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/users/12345').respond({'result' : user});
      $httpBackend.expectGET('fakendpoint.com/v1/tenants/users/12345');
      createController();
      $httpBackend.flush();

      expect($scope.user).toBeDefined();
      expect($scope.user.id).toEqual(user.id);
    });
});

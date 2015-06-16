'use strict';

describe('UserProfileController', function() {
    var $scope,
        createController,
        apiHostname,
        $httpBackend,
        user,
        User;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(module('gulpAngular'));
    beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'User', 'apiHostname',
      function($rootScope, $controller, _$httpBackend_, _User_, _apiHostname_) {
      $scope = $rootScope.$new();
      apiHostname = _apiHostname_;
      $httpBackend = _$httpBackend_;
      User = _User_;

      user = new User({
        id: '12345',
        firstName: 'Bob',
        lastName: 'Bobberton',
        email: 'bobbobberton@example.com',
        displayName: 'B.Bobberton'
      });

      createController = function(){
        $controller('UserProfileController', {'$scope': $scope, 'Session' : {user : { id : '12345'}}});
      };

    }]));

    it('should load the user from the id in session', function() {
      $httpBackend.when('GET', 'fakendpoint.com/v1/users/12345').respond({'result' : user});
      $httpBackend.expectGET('fakendpoint.com/v1/users/12345');
      createController();
      $httpBackend.flush();

      expect($scope.user).toBeDefined();
      expect($scope.user.id).toEqual(user.id);
    });
});
'use strict';

describe('UserProfileController', function() {
    var $scope,
        createController,
        $httpBackend,
        user,
        User;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'User', function($rootScope, $controller, _$httpBackend_, _User_) {
      $scope = $rootScope.$new();
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
        $controller('UserProfileController', {'$scope': $scope, 'Session' : {id : '12345'}});
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
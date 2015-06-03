'use strict';

/* global spyOn: false  */

describe('UserProfileController', function() {
    var $scope,
        createController,
        $httpBackend,
        user;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$httpBackend', function($rootScope, $controller, _$httpBackend_) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      
      user = {
        id: '12345',
        firstName: 'Bob',
        lastName: 'Bobberton',
        email: 'bobbobberton@example.com',
        displayName: 'B.Bobberton'
      };
      
      createController = function(){
        $controller('UserProfileController', {'$scope': $scope, 'Session' : {id : '12345'}});
      }

    }]));

    it('should load the user from the id in session', function() {
      $httpBackend.when('GET', 'fakendpoint.com/v1/users/12345').respond({'result' : user});
      $httpBackend.expectGET('fakendpoint.com/v1/users/12345');
      createController();
      $httpBackend.flush();
       
      expect($scope.user).toBeDefined();
      expect($scope.user).toEqual(user);
    });
});
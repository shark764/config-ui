'use strict';

describe('UserProfileController', function() {
    var $scope,
        $controller,
        apiHostname,
        $httpBackend,
        user,
        skill,
        group;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(module('gulpAngular'));
    beforeEach(module('liveopsConfigPanel.mock.content'));

    beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'User', 'Skill', 'Group', 'apiHostname', 'Session',
      function($rootScope, _$controller_, _$httpBackend_, User, Skill, Group, _apiHostname_, Session) {
      $scope = $rootScope.$new();
      apiHostname = _apiHostname_;
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;

      Session.user = { id : '12345'};
      Session.tenant = { tenantId : '123' };
      skill = [];
      group = [];

      skill.push(new Skill({
        id: '123456',
        name: 'A skill',
        proficiency: 90
      }));

      group.push(new Group({
        id: '1234567890',
        name: 'Tadah'
      }));

      user = new User({
        id: '12345',
        firstName: 'Bob',
        lastName: 'Bobberton',
        email: 'bobbobberton@example.com',
        displayName: 'B.Bobberton'
      });

      $httpBackend.when('GET', apiHostname + '/v1/users/12345').respond({'result' : user});
      $httpBackend.when('GET', apiHostname + '/v1/tenants/123/users/12345/skills').respond({'result' : skill});
      $httpBackend.when('GET', apiHostname + '/v1/tenants/123/users/12345/groups').respond({'result' : group});
    }]));

    it('should load the user from the id in session', function() {
      
      $httpBackend.expectGET('fakendpoint.com/v1/users/12345');
      $httpBackend.expectGET('fakendpoint.com/v1/tenants/123/users/12345/skills');
      $httpBackend.expectGET('fakendpoint.com/v1/tenants/123/users/12345/groups');
      $controller('UserProfileController', {'$scope': $scope});
      $httpBackend.flush();

      expect($scope.user).toBeDefined();
      expect($scope.user.id).toEqual(user.id);

      expect($scope.userSkills).toBeDefined();
      expect($scope.userGroups).toBeDefined();

    });
    
    describe ('save function', function(){
      beforeEach(function(){
        $controller('UserProfileController', {'$scope': $scope});
        $httpBackend.flush();
        $scope.userForm = jasmine.createSpyObj('userForm', ['$setPristine', '$setUntouched']);
      });
      
      it('should call user save', function() {
        spyOn($scope.user, 'save');
        $scope.save();
        expect($scope.user.save).toHaveBeenCalled();
      });
      
      it('should show success alert on success', inject(['Alert', function(Alert) {
        spyOn($scope.user, 'save').and.callFake(function(success){
          success(user);
        });
        
        spyOn(Alert, 'success');
        $scope.save();
        expect(Alert.success).toHaveBeenCalled();
      }]));
      
      it('should show error alert on success', inject(['Alert', function(Alert) {
        spyOn($scope.user, 'save').and.callFake(function(success, fail){
          fail();
        });
        
        spyOn(Alert, 'error');
        $scope.save();
        expect(Alert.error).toHaveBeenCalled();
      }]));
    });
});

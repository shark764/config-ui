'use strict';

/* global spyOn: false  */
describe('userDetails directive', function () {
  var $scope,
    $compile,
    element,
    user,
    isolateScope,
    UserService;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', 'UserService', function (_$compile_, _$rootScope_, _UserService_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    UserService = _UserService_;
    
    user =  {
        firstName: 'Don',
        lastName: 'Cherry',
        displayName: 'Don C.',
        state: 'offline',
        createdBy: '32jasdlfjk-23ljdsfa',
        created: '2015-08-01'
      };
    
    $scope.user = user;
    
    element = $compile('<user-details user="user">')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should have user equal to given user', inject(function() {
    expect(isolateScope.user).toEqual(user);
  }));
  
  it('should catch the user:create event and reset', inject(function() {
    spyOn(isolateScope, 'reset');
    $scope.$broadcast('user:create');
    expect(isolateScope.reset).toHaveBeenCalled();
  }));

  it('should have states, statuses, roles', inject(function() {
    expect(isolateScope.userStates).toBeDefined();
    expect(isolateScope.userStatuses).toBeDefined();
    expect(isolateScope.userRoles).toBeDefined();
  }));
  
  describe('trimmedUser function', function () {
    var user;
    beforeEach(function(){
      user = {firstName: 'Alice', lastName: 'White', 'role' : 'user', email: 'something@place.com', 'displayName': 'A. White', status: 'offline', password: 'pass', 'state': true};
    });
    
    it('should not return extra properties', inject(function() {
      user.favouriteColor = 'yellow';
      var trimmed = isolateScope.trimmedUser(user);
      expect(trimmed.favouriteColor).toBeUndefined();
    }));
    
    it('should not return externalId field if null', inject(function() {
      var trimmed = isolateScope.trimmedUser(user);
      expect(trimmed.externalId).toBeUndefined();
    }));
    
    it('should return externalId field if not null', inject(function() {
      user.externalId = '12345';
      var trimmed = isolateScope.trimmedUser(user);
      expect(trimmed.externalId).toEqual('12345');
    }));
  });
  
  describe('save function', function () {
    it('should update the user if the user already exists', inject(function() {
      spyOn(UserService, 'update').and.callThrough();
      
      $scope.user.id = '1234';
      isolateScope.save();
      expect(UserService.update).toHaveBeenCalled();
    }));
    
    it('should add a new user if the user doesn\'t yet exist', inject(function() {
      spyOn(UserService, 'save').and.callThrough();
      isolateScope.save();
      expect(UserService.save).toHaveBeenCalled();
    }));
  });
  
  describe('reset function', function () {
    it('should set the user status to false', inject(function() {
      isolateScope.reset();
      expect(isolateScope.user.status).toBeFalsy();
    }));
    
    it('should set the user state to OFFLINE', inject(function() {
      isolateScope.reset();
      expect(isolateScope.user.state).toEqual('OFFLINE');
    }));
  });
});

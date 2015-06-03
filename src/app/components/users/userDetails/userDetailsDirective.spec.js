'use strict';

/* global spyOn: false  */
describe('userDetails directive', function () {
  var $scope,
    $compile,
    element,
    user,
    isolateScope,
    User;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', 'User', function (_$compile_, _$rootScope_, _User_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    User = _User_;

    user =  new User({
        firstName: 'Don',
        lastName: 'Cherry',
        displayName: 'Don C.',
        state: 'offline',
        createdBy: '32jasdlfjk-23ljdsfa',
        created: '2015-08-01'
      });

    $scope.user = user;

    element = $compile('<user-details user="user">')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should have user equal to given user', inject(function() {
    expect(isolateScope.user).toEqual(user);
  }));

  it('should have states, statuses, roles', inject(function() {
    expect(isolateScope.userStates).toBeDefined();
    expect(isolateScope.userStatuses).toBeDefined();
    expect(isolateScope.userRoles).toBeDefined();
  }));

  describe('save function', function () {
    it('should update the user if the user already exists', inject(function() {
      spyOn(User, 'update').and.callThrough();

      $scope.user.id = '1234';
      isolateScope.save();
      expect(User.update).toHaveBeenCalled();
    }));

    it('should add a new user if the user doesn\'t yet exist', inject(function() {
      spyOn(User, 'save').and.callThrough();
      isolateScope.save();
      expect(User.save).toHaveBeenCalled();
    }));
  });

});

'use strict';

describe('userGroupBulkAction directive', function() {
  var $scope,
    $httpBackend,
    apiHostname,
    element,
    isolateScope,
    mockGroups,
    mockUsers,
    UserGroupBulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.user.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.group.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.group.mock'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'mockGroups', 'mockUsers', 'UserGroupBulkAction', 'apiHostname',
    function($compile, $rootScope, _$httpBackend, _mockGroups, _mockUsers, _UserGroupBulkAction, _apiHostname) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      mockGroups = _mockGroups;
      mockUsers = _mockUsers;
      UserGroupBulkAction = _UserGroupBulkAction;

      $scope.users = [mockUsers[0], mockUsers[1]];

      element = $compile('<ba-user-groups users="users"></ba-user-groups>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      $httpBackend.flush();
    }
  ]));

  it('should register the bulkAction with bulkActionExecutor if present', inject(function($compile, $rootScope) {
    element = $compile('<bulk-action-executor></bulk-action-executor>')($scope);
    $scope.$digest();
    var baExecutorController = element.controller('bulkActionExecutor');
    spyOn(baExecutorController, 'register');
    
    var childElement = angular.element('<ba-user-groups users="users"></ba-user-groups>');
    element.append(childElement);
    var childScope = $rootScope.$new();
    childElement = $compile(childElement)(childScope);
    childScope.$digest();

    expect(baExecutorController.register).toHaveBeenCalled();
  }));

  describe('ON bulkAction.execute', function() {
    it('should override bulkAction.execute', function() {
      expect(isolateScope.bulkAction.execute).toBeDefined();
    });

    it('should should call userkillBulkAction.selectedType.execute when user doesQualify', function() {
      spyOn(isolateScope.bulkAction.userGroupBulkActions[0].selectedType, 'execute');
      spyOn(isolateScope.bulkAction.userGroupBulkActions[0].selectedType, 'doesQualify').and.returnValue(true);

      isolateScope.bulkAction.execute([mockUsers[0]]);

      expect(isolateScope.bulkAction.userGroupBulkActions[0].selectedType.execute).toHaveBeenCalled();
    });

    it('should not call userGroupBulkAction.selectedType.execute if user !doesQualify', function() {
      spyOn(isolateScope.bulkAction.userGroupBulkActions[0].selectedType, 'execute');
      spyOn(isolateScope.bulkAction.userGroupBulkActions[0].selectedType, 'doesQualify').and.returnValue(false);

      isolateScope.bulkAction.execute([mockUsers[1]]);

      expect(isolateScope.bulkAction.userGroupBulkActions[0].selectedType.execute).not.toHaveBeenCalled();
    });
  });

  describe('ON bulkAction.canExecute', function() {
    it('should override bulkAction.canExecute', function() {
      expect(isolateScope.bulkAction.canExecute).toBeDefined();
    });

    it('should return false when no userGroupBulkActions exist', function() {
      isolateScope.bulkAction.userGroupBulkActions = [];

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeFalsy();
    });

    it('should return false when a userGroupBulkAction\'s canExecute fails', function() {
      var userGroupBulkAction = new UserGroupBulkAction();
      isolateScope.bulkAction.userGroupBulkActions.push(userGroupBulkAction);

      isolateScope.bulkAction.userGroupBulkActions[1].selectedType.canExecute =
        jasmine.createSpy().and.callFake(function(action) {
          return action === userGroupBulkAction;
        });

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeFalsy();
    });

    it('should return true when a userGroupBulkAction\'s canExecute succeeds', function() {
      var userGroupBulkAction = new UserGroupBulkAction();
      isolateScope.bulkAction.userGroupBulkActions.push(userGroupBulkAction);

      isolateScope.bulkAction.userGroupBulkActions[0].selectedType.canExecute =
        jasmine.createSpy().and.returnValue(true);

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeTruthy();
    });
  });

  describe('ON removeUserGroupBulkAction', function() {
    it('should be defined', function() {
      expect(isolateScope.removeUserGroupBulkAction).toBeDefined();
    });

    it('should remove item from userGroupBulkActions on call', function() {
      expect(isolateScope.bulkAction.userGroupBulkActions.length).toEqual(1);

      isolateScope.removeUserGroupBulkAction(isolateScope.bulkAction.userGroupBulkActions[0]);

      expect(isolateScope.bulkAction.userGroupBulkActions.length).toEqual(0);
    });
  });

  describe('ON addUserGroupBulkAction', function() {
    it('should be defined', function() {
      expect(isolateScope.addUserGroupBulkAction).toBeDefined();
    });

    it('should add item to userGroupBulkActions on call', function() {
      expect(isolateScope.bulkAction.userGroupBulkActions.length).toEqual(1);

      isolateScope.addUserGroupBulkAction();

      expect(isolateScope.bulkAction.userGroupBulkActions.length).toEqual(2);
    });
  });

  describe('ON fetchGroups', function() {
    it('should query Groups if the current type is not "remove"', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups').respond(200, {
        result: [mockGroups[0], mockGroups[1]]
      });
      
      isolateScope.fetchGroups();
      $httpBackend.flush();
      expect(isolateScope.availableGroups).toBeDefined();
      expect(isolateScope.availableGroups.length).toBe(2);
    });
  });
});

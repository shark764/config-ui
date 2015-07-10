'use strict';

describe('userGroupBulkAction directive', function() {
  var $scope,
    $compile,
    $httpBackend,
    element,
    isolateScope,
    BulkAction,
    mockGroups,
    mockUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));
  
  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'BulkAction', 'mockGroups', 'mockUsers',
    function (_$compile_, _$rootScope_, _$httpBackend, _BulkAction, _mockGroups, _mockUsers) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $httpBackend = _$httpBackend;
      BulkAction = _BulkAction;
      mockGroups = _mockGroups;
      mockUsers = _mockUsers;
  }]));

  beforeEach(function () {
    $scope.bulkAction = new BulkAction();
    $scope.users = mockUsers;
    
    element = $compile('<ba-user-groups users="users" bulk-action="bulkAction"></ba-user-groups>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
    $httpBackend.flush();
  });
  
  describe('calling execute with userGroupBulkAction type "add"', function() {
    it('should override bulkAction.execute', function() {
      expect(isolateScope.bulkAction.execute).toBeDefined();
      expect(isolateScope.bulkAction.canExecute).toBeDefined();
    });
    
    it('should should call userGroupBulkAction.selectedType.execute when user doesQualify', inject([function() {
      spyOn(isolateScope.userGroupBulkActions[0].selectedType, 'execute');
      isolateScope.userGroupBulkActions[0].selectedGroup = isolateScope.groups[0];
      isolateScope.bulkAction.execute(mockUsers[0]);
      
      expect(isolateScope.userGroupBulkActions[0].selectedType.execute).not.toHaveBeenCalled();
    }]));
    
    it('should not call userGroupBulkAction.selectedType.execute if user !doesQualify', inject([function() {
      spyOn(isolateScope.userGroupBulkActions[0].selectedType, 'execute');
      isolateScope.userGroupBulkActions[0].selectedGroup = isolateScope.groups[0];
      isolateScope.bulkAction.execute(mockUsers[1]);
      
      expect(isolateScope.userGroupBulkActions[0].selectedType.execute).toHaveBeenCalled();
    }]));
    
    it('should not call doesQualify or execute if canExecute does not pass', inject([function() {
      spyOn(isolateScope.userGroupBulkActions[0].selectedType, 'doesQualify');
      spyOn(isolateScope.userGroupBulkActions[0].selectedType, 'execute');
      isolateScope.bulkAction.execute(mockUsers[0]);
      
      expect(isolateScope.userGroupBulkActions[0].selectedType.doesQualify).not.toHaveBeenCalled();
      expect(isolateScope.userGroupBulkActions[0].selectedType.execute).not.toHaveBeenCalled();
    }]));
    
    it('should call fetchUserGroups on all userGroupBulkAction.selectedType.executes success', inject([function() {
      isolateScope.userGroupBulkActions[0].selectedGroup = isolateScope.groups[0];
      isolateScope.bulkAction.execute(mockUsers[0]);
      
      $httpBackend.flush();
    }]));
  });
  
  describe('calling execute with userGroupBulkAction type "remove"', function() {
    beforeEach(inject(['userGroupBulkActionTypes', function(userGroupBulkActionTypes) {
      isolateScope.userGroupBulkActions[0].selectedType = userGroupBulkActionTypes[1]
    }]));
    
    it('should override bulkAction.execute', function() {
      expect(isolateScope.bulkAction.execute).toBeDefined();
      expect(isolateScope.bulkAction.canExecute).toBeDefined();
    });
    
    it('should should call userGroupBulkAction.selectedType.execute when user doesQualify', inject([function() {
      spyOn(isolateScope.userGroupBulkActions[0].selectedType, 'execute');
      isolateScope.userGroupBulkActions[0].selectedGroup = isolateScope.groups[0];
      isolateScope.bulkAction.execute(mockUsers[0]);
      
      expect(isolateScope.userGroupBulkActions[0].selectedType.execute).toHaveBeenCalled();
    }]));
    
    it('should not call userGroupBulkAction.selectedType.execute if user !doesQualify', inject([function() {
      spyOn(isolateScope.userGroupBulkActions[0].selectedType, 'execute');
      isolateScope.userGroupBulkActions[0].selectedGroup = isolateScope.groups[0];
      isolateScope.bulkAction.execute(mockUsers[1]);
      
      expect(isolateScope.userGroupBulkActions[0].selectedType.execute).not.toHaveBeenCalled();
    }]));
    
    it('should not call doesQualify or execute if canExecute does not pass', inject([function() {
      spyOn(isolateScope.userGroupBulkActions[0].selectedType, 'doesQualify');
      spyOn(isolateScope.userGroupBulkActions[0].selectedType, 'execute');
      isolateScope.bulkAction.execute(mockUsers[0]);
      
      expect(isolateScope.userGroupBulkActions[0].selectedType.doesQualify).not.toHaveBeenCalled();
      expect(isolateScope.userGroupBulkActions[0].selectedType.execute).not.toHaveBeenCalled();
    }]));
  });
  
  describe('calling canExecute', function() {
    it('should return false when no group is selected.', inject([function() {
      var canExecute = isolateScope.bulkAction.canExecute();
      expect(canExecute).toBeFalsy();
    }]));
    
    it('should return false when no userGroupBulkActions exist', inject([function() {
      isolateScope.userGroupBulkActions[0].selectedGroup = isolateScope.groups[0];
      isolateScope.removeUserGroupBulkAction(isolateScope.userGroupBulkActions[0]);
      
      var canExecute = isolateScope.bulkAction.canExecute();
      expect(canExecute).toBeFalsy();
    }]));
    
    it('should return true when has userGroupBulkAction and group is selected', inject([function() {
      isolateScope.userGroupBulkActions[0].selectedGroup = isolateScope.groups[0];
      var canExecute = isolateScope.bulkAction.canExecute();
      expect(canExecute).toBeTruthy();
    }]));
    
    it('should return false when at least one userGroupBulkAction.canExecute fails', inject([function() {
      isolateScope.userGroupBulkActions[0].selectedGroup = isolateScope.groups[0];
      isolateScope.addUserGroupBulkAction();
      
      var canExecute = isolateScope.bulkAction.canExecute();
      expect(canExecute).toBeFalsy();
    }]));
  });
  
  describe('calling refreshAffectedUsers', function() {
    it('should should add userId2 to the list of usersAffected on "add"', function() {
      isolateScope.userGroupBulkActions[0].selectedGroup = isolateScope.groups[0];
      isolateScope.users[0].checked = true;
      isolateScope.users[1].checked = true;
      
      isolateScope.refreshAllAffectedUsers();
      
      expect(isolateScope.userGroupBulkActions[0].usersAffected).toBeDefined();
      expect(isolateScope.userGroupBulkActions[0].usersAffected.length).toEqual(1);
      expect(isolateScope.userGroupBulkActions[0].usersAffected[0]).toBe(isolateScope.users[1]);
    });
    
    describe('with userGroupBulkAction type "remove"', function() {
      beforeEach(inject(['userGroupBulkActionTypes', function(userGroupBulkActionTypes) {
        isolateScope.userGroupBulkActions[0].selectedType = userGroupBulkActionTypes[1];
      }]));
      
      it('should should add userId1 to the list of usersAffected on "remove"', function() {
        isolateScope.userGroupBulkActions[0].selectedGroup = isolateScope.groups[0];
        isolateScope.users[0].checked = true;
        isolateScope.users[1].checked = true;
        
        isolateScope.refreshAllAffectedUsers();
        
        expect(isolateScope.userGroupBulkActions[0].usersAffected).toBeDefined();
        expect(isolateScope.userGroupBulkActions[0].usersAffected.length).toEqual(1);
        expect(isolateScope.userGroupBulkActions[0].usersAffected[0]).toBe(isolateScope.users[0]);
      });
    });
  });
});
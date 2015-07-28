'use strict';

describe('bulkActionExecutor directive', function () {
  var $scope,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.shared.directives.bulkAction'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));

  beforeEach(inject(['$rootScope', function ($rootScope) {
    $scope = $rootScope.$new();
  }]));

  beforeEach(inject(['$compile', 'BulkAction', 'mockBulkActions', 'mockUsers',
    function ($compile, BulkAction, mockBulkActions, mockUsers) {
      $scope.items = mockUsers;
      $scope.items[0].checked = true;
      $scope.items[1].checked = true;
      $scope.items[2].checked = false;

      $scope.bulkActions = mockBulkActions;
      $scope.showBulkActions = true;
      
      var element = $compile('<bulk-action-executor items="items" bulk-actions="bulkActions" show-bulk-actions="showBulkActions"></bulk-action-executor>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  describe('ON execute', function () {
    it('should call execute for all checked items', inject(['$httpBackend',
      function ($httpBackend) {
        isolateScope.execute();
        $httpBackend.flush();

        expect(isolateScope.bulkActions[0].execute).toHaveBeenCalledWith([
          isolateScope.items[0],
          isolateScope.items[1]
        ]);
        expect(isolateScope.bulkActions[1].execute).not.toHaveBeenCalled();
      }
    ]));

    it('should not call execute for unchecked bulkAction', inject(['$httpBackend',
      function ($httpBackend) {
        isolateScope.execute();
        $httpBackend.flush();

        expect(isolateScope.bulkActions[1].execute).not.toHaveBeenCalled();
      }
    ]));

    it('should call Alert when all promises resolve', inject(['$httpBackend', 'Alert',
      function ($httpBackend, Alert) {
        spyOn(Alert, 'success');

        isolateScope.execute();
        $httpBackend.flush();

        expect(Alert.success).toHaveBeenCalled();
      }
    ]));
  });

  it('should have a function to null the list of bulk actions', function () {
    isolateScope.showBulkActions = true;

    isolateScope.closeBulk();

    expect(isolateScope.showBulkActions).toBeFalsy();
  });

  describe('ON canExecute', function () {
    it('should return false if no bulkActions are checked', function () {
      isolateScope.bulkActions[0].checked = false;
      isolateScope.bulkActions[1].checked = false;

      isolateScope.bulkActions[0].canExecute = jasmine.createSpy();
      isolateScope.bulkActions[1].canExecute = jasmine.createSpy();

      var canExecute = isolateScope.canExecute();

      expect(canExecute).toBeFalsy();
      expect(isolateScope.bulkActions[0].canExecute).not.toHaveBeenCalled();
      expect(isolateScope.bulkActions[1].canExecute).not.toHaveBeenCalled();
    });

    it('should return false any checked bulkAction.canExecute returns false', function () {
      isolateScope.bulkActions[0].checked = true;
      isolateScope.bulkActions[1].checked = true;

      isolateScope.bulkActions[0].canExecute = jasmine.createSpy().and.returnValue(true);
      isolateScope.bulkActions[1].canExecute = jasmine.createSpy().and.returnValue(false);

      var canExecute = isolateScope.canExecute();

      expect(canExecute).toBeFalsy();
      expect(isolateScope.bulkActions[0].canExecute).toHaveBeenCalled();
      expect(isolateScope.bulkActions[1].canExecute).toHaveBeenCalled();
    });

    it('should return false any checked bulkAction.canExecute returns false', function () {
      isolateScope.bulkActions[0].checked = true;
      isolateScope.bulkActions[1].checked = true;

      isolateScope.bulkActions[0].canExecute = jasmine.createSpy().and.returnValue(true);
      isolateScope.bulkActions[1].canExecute = jasmine.createSpy().and.returnValue(true);

      var canExecute = isolateScope.canExecute();

      expect(canExecute).toBeTruthy();
      expect(isolateScope.bulkActions[0].canExecute).toHaveBeenCalled();
      expect(isolateScope.bulkActions[1].canExecute).toHaveBeenCalled();
    });
  });

  describe('ON selectedItems', function () {
    it('should return all checked items', function() {
      var checkedItems = isolateScope.selectedItems();
      expect(checkedItems.length).toEqual(2);
    });
    
    it('should never break the $scope.checkedItems reference', function() {
      var scopeCheckedItems = isolateScope.checkedItems;
      var checkedItems = isolateScope.selectedItems();
      expect(checkedItems).toBe(checkedItems);
    });
  });
  
  describe('showBulkActions watch', function () {
    it('should call reset form is showBulkActions becomes false', function () {
      spyOn(isolateScope, 'resetForm');
      isolateScope.showBulkActions = false;
      isolateScope.$digest();
      
      expect(isolateScope.resetForm).toHaveBeenCalled();
    });

    it('should not reset the form if showBulkActions becomes true', function () {
      spyOn(isolateScope, 'resetForm');
      isolateScope.showBulkActions = true;
      isolateScope.$digest();
      
      expect(isolateScope.resetForm).not.toHaveBeenCalled();
    });
  });
});
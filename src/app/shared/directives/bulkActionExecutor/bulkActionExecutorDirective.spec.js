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

      var element = $compile('<bulk-action-executor items="items" bulk-actions="bulkActions"></bulk-action-executor>')($scope);
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

  describe('ON updateDropDown', function () {
    var $timeout;

    beforeEach(inject(['$timeout', function (_$timeout) {
      $timeout = _$timeout;

      isolateScope.updateDropDown(jasmine.any(Object), isolateScope.items[0]);
      isolateScope.updateDropDown(jasmine.any(Object), isolateScope.items[1]);
      isolateScope.updateDropDown(jasmine.any(Object), isolateScope.items[2]);
      $timeout.flush();
    }]));

    it('should have checkedItems equal to items checked on load', function () {
      expect(isolateScope.checkedItems.length).toEqual(2);
    });

    it('should add item to checkedItems if checked', function () {
      isolateScope.items[2].checked = true;
      isolateScope.updateDropDown(jasmine.any(Object), isolateScope.items[2]);
      $timeout.flush();

      expect(isolateScope.checkedItems.length).toEqual(3);
    });

    it('should not add item to checkedItems if not checked', function () {
      isolateScope.items[1].checked = false;
      isolateScope.updateDropDown(jasmine.any(Object), isolateScope.items[1]);
      $timeout.flush();

      expect(isolateScope.checkedItems.length).toEqual(1);
    });
  });
});
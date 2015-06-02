'use strict';

/* global spyOn: false */
describe('EditFieldController', function() {
    var $scope;

    beforeEach(module('liveopsConfigPanel'));

    beforeEach(inject(['$rootScope', '$controller', function($rootScope, $controller) {
      $scope = $rootScope.$new();
      $controller('EditFieldController', {'$scope': $scope});
    }]));

    it('should catch the save event and disable edit', inject(function() {
      $scope.edit = true;
      $scope.name = 'name';
      $scope.$broadcast('name:save');
      
      expect($scope.edit).toBeFalsy();
    }));
    
    describe('saveHandler function', function() {
      it('should blur the element on save', inject(function() {
        var wasCalled = false;
        
        var event = {
            target : {
              blur : function(){wasCalled = true;}
            }
        };
        
        $scope.saveHandler(event);
        expect(wasCalled).toBeTruthy();
      }));
      
      it('should emit the editField:save event', inject(function() {
        $scope.objectId = 1;
        $scope.name = 'name';
        $scope.ngModel = 'value';
        
        spyOn($scope, '$emit');
        $scope.saveHandler();
        
        expect($scope.$emit).toHaveBeenCalledWith('editField:save', {objectId: 1, fieldName: 'name', fieldValue: 'value'});
      }));
    });
});
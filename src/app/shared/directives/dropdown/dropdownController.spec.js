'use strict';

/* global jasmine, spyOn: false */
describe('DropdownController', function() {
    var $scope,
        $document;

    beforeEach(module('liveopsConfigPanel'));

    beforeEach(inject(['$rootScope', '$controller', '$document', function($rootScope, $controller, _$document_) {
      $scope = $rootScope.$new();
      $document = _$document_;
      $controller('DropdownController', {'$scope': $scope, '$element' : {}});
    }]));

    it('should hide the dropdown to start', inject(function() {
      expect($scope.showDrop).toBeFalsy();
    }));
    
    it('should attach the click listener when showDrop becomes true', inject(function() {
      spyOn($document, 'on');
      $scope.showDrop = false;
      $scope.$digest();
      $scope.showDrop = true;
      $scope.$digest();
      expect($document.on).toHaveBeenCalledWith('click', jasmine.any(Function));
    }));
    
    it('should remove the click listener when showDrop becomes false', inject(function() {
      spyOn($document, 'off');
      $scope.showDrop = true;
      $scope.$digest();
      $scope.showDrop = false;
      $scope.$digest();
      expect($document.off).toHaveBeenCalledWith('click', jasmine.any(Function));
    }));
});
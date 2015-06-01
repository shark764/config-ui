'use strict';

describe('UsersController', function() {
    var $scope,
        $controller,
        controller;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', function($rootScope, _$controller_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      controller = $controller('UsersController', {'$scope': $scope});
    }]));
    
    it('should exist', function(){
      expect(controller).toBeDefined();
    });
});
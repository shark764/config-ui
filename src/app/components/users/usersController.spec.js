'use strict';

describe('UsersController', function() {
    var $scope,
        $controller,
        controller,
        Session;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', function($rootScope, _$controller_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Session = {collapseSideMenu: true};
      controller = $controller('UsersController', {'$scope': $scope, 'Session' : Session});
    }]));
    
    it('should exist', function(){
      expect(controller).toBeDefined();
    });
    
    it('should initialize menuCollapsed', function(){
      expect($scope.menuCollapsed).toBeDefined();
      expect($scope.menuCollapsed).toBeTruthy();
    });
});
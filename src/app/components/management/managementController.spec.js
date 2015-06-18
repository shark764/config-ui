'use strict';

describe('ManagementController', function () {
  var $scope,
    $controller,
    $state;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', '$controller', '$state',
    function ($rootScope, _$controller_, _$state_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $state = _$state_;
      
      $controller('ManagementController', {'$scope': $scope, '$state': $state});
    }
  ]));

  it('should declare sidebarConfig', function () {
    expect($scope.sidebarConfig).toBeDefined();
  });
});
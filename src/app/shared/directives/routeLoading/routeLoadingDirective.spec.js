'use strict';

describe('routeLoading directive', function() {
  var $scope,
    $rootScope,
    element;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, _$rootScope) {
    $rootScope = _$rootScope;
    $scope = $rootScope.$new();

    element = $compile('<route-loading-indicator></route-loading-indicator>')($scope);
    $scope.$digest();
  }]));


  it('should set isRouteLoading to true on recieving $stateChangeStart event', inject(function($timeout) {
    expect($scope.isRouteLoading).toBeFalsy();

    $rootScope.$broadcast('$stateChangeStart', 'fakeState', {}, 'fakeState', {});
    $scope.$digest();
    $timeout.flush();

    expect($scope.isRouteLoading).toBeTruthy();
  }));
  
  it('should set isRouteLoading to false on recieving $stateChangeSuccess event', function() {
    $scope.isRouteLoading = true;

    $rootScope.$broadcast('$stateChangeSuccess', 'fakeState', {}, 'fakeState', {});
    $scope.$digest();

    expect($scope.isRouteLoading).toBeFalsy();
  });
});

'use strict';

describe('ContentController', function () {
  var $scope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$rootScope', '$controller',
    function ($rootScope, $controller) {
      $scope = $rootScope.$new();

      $controller('ContentController', {
        '$scope': $scope
      });
    }
  ]));

  it('should catch the table create event and hide bulk actions panel', inject(['$rootScope', function ($rootScope) {
    $scope.showBulkActions = true;
    $rootScope.$broadcast('table:on:click:create');
    $scope.$digest();
    expect($scope.showBulkActions).toBeFalsy();
  }]));

  it('should catch the item selected event and hide bulk actions panel', inject(['$rootScope', function ($rootScope) {
    $scope.showBulkActions = true;
    $rootScope.$broadcast('table:resource:selected');
    $scope.$digest();
    expect($scope.showBulkActions).toBeFalsy();
  }]));

  it('should catch the action button click event and show the bulk action panel', inject(['$rootScope', function ($rootScope) {
    $scope.showBulkActions = false;
    $rootScope.$broadcast('table:on:click:actions');
    $scope.$digest();
    expect($scope.showBulkActions).toBeTruthy();
  }]));

  it('should show an alert info if the messageKey url param is defined', inject(['$stateParams', 'Alert', '$controller', function ($stateParams, Alert, $controller) {
    spyOn(Alert, 'info');
    $stateParams.messageKey = 'message.key.value';
    $controller('ContentController', {
      '$scope': $scope
    });
    expect(Alert.info).toHaveBeenCalledWith('message.key.value', '', jasmine.any(Object));
  }]));

  it('should reset the queryCache if Session tenant changes', inject(['queryCache', 'Session',
    function (queryCache, Session) {
      spyOn(queryCache, 'removeAll');
      $scope.$digest();
      
      Session.tenant = {
        tenantId: 'anotherId'
      };

      $scope.$digest();
      expect(queryCache.removeAll).toHaveBeenCalled();
    }
  ]));
});
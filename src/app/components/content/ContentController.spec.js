'use strict';

describe('ContentController', function() {
  var $scope,
    loEvents,
    $rootScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$rootScope', '$controller', 'loEvents',
    function(_$rootScope, $controller, _loEvents) {
      $rootScope = _$rootScope;
      $scope = $rootScope.$new();

      loEvents = _loEvents;

      $controller('ContentController', {
        '$scope': $scope
      });
    }
  ]));

  it('should catch the table create event and hide bulk actions panel', function() {
    $scope.showBulkActions = true;
    $rootScope.$broadcast(loEvents.tableControls.itemCreate);
    $scope.$digest();
    expect($scope.showBulkActions).toBeFalsy();
  });

  it('should catch the item selected event and hide bulk actions panel', function() {
    $scope.showBulkActions = true;
    $rootScope.$broadcast(loEvents.tableControls.itemSelected);
    $scope.$digest();
    expect($scope.showBulkActions).toBeFalsy();
  });

  it('should catch the action button click event and show the bulk action panel', function() {
    $scope.showBulkActions = false;
    $rootScope.$broadcast(loEvents.tableControls.actions);
    $scope.$digest();
    expect($scope.showBulkActions).toBeTruthy();
  });

  it('should show an alert info if the messageKey url param is defined', inject(function($stateParams, Alert, $controller) {
    spyOn(Alert, 'info');
    $stateParams.messageKey = 'message.key.value';
    $controller('ContentController', {
      '$scope': $scope
    });
    expect(Alert.info).toHaveBeenCalledWith('message.key.value', '', jasmine.any(Object));
  }));

});

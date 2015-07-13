'use strict';

describe('ContentController', function () {
  var $scope,
      Session;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$rootScope', '$controller',
    function ($rootScope, $controller) {
      $scope = $rootScope.$new();
      
      Session = {};
      $controller('ContentController', {'$scope': $scope, 'Session': Session});
    }
  ]));

  it('should define a function that redirects to invites if the current Session does not have a tenant', inject(['$state', function ($state){
    Session.tenant = {};
    spyOn($state, 'transitionTo');
    
    $scope.redirectToInvites();
    $scope.$digest();

    expect($state.transitionTo).toHaveBeenCalledWith('content.invites');
  }]));
});

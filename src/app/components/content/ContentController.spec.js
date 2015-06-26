'use strict';

describe('ContentController', function () {
  var $scope,
      $controller,
      $state,
      $injector;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', '$state', '$injector',
    function ($rootScope, _$controller_, $httpBackend, _$state_, _$injector_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $state = _$state_;
      $injector = _$injector_;
      $controller('ContentController', {'$scope': $scope});
      $httpBackend.flush();
    }
  ]));

  it('should define a function that redirects to invites if the current Session does not have a tenant', inject(function (Session){
    Session.tenant = { tenantId: '' };

    $scope.redirectToInvites();
    $scope.$apply();

    expect($state.current.name).toBe('content.invites');
  }));
});

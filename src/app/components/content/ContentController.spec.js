/* global spyOn: false  */

'use strict';

describe('ContentController', function () {
  var $scope,
    $controller,
    $httpBackend,
    $state,
    Session,
    apiHostname,
    regions,
    tenantId;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', '$state', 'Session', 'apiHostname',
    function ($rootScope, _$controller_, _$httpBackend_, _$state_, _Session_, _apiHostname_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Session = _Session_;
      apiHostname = _apiHostname_;
    }
  ]));

  beforeEach(function() {
    regions = [{
      'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
      'description': 'US East (N. Virginia)',
      'name': 'us-east-1'
    }];

    tenantId = 'c98f5fc0-f91a-11e4-a64e-000e9992be1f';

    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : regions});

    $controller('ContentController', {'$scope': $scope});

    $httpBackend.flush();
  });

  it('should set activeRegionId to first region found', function () {
    expect($scope.regions[0].id).toEqual(regions[0].id);
    expect(Session.activeRegionId).toEqual(regions[0].id);
  });

  it('should transition when Session tenantId is not set', function () {
    spyOn($state, 'transitionTo');

    $scope.redirectToInvites();

    expect($state.transitionTo).toHaveBeenCalled();
  });

  it('should not transition when Session tenantId is set', function () {
    Session.tenant.tenantId = tenantId;

    spyOn($state, 'transitionTo');

    $scope.redirectToInvites();

    expect($state.transitionTo).not.toHaveBeenCalled();
  });
});

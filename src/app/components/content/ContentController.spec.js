'use strict';

describe('ConfigurationController', function () {
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
});

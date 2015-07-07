'use strict';

describe('ConfigurationController', function () {
  var $scope,
    $controller;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', '$controller',
    function ($rootScope, _$controller_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      
      $controller('ConfigurationController', {'$scope': $scope});
    }
  ]));
});
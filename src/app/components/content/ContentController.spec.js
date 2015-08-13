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
});

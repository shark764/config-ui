'use strict';
// jshint unused:false
describe('MediaController', function() {
    var $scope,
        $controller,
        $httpBackend,
        medias,
        Media,
        apiHostname,
        routeParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Media', 'apiHostname',
      function($rootScope, _$controller_, $injector, _Media_, apiHostname) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Media = _Media_;

      medias = [
        new Media({
          id: 'm1'
        }),
        new Media({
          id: 'm2'
        })
      ];

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
        'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
        'description': 'US East (N. Virginia)',
        'name': 'us-east-1'
      }]});

      $controller('MediaController', {'$scope': $scope, 'Session' : {tenant : {id : 1}}, '$routeParams' : routeParams});
      $httpBackend.flush();
    }]));
});

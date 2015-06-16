'use strict';

/*global spyOn : false */

describe('MediaController', function() {
    var $scope,
        $controller,
        $httpBackend,
        medias,
        Media,
        Queue,
        stateParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Media', 'apiHostname',
      function($rootScope, _$controller_, $injector, _Media_, apiHostname) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Media = _Media_;

      queues = [
        new Media({
          id: 'm1'
        }),
        new Media({
          id: 'm2'
        })
      ];

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/media').respond({'result' : queues});
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/media/q1').respond({'result' : queues[0]});
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/media/q2').respond({'result' : queues[1]});

      $controller('MediaController', {'$scope': $scope, 'Session' : {tenant : {id : 1}}, '$routeParams' : routeParams});
      $httpBackend.flush();
    }]));
});

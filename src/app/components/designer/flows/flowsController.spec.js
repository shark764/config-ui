'use strict';

/*global spyOn : false */

describe('FlowsController', function() {
    var $scope,
        $controller,
        $httpBackend,
        flows,
        Flow,
        routeParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Flow', function($rootScope, _$controller_, $injector, _Flow_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Flow = _Flow_;

      flows = [
        new Flow({
          name: 'q1',
          description: 'A pretty good flow',
          id: 'q1'
        }),
        new Flow({
          name: 'q2',
          description: 'Not as cool as the other flow',
          id: 'q2'
        })
      ];

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows').respond({'result' : flows});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/q1').respond({'result' : flows[0]});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/q2').respond({'result' : flows[1]});

      $controller('FlowsController', {'$scope': $scope, 'Session' : {tenantId : 1}, '$stateParams' : routeParams});
      $httpBackend.flush();
    }]));

    it('should have flows defined', function() {
        expect($scope.flows).toBeDefined();
        expect($scope.flows[0].id).toEqual(flows[0].id);
        expect($scope.flows[1].id).toEqual(flows[1].id);
    });
});
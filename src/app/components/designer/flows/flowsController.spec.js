'use strict';

describe('FlowsController', function() {
    var $scope,
        $controller,
        $httpBackend,
        flows,
        flows2,
        Flow,
        apiHostname,
        Session,
        regions,
        routeParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(module('gulpAngular'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Flow', 'Session', 'apiHostname',
      function($rootScope, _$controller_, $injector, _Flow_, _Session_, _apiHostname_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Session = _Session_;
      apiHostname = _apiHostname_;
      Flow = _Flow_;
      Session.tenant = {
        tenantId: 1
      };

      regions = [
        {
          id: 1
        }
      ];

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

      flows2 = [
        new Flow({
          name: 'q3',
          description: 'Das flow',
          id: 'q3'
        })
      ];


      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/flows').respond({'result' : flows});
      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : regions});

      $controller('ContentController', {'$scope': $scope});
      $controller('FlowsController', {'$scope': $scope, '$stateParams' : routeParams});
      $httpBackend.flush();
    }]));

    it('should have flows defined', function() {
        expect($scope.flows).toBeDefined();
        expect($scope.flows[0].id).toEqual(flows[0].id);
        expect($scope.flows[1].id).toEqual(flows[1].id);
    });

    it('should have a function to fetch tenants data', function() {
        Session.tenant.tenantId = 2;

        $httpBackend.when('GET', apiHostname + '/v1/tenants/2/flows').respond({'result' : flows2});
        $scope.fetch();
        $httpBackend.flush();

        expect($scope.flows).toBeDefined();
        expect($scope.flows[0].id).toEqual(flows2[0].id);

    });

    it('should have a function to create a new flow and set it as selected', function() {
        $scope.createFlow();
        expect($scope.selectedFlow).toBeDefined();
        expect($scope.selectedFlow.tenantId).toBe(Session.tenant.tenantId);
    });
});

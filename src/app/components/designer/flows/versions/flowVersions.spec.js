'use strict';

describe('Versions directive controller', function() {
    var $scope,
        $controller,
        $httpBackend,
        versions,
        FlowVersion;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(module('gulpAngular'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'FlowVersion', function($rootScope, _$controller_, $injector, _FlowVersion_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      FlowVersion = _FlowVersion_;

      versions = [
        new FlowVersion({
          name: 'q1',
          description: 'A pretty good version',
          id: 'q1'
        }),
        new FlowVersion({
          name: 'q2',
          description: 'Not as cool as the other version',
          id: 'q2'
        })
      ];

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/1/versions').respond({'result' : versions});

      $scope.flow = {
          id : 1
      };

      $controller('FlowVersionsController', {'$scope': $scope, 'Session' : {tenant : { tenantId : 1}}});

      $httpBackend.flush();
    }]));

    it('should have versions defined', function() {
        expect($scope.versions).toBeDefined();
        expect($scope.versions[0].id).toEqual(versions[0].id);
        expect($scope.versions[1].id).toEqual(versions[1].id);
    });

    it('should have a function to create a new version', function() {
        $scope.createVersion();

        expect($scope.version).toBeDefined();
        expect($scope.version.flow).toBe('[]');
        expect($scope.version.flowId).toBe($scope.flow.id);
    });
});

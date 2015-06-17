/* global spyOn: false  */

'use strict';

describe('Versions directive controller', function () {
  var $scope,
    $controller,
    $httpBackend,
    versions,
    FlowVersion,
    flowId,
    flow;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'FlowVersion',
    function ($rootScope, _$controller_, $injector, _FlowVersion_) {
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
      
      flowId = 555;
      flow = '[]';
      
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/' + flowId + '/versions').respond({
        'result': versions
      });
      
      $scope.flow = {
        id: flowId
      };

      $controller('FlowVersionsController', {
        '$scope': $scope,
        'Session': {
          tenant: {
            tenantId: 1
          }
        }
      });
      
      $httpBackend.flush();
    }
  ]));

  it('should have versions defined', function () {
    expect($scope.versions).toBeDefined();
    expect($scope.versions[0].id).toEqual(versions[0].id);
    expect($scope.versions[1].id).toEqual(versions[1].id);
  });

  describe('on new version creation', function () {
    beforeEach(function () {
      $scope.createVersion();
      
      $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/flows/' + flowId + '/versions').respond(201, {
        'result': versions[0]
      });
    });

    it('should have a function to create a new version', function () {
      expect($scope.version).toBeDefined();
      expect($scope.version.flow).toBe(flow);
      expect($scope.version.flowId).toBe(flowId);
    });

    it('should succeed on save and push new item to list', function () {
      $scope.saveVersion();
      
      $httpBackend.flush();
      
      expect($scope.versions.length).toEqual(3);
      expect($scope.selectedVersion).toEqual($scope.version);
    });
    
    it('should clean listener when switching flow id', function () {
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/' + versions[1].id + '/versions').respond({
        'result': []
      });
      
      spyOn($scope, 'cleanHandler');
      var cleanHandler = $scope.cleanHandler;
      
      $scope.flow = {
        id: versions[1].id
      };
      
      $scope.$digest();
      
      expect(cleanHandler).not.toBe($scope.cleanHandler);
      expect(cleanHandler).toHaveBeenCalled();
    });
  });
});
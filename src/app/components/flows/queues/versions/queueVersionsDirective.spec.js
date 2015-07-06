/* global spyOn: false  */

'use strict';

describe('Versions directive controller', function () {
  var $scope,
    $controller,
    $compile,
    $httpBackend,
    versions,
    QueueVersion,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$controller', '$injector', 'QueueVersion', 'apiHostname',
    function (_$compile_, $rootScope, _$controller_, $injector, _QueueVersion_, apiHostname) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $compile = _$compile_;
      QueueVersion = _QueueVersion_;

      versions = [
        new QueueVersion({
          name: 'q1',
          description: 'A pretty good version',
          id: 'q1',
          query: 'query 1',
          queueId: '1',
          tenantId: '1'
        }),
        new QueueVersion({
          name: 'q2',
          description: 'Not as cool as the other version',
          id: 'q2',
          query: 'query 2',
          queueId: '1',
          tenantId: '1'
        })
      ];

      $scope.queue = {
        id: '1'
      };

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/queues/1/versions').respond({
        'result': versions
      });
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/tenant-id/queues/1/versions').respond({
        'result': versions
      });
      $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
        'tenants': []
      }});

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
        'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
        'description': 'US East (N. Virginia)',
        'name': 'us-east-1'
      }]});

      $scope.createVersionForm = {
        $setPristine: angular.noop,
        $setUntouched: angular.noop
      };

      $controller('QueueVersionsController', {
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

  it('should properly use the directive', function () {
    var element;

    element = $compile('<queue-versions queue="queue" versions="versions"></queue-versions>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  describe('on version copy', function () {

    beforeEach(function () {
      $scope.createVersionCopy(versions[0]);

      $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/queues/1/versions').respond(201, {
        'result': versions[0]
      });
    });

    it('should have a function to create a new version', function () {
      expect($scope.versionCopy).toBeDefined();

      expect($scope.versionCopy.queueId).toBe('1');
    });

    it('should calling currVersionChanged should set activeVersion to currVersion.version', function () {
      $scope.queue.activeVersion = "v1";
      $scope.currVersion.version = "v2";

      expect($scope.queue.activeVersion).toBe("v1");

      $scope.currVersionChanged();

      expect($scope.queue.activeVersion).toBe("v2");
    });

    it('should change current version to the same as active version should leave active version as the same', function () {
      $scope.queue.activeVersion = "v1";
      $scope.currVersion.version = "v1";

      expect($scope.queue.activeVersion).toBe("v1");

      $scope.updateCurrentVersion();

      expect($scope.queue.activeVersion).toBe("v1");
    });

    it('should toggle details be called, details should be toggled', function () {
      $scope.toggleDetails(versions[0]);

      expect(versions[0].viewing).toBe(true);

      $scope.toggleDetails(versions[0]);

      expect(versions[0].viewing).toBe(false);
    });

    it('should active version be set to null, current version should be set to null', function () {
      $scope.queue.activeVersion = null;
      $scope.currVersion.version = "v2";

      expect($scope.queue.activeVersion).toBe(null);

      $scope.updateCurrentVersion();

      expect($scope.queue.activeVersion).toBe(null);
    });

    it('should succeed on save and push new item to list', function () {
      $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/queues/1/versions').respond(200, {

      });

      $scope.saveVersion();

      expect($scope.versions.length).toEqual(2);

      $httpBackend.flush();

      expect($scope.versions.length).toEqual(3);
    });

    it('should clean listener when switching queue id', function () {
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/queues/' + versions[1].id + '/versions').respond({
        'result': []
      });

      spyOn($scope, 'cleanHandler');
      var cleanHandler = $scope.cleanHandler;

      $scope.queue = {
        id: versions[1].id
      };

      $scope.$digest();

      expect(cleanHandler).not.toBe($scope.cleanHandler);
      expect(cleanHandler).toHaveBeenCalled();
    });
  });
});

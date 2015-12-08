'use strict';

describe('Queue Versions controller', function () {
  var $scope,
    $controller,
    controller,
    $compile,
    $httpBackend,
    versions,
    QueueVersion,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$compile', '$rootScope', '$controller', '$injector', 'QueueVersion', 'apiHostname', 'Queue',
    function (_$compile_, $rootScope, _$controller_, $injector, _QueueVersion_, apiHostname, Queue) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $compile = _$compile_;
      QueueVersion = _QueueVersion_;

      versions = [
        new QueueVersion({
          name: 'q1',
          description: 'A pretty good version',
          version: 'q1',
          query: '{}',
          queueId: '1',
          tenantId: '1'
        }),
        new QueueVersion({
          name: 'q2',
          description: 'Not as cool as the other version',
          version: 'q2',
          query: '{}',
          queueId: '1',
          tenantId: '1'
        })
      ];

      $scope.queue = new Queue({
        id: '1'
      });

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/queues/1/versions').respond({
        'result': versions
      });
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/queues/1/versions').respond({
        'result': versions
      });

      $scope.createVersionForm = {
        $setPristine: angular.noop,
        $setUntouched: angular.noop
      };

      controller = $controller('QueueVersionsController', {
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

  it('should properly use the directive', function () {
    var element;
    element = $compile('<queue-versions queue="queue"></queue-versions>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  describe('toggleDetails function', function(){
    it('should exist', function () {
      expect(controller.toggleDetails).toBeDefined();
    });

    it('should toggle the viewing param to false if it is true', function () {
      var version = new QueueVersion({
        viewing: true
      });

      controller.toggleDetails(version);
      expect(version.viewing).toBeFalsy();
    });

    it('should set all other versions viewing property to false if toggling to true', function () {
      controller.toggleDetails(versions[0]);
      expect(controller.fetchVersions()[0].viewing).toBeTruthy();
      expect(controller.fetchVersions()[1].viewing).toBeFalsy();
    });
  });

  describe('addQueueVersion function', function(){
    it('should exist', function () {
      expect(controller.addQueueVersion).toBeDefined();
    });

    it('should emit the queue add event', function () {
      spyOn($scope, '$emit').and.callThrough();
      controller.addQueueVersion();
      expect($scope.$emit).toHaveBeenCalledWith('create:queue:version');
    });
  });

  describe('createVersionCopy function', function(){
    it('should exist', function () {
      expect(controller.createVersionCopy).toBeDefined();
    });

    it('should emit the copy version event', function () {
      spyOn($scope, '$emit').and.callThrough();
      controller.createVersionCopy({id: 'myid'});
      expect($scope.$emit).toHaveBeenCalledWith('copy:queue:version', {id: 'myid'});
    });
  });
});

'use strict';

describe('media details directive', function() {
  var $scope,
    element,
    isolateScope,
    controller;

  beforeEach(module('liveopsConfigPanel', 'gulpAngular', 'liveopsConfigPanel.mock', 'liveopsConfigPanel.mockutils'));

  beforeEach(inject(['$compile', '$rootScope', 'mockModel', function($compile, $rootScope, mockModel) {
    $scope = $rootScope.$new();

    element = $compile('<lo-media-details></lo-media-details>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
    controller = element.controller('loMediaDetails');

    $scope.forms = {
      mediaForm: {
        audiosourcefile: mockModel()
      }
    };
  }]));

  describe('onSelect function', function() {
    it('should remove the selectedMedia source', inject(function() {
      $scope.selectedMedia = {
        source: 'a source'
      };

      controller.onSelect();
      expect($scope.selectedMedia.source).toBeUndefined();
    }));
  });

  describe('submit function', function() {
    it('should save the selectedMedia if the audio source isn\'t dirty', inject(function(Media, $httpBackend, apiHostname) {
      $scope.forms.mediaForm.audiosourcefile.$dirty = false;

      $scope.selectedMedia = new Media({
        tenantId: 'tenant-id',
        name: 'some name'
      });

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/media').respond(200);

      controller.submit();
      $httpBackend.flush();
    }));

    it('should upload the new source and save the media if audio source is dirty', inject(function(Media, Upload, $q, $httpBackend, apiHostname) {
      $scope.forms.mediaForm.audiosourcefile.$dirty = true;

      spyOn(Upload, 'upload').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve({
          data: {
            result: {
              url: 'someurl'
            }
          }
        });
        return deferred.promise;
      });

      $scope.selectedMedia = new Media({
        tenantId: 'tenant-id',
        name: 'some name'
      });

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/media').respond(200);

      controller.submit();
      $httpBackend.flush();
    }));
  });
});

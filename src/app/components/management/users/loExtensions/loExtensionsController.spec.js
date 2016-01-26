'use strict';

describe('loExtensions controller', function() {
  var $scope,
    controller,
    mockTenantUsers;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));

  beforeEach(inject(['$controller', '$rootScope', 'mockTenantUsers', function($controller, $rootScope, _mockTenantUsers) {
    $scope = $rootScope.$new();
    mockTenantUsers = _mockTenantUsers;

    $scope.tenantUser = mockTenantUsers[0];
    $scope.tenantUser.extensions = [];

    controller = $controller('loExtensionsController', {
      '$scope': $scope
    });
    $scope.$digest();
  }]));

  describe('save function', function() {
    it('should save the user', inject(function($httpBackend, apiHostname) {
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(200);

      controller.save();
      $httpBackend.flush();
    }));

    it('should reset the form state on success', inject(function($httpBackend, apiHostname) {
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(200);
      controller.save();
      $httpBackend.flush();

      expect($scope.newExtension.type).toEqual('webrtc');
      expect(controller.editingExtension).toBeNull();
      expect($scope.creatingExtension).toBeFalsy();
    }));

    it('should reset the user on fail', inject(function($httpBackend, apiHostname) {
      $scope.form = {
        $setPristine: jasmine.createSpy('$setPristine'),
        loFormSubmitController: {
          populateApiErrors: jasmine.createSpy('populateApiErrors')
        }
      };

      spyOn(mockTenantUsers[0], 'reset');
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(400, {
        error: {
          attribute: {}
        }
      });
      controller.save();
      $httpBackend.flush();

      expect(mockTenantUsers[0].reset).toHaveBeenCalled();
    }));
  });

  describe('add function', function() {
    it('should add to the user\'s extensions', inject(function($q) {
      spyOn(controller, 'save').and.returnValue($q.when());

      $scope.newExtension = {
        value: 'mynewnumber'
      };
      $scope.add();
      expect($scope.tenantUser.extensions.length).toBe(1);
      expect($scope.tenantUser.extensions[0].value).toEqual('mynewnumber');
    }));
  });

  describe('remove function', function() {
    it('should remove the extension from the user', inject(function($q) {
      spyOn(controller, 'save').and.returnValue($q.when());

      $scope.tenantUser.extensions = [{
        id: 'extension1'
      }, {
        id: 'extension2'
      }];

      $scope.remove($scope.tenantUser.extensions[0]);
      expect($scope.tenantUser.extensions.length).toBe(1);
      expect($scope.tenantUser.extensions[0].id).toEqual('extension2');
    }));

    it('should save the user', inject(function($q) {
      spyOn(controller, 'save').and.returnValue($q.when());

      $scope.tenantUser.extensions = [{
        id: 'extension1'
      }, {
        id: 'extension2'
      }];

      $scope.remove($scope.tenantUser.extensions[0]);
      expect(controller.save).toHaveBeenCalled();
    }));
  });

  describe('moved function', function() {
    it('should remove the extension at the index, and update the active extension', inject(function($q) {
      spyOn(controller, 'save').and.returnValue($q.when());
      $scope.tenantUser.extensions = [{
        value: 'extension1'
      }, {
        value: 'extension2'
      }];

      $scope.moved(0);
      expect($scope.tenantUser.extensions.length).toBe(1);
      expect($scope.tenantUser.extensions[0].value).toEqual('extension2');
      expect($scope.tenantUser.activeExtension.value).toEqual('extension2');
    }));
  });
});

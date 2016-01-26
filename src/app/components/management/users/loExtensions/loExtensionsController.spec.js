'use strict';

describe('loExtensions controller', function() {
  var $scope,
    controller,
    mockTenantUsers;

  beforeEach(module('liveopsConfigPanel', 'gulpAngular', 'liveopsConfigPanel.tenant.user.mock', 'liveopsConfigPanel.mockutils'));

  beforeEach(inject(['$controller', '$rootScope', 'mockTenantUsers', 'mockModel', function($controller, $rootScope, _mockTenantUsers, mockModel) {
    $scope = $rootScope.$new();
    mockTenantUsers = _mockTenantUsers;

    $scope.tenantUser = mockTenantUsers[0];
    $scope.tenantUser.extensions = [];

    $scope.form = {
      type: mockModel(),
      provider: mockModel(),
      value: mockModel(),
      sipValue: mockModel(),
      telValue: mockModel(),
      extensiondescription: mockModel(),
      extensions: mockModel(),
      activeExtension: mockModel(),
      loFormSubmitController: {
        populateApiErrors: jasmine.createSpy('populateApiErrors')
      }
    };

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

    it('should reset the form on success', inject(function($httpBackend, apiHostname) {
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(200);
      controller.save();
      $httpBackend.flush();

      expect($scope.form.type.$setPristine).toHaveBeenCalled();
      expect($scope.form.type.$setUntouched).toHaveBeenCalled();
      expect($scope.form.provider.$setPristine).toHaveBeenCalled();
      expect($scope.form.provider.$setUntouched).toHaveBeenCalled();
      expect($scope.form.sipValue.$setPristine).toHaveBeenCalled();
      expect($scope.form.sipValue.$setUntouched).toHaveBeenCalled();
      expect($scope.form.telValue.$setPristine).toHaveBeenCalled();
      expect($scope.form.telValue.$setUntouched).toHaveBeenCalled();
      expect($scope.form.extensiondescription.$setPristine).toHaveBeenCalled();
      expect($scope.form.extensiondescription.$setUntouched).toHaveBeenCalled();
    }));

    it('should reset the user on fail', inject(function($httpBackend, apiHostname, mockForm) {
      $scope.form = mockForm();
      $scope.form.loFormSubmitController = {
        populateApiErrors: jasmine.createSpy('populateApiErrors')
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

      $scope.phoneNumber = 'mynewnumber';
      $scope.add();
      expect($scope.tenantUser.extensions.length).toBe(1);
      expect($scope.tenantUser.extensions[0].value).toEqual('mynewnumber');
    }));

    it('should add the pstn extension to the number, if given', inject(function($q) {
      spyOn(controller, 'save').and.returnValue($q.when());

      $scope.phoneNumber = 'mynewnumber';
      $scope.phoneExtension = '1234';
      $scope.add();
      expect($scope.tenantUser.extensions.length).toBe(1);
      expect($scope.tenantUser.extensions[0].value).toEqual('mynewnumberx1234');
    }));

    it('should set the sip value, if given', inject(function($q) {
      spyOn(controller, 'save').and.returnValue($q.when());

      $scope.sipExtension = 'sip:user@example.com';
      $scope.add();
      expect($scope.tenantUser.extensions.length).toBe(1);
      expect($scope.tenantUser.extensions[0].value).toEqual('sip:user@example.com');
    }));

    it('should reset the phone number values on success', inject(function($q) {
      spyOn(controller, 'save').and.returnValue($q.when());

      $scope.phoneNumber = '12345';
      $scope.phoneExtension = '123';
      $scope.sipExtension = 'aaaa';
      $scope.newExtension.provider = '4566';
      $scope.add();
      $scope.$digest();

      expect($scope.phoneNumber).toBeFalsy();
      expect($scope.phoneExtension).toBeFalsy();
      expect($scope.sipExtension).toBeFalsy();
      expect($scope.newExtension.provider).toBeFalsy();
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

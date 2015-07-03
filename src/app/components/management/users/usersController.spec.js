'use strict';

/* global spyOn: false  */

describe('users controller', function () {
  var $scope,
    $httpBackend,
    Session,
    controller,
    Invite,
    mockUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', '$controller', 'apiHostname', 'mockUsers', 'Session', 'Invite',
    function ($compile, $rootScope, _$httpBackend, $controller, apiHostname, _mockUsers, _Session_, _Invite_) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      mockUsers = _mockUsers;
      Session = _Session_;
      Invite = _Invite_;

      controller = $controller('UsersController', {
        '$scope': $scope
      });

      $scope.user = mockUsers[0];
      $httpBackend.flush();
    }
  ]));

  it('should have users', inject(function () {
    expect($scope.users).toBeDefined();
    expect($scope.users.length).toEqual(2);
  }));

  describe('updateDisplayName function', function () {
    var childScope;

    beforeEach(function () {
      childScope = {
        resource: {
          firstName: 'first',
          lastName: 'last',
          displayName: ''
        },

        detailsForm: {
          displayName: {
            $untouched: true
          }
        }
      };
    });

    it('should update the displayName with the first and last name if untouched', inject(function () {
      $scope.additional.updateDisplayName(childScope);
      expect(childScope.resource.displayName).toEqual('first last');
    }));

    it('should do nothing if the displayName field is touched', inject(function () {
      childScope.detailsForm.displayName.$untouched = false;
      $scope.additional.updateDisplayName(childScope);
      expect(childScope.resource.displayName).toEqual('');
    }));
  });

  describe('postSave function', function () {
    it('should reset the session authentication token if user changes their own password',
      inject(['$injector', 'Session', function ($injector, Session) {

        var newPassword = 'anewpassword';
        var AuthService = $injector.get('AuthService');
        var token = AuthService.generateToken(mockUsers[0].email, newPassword);

        $scope.selectedUser = mockUsers[0];
        $scope.selectedUser.password = newPassword;

        spyOn(Session, 'setToken');

        $scope.selectedUser.preUpdate($scope.selectedUser);

        expect(controller.newPassword).toBeDefined();
        expect(controller.newPassword).toEqual(newPassword);

        $scope.selectedUser.postUpdate($scope.selectedUser);

        expect(Session.setToken).toHaveBeenCalledWith(token);
      }]));

    xit('should create an invite for the new user', inject('User', function (User) {
      spyOn(Invite, 'save');
      var newUser = new User({
        tenantId: 'tenant-id'
      });
      newUser.save();

      expect(Invite.save).toHaveBeenCalledWith({
        tenantId: 'tenant-id'
      }, {
        email: 'somenewemail@test.com',
        roleId: '00000000-0000-0000-0000-000000000000'
      });
    }));

    it('should not send an invite if editing an existing user', inject(function () {
      spyOn(Invite, 'save');
      mockUsers[0].save();
      expect(Invite.save).not.toHaveBeenCalled();
    }));
  });

  describe('postError function', function () {
    it('should do nothing if error code is not 400', inject(function () {
      var error = {
        config: {
          method: 'POST'
        },
        status: '500'
      };

      spyOn(Invite, 'save');

      mockUsers[0].postCreateError(error);
      expect(Invite.save).not.toHaveBeenCalled();
    }));

    it('should do nothing if error code is not 404', inject(function () {
      var error = {
        config: {
          method: 'POST'
        },
        status: '404'
      };

      spyOn(Invite, 'save');

      mockUsers[0].postCreateError(error);
      expect(Invite.save).not.toHaveBeenCalled();
    }));


    it('should create an invite if error is 400 and method is POST', inject(function () {
      var error = {
        config: {
          method: 'POST'
        },
        status: 400
      };

      spyOn(Invite, 'save');
      mockUsers[0].postCreateError(error);
      expect(Invite.save).toHaveBeenCalledWith({
        tenantId: Session.tenant.tenantId
      }, {
        email: mockUsers[0].email,
        roleId: '00000000-0000-0000-0000-000000000000'
      });
    }));
  });

});

'use strict';

/* global spyOn: false  */

describe('users controller', function () {
  var $scope,
    $httpBackend,
    Session,
    controller,
    apiHostname,
    Invite,
    User,
    mockUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', '$controller', 'apiHostname', 'mockUsers', 'Session', 'Invite', 'User',
    function ($compile, $rootScope, _$httpBackend, $controller, _apiHostname, _mockUsers, _Session_, _Invite_, _User_) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      mockUsers = _mockUsers;
      apiHostname = _apiHostname;
      Session = _Session_;
      Invite = _Invite_;
      User = _User_;

      controller = $controller('UsersController', {
        '$scope': $scope
      });

      $scope.user = mockUsers[0];
    }
  ]));

  it('should have fetchUsers', inject(function () {
    var users = $scope.fetchUsers();

    $httpBackend.flush();

    expect(users).toBeDefined();
    expect(users.length).toEqual(3);
  }));

  it('should catch the on:click:create event', inject([function () {
    $scope.$broadcast('table:on:click:create');
    expect($scope.selectedUser).toBeDefined();
    expect($scope.selectedUser.status).toEqual('enabled');
  }]));

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

    it('should return different users on fetch if session.tenant.tenantId is changed', inject(function () {
      var tempUsers = [{
        'id': 'userId20',
        'status': 'enabled',
        'externalId': 80232,
        'state': 'NOT_READY',
        'lastName': 'Oliver',
        'firstName': 'Michael',
        'email': 'michael.oliver@ezent.io'
      }];

      $httpBackend.expect('GET', apiHostname + '/v1/users?tenantId=tenant').respond({
        'result': tempUsers
      });

      Session.tenant.tenantId = 'tenant';
      var users = $scope.fetchUsers();

      $httpBackend.flush();

      expect(users.length).toEqual(1);
      expect(users[0].id).toEqual(tempUsers[0].id);
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

        Session.user.id = 'nope';

        $scope.selectedUser.postUpdate($scope.selectedUser);

        expect(Session.setToken).not.toHaveBeenCalledWith(token);
      }]));


    it('should create an invite for the new user after creation', function () {
      spyOn(Invite, 'save');

      var user = new User({
        email: 'joeblow@test.com'
      });

      user.postCreate();

      expect(Invite.save).toHaveBeenCalledWith({
        tenantId: 'tenant-id'
      }, {
        email: 'joeblow@test.com',
        roleId: '00000000-0000-0000-0000-000000000000'
      });
    });

    it('should create an invite for the new user after creation has failed if it was a 400 error with email exists error', function () {
      spyOn(Invite, 'save');

      var user = new User({
        email: 'joeblow@test.com'
      });

      var response = {
        status: 400,
        data: {
          error: {
            code: 400,
            attribute: {
              email: 'Email address already exists in the system'
            }
          }
        }
      };

      user.postCreateError(response);

      expect(Invite.save).toHaveBeenCalledWith({
        tenantId: Session.tenant.tenantId
      }, {
        email: user.email,
        roleId: '00000000-0000-0000-0000-000000000000'
      });
    });

    it('should not send an invite if the save errored and the status was not 400', function () {
      spyOn(Invite, 'save');

      $scope.user.email = 'joeblow@test.com';
      new User().postCreateError({
        status: 401
      });

      expect(Invite.save).not.toHaveBeenCalledWith();
    });

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
  });
});
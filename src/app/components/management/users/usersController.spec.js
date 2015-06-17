'use strict';

/* global jasmine, spyOn: false  */

describe('users controller', function(){
  var $scope,
    $httpBackend,
    users,
    Session,
    childScope,
    $injector,
    controller,
    Invite;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$injector', '$controller', 'apiHostname', function($compile, $rootScope, _$injector_, $controller, apiHostname) {
    $injector = _$injector_;
    
    users  = [ {
      'id': 'c6aa44f6-b19e-49f5-bd3f-66f00b885e39',
      'status': false,
      'externalId': 73795,
      'state': 'WRAP',
      'lastName': 'Lowe',
      'firstName': 'Munoz',
      'email': 'munoz.lowe@hivedom.org',
      'displayName': 'Munoz Lowe'
    },
    {
      'id': '9f97f9d9-004c-469c-906d-b917bd79fbe8',
      'status': true,
      'externalId': 80232,
      'state': 'NOT_READY',
      'lastName': 'Oliver',
      'firstName': 'Michael',
      'email': 'michael.oliver@ezent.io',
      'displayName': 'Michael Oliver'
    }];

    //Need the following so that $digest() works
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', apiHostname + '/v1/users').respond({'result' : users});
    $httpBackend.expectGET(apiHostname + '/v1/users');

    $scope = $rootScope.$new();
    $scope.users = users;
    Session = {collapseSideMenu: true, tenant : {tenantId : 1, name: 'tenant 1'}};
    Session. user = {id : 1};
    Session.setUser = function(){};
    Session.setToken = function(){};
    Invite = {save : function(){}};
    controller = $controller('UsersController', {'$scope': $scope, 'Session' : Session, 'Invite' : Invite});
    $httpBackend.flush();
  }]));

  it('should have users', inject(function() {
    expect($scope.users).toBeDefined();
    expect($scope.users.length).toEqual(2);
  }));

  it('should fetch initial list of users', inject(function() {
    expect($scope.users).toBeDefined();
    expect($scope.users.length).toEqual(users.length);
  }));

  it('should have statuses', inject(function() {
    expect($scope.statuses).toBeDefined();
    expect($scope.statuses).toEqual(jasmine.any(Object));
  }));

  describe('updateDisplayName function', function(){
    beforeEach(function(){
      childScope = {
          resource: {
            firstName : 'first',
            lastName: 'last',
            displayName : ''
          },

          detailsForm: {
            displayName: {
              $untouched : true
            }
          }
      };
    });

    it('should update the displayName with the first and last name if untouched', inject(function() {
      $scope.additional.updateDisplayName(childScope);
      expect(childScope.resource.displayName).toEqual('first last');
    }));

    it('should do nothing if the displayName field is touched', inject(function() {
      childScope.detailsForm.displayName.$untouched = false;
      $scope.additional.updateDisplayName(childScope);
      expect(childScope.resource.displayName).toEqual('');
    }));
  });
  
  describe('postSave function', function(){
    it('should reset the session authentication token if user changes their own password', inject(function() {
      var result = {
          id : 1,
          email: 'somenewemail@test.com'
      };
      
      var AuthService = $injector.get('AuthService');
      var token = AuthService.generateToken('somenewemail@test.com', 'anewpassword');
      
      spyOn(Session, 'setToken');
      controller.preSave({resource : {password : 'anewpassword'}}); //Set newPassword
      controller.postSave($scope, result);
      expect(Session.setToken).toHaveBeenCalledWith(token);
      
    }));
    
    it('should create an invite for the new user', inject(function() {
      spyOn(Invite, 'save');
      controller.postSave({}, {email : 'somenewemail@test.com'});
      expect(Invite.save).toHaveBeenCalledWith({tenantId: 1}, {email : 'somenewemail@test.com', roleId : '00000000-0000-0000-0000-000000000000'});
    }));
  });

  describe('postError function', function(){
    it('should do nothing if error code is not 400', inject(function() {
      var error = {
          config : {
            method : 'POST'
          },
          status : '500'
      };
      
      spyOn(Invite, 'save');
      controller.postError({}, error);
      expect(Invite.save).not.toHaveBeenCalled();
      
      error.status = 404;
      controller.postError({}, error);
      expect(Invite.save).not.toHaveBeenCalled();
    }));
    
    it('should do nothing if http method is not POST', inject(function() {
      var error = {
          config : {
            method : 'GET'
          },
          status : 400
      };
      
      spyOn(Invite, 'save');
      controller.postError({}, error);
      expect(Invite.save).not.toHaveBeenCalled();
      
      error.config.method = 'PUT';
      controller.postError({}, error);
      expect(Invite.save).not.toHaveBeenCalled();
    }));
    
    it('should create an invite if error is 400 and method is POST', inject(function() {
      var error = {
          config : {
            method : 'POST'
          },
          status : 400
      };
      
      spyOn(Invite, 'save');
      controller.postError({resource : {email : 'email'}, cancel : function(){}}, error);
      expect(Invite.save).toHaveBeenCalledWith({tenantId: 1}, {email : 'email', roleId : '00000000-0000-0000-0000-000000000000'});
    }));
  });

});

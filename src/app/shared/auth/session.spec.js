'use strict';

/* global localStorage: false */

var USER;
var TOKEN = 'dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw==';

describe('Session', function() {
  var $rootScope,
    loEvents,
    session,
    updateCallbacks,
    mockDestroyerSpy,
    mockTenant1,
    mockTenant2,
    mockTenants;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(inject(['$rootScope', 'Session', 'User', 'loEvents', function(_$rootScope, _session, User, _loEvents) {
    session = _session;

    $rootScope = _$rootScope;
    loEvents = _loEvents;

    mockTenant1 = {
      tenantId: 1,
      tenantName: 'mockTenant1',
      someProperty: 'value'
    };

    mockTenant2 = {
      tenantId: 2,
      tenantName: 'mockTenant2',
      someProperty: 'value'
    };

    mockTenants = [
      mockTenant1,
      mockTenant2
    ];

    USER = new User({
      'role': 'admin',
      'email': 'titan@liveops.com',
      'createdBy': '00000000-0000-0000-0000-000000000000',
      'displayName': 'titan',
      'updated': '2015-06-02T08:29:03Z',
      'firstName': 'titan',
      'created': '2015-06-02T08:29:03Z',
      'state': null,
      'extension': null,
      'externalId': null,
      'updatedBy': '00000000-0000-0000-0000-000000000000',
      'status': 'enabled',
      'id': '6d094710-0901-11e5-87f2-b1d420920055',
      'lastName': 'user'
    });
  }]));

  it('should have a method to set the session information', function() {
    session.set(USER, [], TOKEN);

    expect(session.token).toBe(TOKEN);
    expect(session.user.displayName).toBe(USER.getDisplay());
    expect(session.isAuthenticated()).toBeTruthy(true);

    var stringifiedSession = localStorage.getItem(session.userSessionKey);
    expect(stringifiedSession).toBeDefined();
  });


  it('should have a method to destroy the session information', function() {
    session.set(USER, [], TOKEN);

    session.destroy();

    expect(session.token).toBeNull();
    expect(session.user).toBeNull();
    expect(session.isAuthenticated()).toBeFalsy();
    expect(localStorage.getItem(session.userSessionKey)).toBe(null);
  });

  it('should have a method to restore the session information', function() {
    session.set(USER, [], TOKEN);

    session.token = null;
    session.user = null;

    expect(session.token).toBeNull();
    expect(session.user).toBeNull();
    expect(session.isAuthenticated()).toBeFalsy();

    session.restore();

    expect(session.token).toBe(TOKEN);
    expect(session.user.displayName).toBe(USER.getDisplay());
    expect(session.isAuthenticated()).toBeTruthy();
  });

  describe('updateTenantProperty', function () {
    beforeEach(function () {
      spyOn(session, 'flush');
    });

    describe('if tenant.tenantId matches the passed id and the value is new', function () {
      beforeEach(function () {
        session.tenant = angular.copy(mockTenant1);
        session.updateTenantProperty('someProperty', mockTenant1.tenantId, 'newValue');
      });

      it('should update the property with the new value', function () {
        expect(session.tenant.someProperty).toEqual('newValue');
      });

      it('should leave other properties ALONE', function () {
        expect(session.tenant.tenantName).toEqual(mockTenant1.tenantName);
      });

      it ('should call flush', function () {
        expect(session.flush).toHaveBeenCalled();
      });
    });

    describe('if tenants[$].tenantId matches the passed id and the value is new', function () {
      beforeEach(function () {
        spyOn($rootScope, '$broadcast');
        session.tenants = angular.copy(mockTenants);
        session.updateTenantProperty('someProperty', mockTenant1.tenantId, 'newValue');
      });

      it('should update the property with the new value', function () {
        var targetTenant = _.find(session.tenants, {tenantId: mockTenant1.tenantId});
        expect(targetTenant.someProperty).toEqual('newValue');
      });

      it('should leave other properties ALONE', function () {
        var targetTenant = _.find(session.tenants, {tenantId: mockTenant1.tenantId});
        expect(targetTenant.tenantName).toEqual(mockTenant1.tenantName);
      });

      it('should not update tenants with a different id', function () {
        var targetTenant = _.find(session.tenants, {tenantId: mockTenant2.tenantId});
        expect(targetTenant).toEqual(mockTenant2);
      });

      it('should broadcast a session.tenants.updated event on rootScope', function () {
        expect($rootScope.$broadcast).toHaveBeenCalledWith(loEvents.session.tenants.updated);
      });

      it ('should call flush', function () {
        expect(session.flush).toHaveBeenCalled();
      });
    });
  });

  describe('setListeners', function() {
    beforeEach(function() {
      updateCallbacks = [];
      mockDestroyerSpy = jasmine.createSpy();
      spyOn(session, 'updateTenantProperty');
      spyOn($rootScope, '$on').and.callFake(function (event, callback) {
        updateCallbacks[event] = callback;
        return mockDestroyerSpy;
      });
      session.setListeners();
    });

    it('should attach a Tenant update listener to rootScope with a callback function', function () {
      expect($rootScope.$on).toHaveBeenCalledWith(loEvents.resource.updated + ':Tenant', jasmine.any(Function));
    });

    it('should store returned value from .$on call to listenerDestroyers array', function () {
      expect(session.listenerDestroyers).toEqual(jasmine.any(Array));
      expect(session.listenerDestroyers).toContain(mockDestroyerSpy);
    });

    describe('Tenant update listener callback', function () {
      it ('shoud call updateTenantProperty with id and name of updatedTenant', function () {
        var mockUpdatedTenant = {
          id: 1,
          name: 'newName'
        };
        updateCallbacks[loEvents.resource.updated + ':Tenant'](null, mockUpdatedTenant);
        expect(session.updateTenantProperty).toHaveBeenCalledWith('tenantName', mockUpdatedTenant.id, mockUpdatedTenant.name);
      });
    });
  });

  describe('destroyListeners', function () {
    it('should call all functions in listenerDestroyers Array', function () {
      session.listenerDestroyers.push(mockDestroyerSpy);
      session.destroyListeners();
      expect(mockDestroyerSpy).toHaveBeenCalled();
    });
  });

});

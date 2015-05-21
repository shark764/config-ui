'use strict';

/* global localStorage: false */

describe('Session', function() {
    var $scope, session;

    beforeEach(module('liveopsConfigPanel'));

    beforeEach(inject(['$rootScope','Session', function(_$rootScope_, _session_) {
      $scope = _$rootScope_.$new();
      session = _session_;

    }]));

    it('should have a method to set the session information', function() {
        session.set('abc', 'john');

        expect(session.token).toBe('abc');
        expect(session.fullName).toBe('john');
        expect(session.isAuthenticated).toBeTruthy(true);
        expect(localStorage.getItem(session.userSessionKey)).toBe(JSON.stringify(session));
    });


    it('should have a method to destroy the session information', function() {
        session.set('abc', 'john');

        session.destroy();

        expect(session.token).toBe('');
        expect(session.fullName).toBe('');
        expect(session.isAuthenticated).toBeFalsy();
        expect(localStorage.getItem(session.userSessionKey)).toBe(null);
    });


    it('should have a method to restore the session information', function() {
        session.set('abc', 'john');

        session.token = '';
        session.fullName = '';
        session.isAuthenticated = false;

        expect(session.token).toBe('');
        expect(session.fullName).toBe('');
        expect(session.isAuthenticated).toBeFalsy();

        session.restore();

        expect(session.token).toBe('abc');
        expect(session.fullName).toBe('john');
        expect(session.isAuthenticated).toBeTruthy();
    });
});
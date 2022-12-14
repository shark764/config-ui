'use strict';

describe('The view navigation', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params;

  afterAll(function() {
    shared.tearDown();
  });

  describe('when not logged in', function() {
    beforeAll(function() {
      shared.tearDown();
    });

    it('should redirect to login page when there is no page specified', function() {
      browser.get(shared.rootURL);
      expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
    });

    it('should redirect to login page when not logged in', function() {
      browser.get(shared.usersPageUrl);
      expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
    });

    it('should navigate to login page for unknown urls and not logged in', function() {
      browser.get(shared.mainUrl + 'unknownpage');
      expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
    });
  });

  describe('when logged in', function() {
    beforeAll(function() {
      loginPage.login(params.login.user, params.login.password);
    });

    it('should navigate to correct page', function() {
      browser.get(shared.usersPageUrl);
      expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);

      browser.get(shared.tenantsPageUrl);
      expect(browser.getCurrentUrl()).toContain(shared.tenantsPageUrl);

      browser.get(shared.profilePageUrl);
      expect(browser.getCurrentUrl()).toContain(shared.profilePageUrl);
    });

    it('should redirect to User Management page when there is no page specified', function() {
      browser.get(shared.rootURL);
      expect(browser.getCurrentUrl()).toBe(shared.usersPageUrl);
    });

    it('should navigate to main page for unknown urls', function() {
      browser.get(shared.mainUrl + 'unknownpage');
      expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
    });
  });
});

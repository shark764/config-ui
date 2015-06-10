'use strict';

describe('The view navigation', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js');

  beforeEach(function() {
    // Ensure user is logged out initially
    browser.get(shared.loginPageUrl);
    shared.tearDown();
    browser.get(shared.loginPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should redirect to login page when not logged in', function() {
    browser.get(shared.mainUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.usersPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.tenantsPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.queuesPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.flowsPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.flowVersionsPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.profilePageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.invitesPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });

  it('should navigate to login page for unknown urls and not logged in', function() {
    browser.get(shared.mainUrl + 'unknownpage');
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });

  it('should navigate to correct page when logged in', function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);

    browser.get(shared.mainUrl);
    expect(browser.getCurrentUrl()).toBe(shared.mainUrl);

    browser.get(shared.usersPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.usersPageUrl);

    browser.get(shared.tenantsPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.tenantsPageUrl);

    browser.get(shared.queuesPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.queuesPageUrl);

    browser.get(shared.flowsPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.flowsPageUrl);

    browser.get(shared.flowVersionsPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.flowVersionsPageUrl);

    browser.get(shared.profilePageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.profilePageUrl);

    browser.get(shared.invitesPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.invitesPageUrl);
  });

  it('should navigate to main page for unknown urls and logged in', function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);

    browser.get(shared.mainUrl + 'unknownpage');
    expect(browser.getCurrentUrl()).toBe(shared.mainUrl);
  });
});

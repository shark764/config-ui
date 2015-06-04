'use strict';

describe('The view navigation', function () {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js');

  beforeEach(function () {
    // Ensure user is logged out initially
    browser.get(shared.loginPageUrl);
    browser.executeScript('window.sessionStorage.clear()');
    browser.executeScript('window.localStorage.clear()');
  });

  afterAll(function(){
    shared.tearDown();
  });

  it('should redirect to login page when not logged in', function() {
    // TODO: Complete remaining expected redirects as new pages are added

    browser.get(shared.mainUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.usersPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.tenantsPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });
});

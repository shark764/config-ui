'use strict';

describe('The view navigation', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    navigation = require('../navigation/navigation.po.js'),
    params = browser.params;

  afterAll(function() {
    shared.tearDown();
  });

  it('should allow the user to close the details panel', function () {
    loginPage.login(params.login.user, params.login.password);

    browser.get(shared.usersPageUrl);

    shared.firstTableRow.click();

    expect(shared.detailsPanel.isDisplayed()).toBeTruthy();

    navigation.closePanelButton.click();

    expect(shared.detailsPanel.isDisplayed()).toBeFalsy();
  });

  xit('should allow the user to close the bulk actions panel', function () {
    // enable this test when Phil's PR for hiding and showing the bulk action goes in

    loginPage.login(params.login.user, params.login.password);

    browser.get(shared.usersPageUrl);

    shared.actionsBtn.click();

    expect(shared.detailsPanel.isDisplayed()).toBeTruthy();

    navigation.closePanelButton.click();

    expect(shared.detailsPanel.isDisplayed()).toBeFalsy();
  });

  it('should redirect to login page when not logged in', function() {
    browser.get(shared.usersPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.tenantsPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.profilePageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    browser.get(shared.invitesPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });

  xit('should navigate to login page for unknown urls and not logged in', function() {
    browser.get(shared.mainUrl + 'unknownpage');
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });

  it('should navigate to correct page when logged in', function() {
    loginPage.login(params.login.user, params.login.password);

    browser.get(shared.usersPageUrl);
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);

    browser.get(shared.tenantsPageUrl);
    expect(browser.getCurrentUrl()).toContain(shared.tenantsPageUrl);

    browser.get(shared.profilePageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.profilePageUrl);

    browser.get(shared.invitesPageUrl);
    expect(browser.getCurrentUrl()).toBe(shared.invitesPageUrl);
  });

  xit('should navigate to main page for unknown urls and logged in', function() {
    browser.get(shared.mainUrl + 'unknownpage');
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
  });
});

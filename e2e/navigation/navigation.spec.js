'use strict';

describe('The view navigation', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    navigation = require('../navigation/navigation.po.js'),
    params = browser.params;

  beforeAll(function() {
    shared.tearDown();
  });

  afterEach(function() {
    shared.tearDown();
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
  
  it('should navigate to login page for unknown urls and not logged in', function() {
    browser.get(shared.mainUrl + 'unknownpage');
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });

  it('should allow the user to close the details panel', function() {
    loginPage.login(params.login.user, params.login.password);

    browser.get(shared.usersPageUrl);

    shared.firstTableRow.click();

    expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeTruthy();

    navigation.closePanelButton.click();

    expect(shared.detailsPanel.isDisplayed()).toBeFalsy();
    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
  });

  it('should allow the user to close the bulk actions panel', function() {
    loginPage.login(params.login.user, params.login.password);

    browser.get(shared.usersPageUrl);

    shared.actionsBtn.click();

    expect(shared.bulkActionsPanel.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeTruthy();

    navigation.closeBulkPanelButton.click();

    expect(shared.bulkActionsPanel.isDisplayed()).toBeFalsy();
    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
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

  it('should navigate to main page for unknown urls and logged in', function() {
    loginPage.login(params.login.user, params.login.password);
    browser.get(shared.mainUrl + 'unknownpage');
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
  });
});

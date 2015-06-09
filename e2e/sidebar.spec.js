'use strict';

describe('The sidebar', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js');

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  beforeEach(function() {
    browser.get(shared.usersPageUrl);
  });

  afterAll(function(){
    shared.tearDown();
  });

  it('should be displayed on the User Management page and be closed by default', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.sidebarCollapsed.isDisplayed()).toBeTruthy();

    expect(shared.sidebarLocked.isDisplayed()).toBeFalsy();
    expect(shared.sidebarOpen.isDisplayed()).toBeFalsy();
    expect(shared.sidebarTack.isDisplayed()).toBeFalsy();
  });

  it('should open on mouse over and close on mouse off', function() {
    shared.settingsDropdownButton.click();
    expect(shared.settingsDropdown.isDisplayed()).toBeTruthy();

    expect(shared.userProfileButton.isDisplayed()).toBeTruthy();
    expect(shared.logoutButton.isDisplayed()).toBeTruthy();
  });

  it('should navigate to main page logo is selected', function() {
    shared.siteNavLogo.click();
    expect(browser.getCurrentUrl()).toBe(shared.mainUrl);
  });

  it('should change current Tenant when tenant drop down is altered', function() {
    shared.tenantsNavDropdown.click();
    // TODO Verify page is updated to selected tenant
  });

  it('should navigate to correct page when buttons are selected', function() {
    shared.usersNavButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.mainUrl);

    shared.tenantsNavButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.tenantsPageUrl);
    //TODO Add remaining pages as they are added
  });
});

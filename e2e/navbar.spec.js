'use strict';

describe('The navbar', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js');

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  beforeEach(function() {
    browser.get(shared.mainUrl);
  });

  afterAll(function(){
    shared.tearDown();
  });

  it('should contain logo, Tenant drop down, page links, user info and Logout button', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.siteNavLogo.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavDropdown.isDisplayed()).toBeTruthy();
    expect(shared.usersNavButton.getText()).toBe('User Management');
    expect(shared.tenantsNavButton.getText()).toBe('Tenants');
    expect(shared.settingsDropdownButton.isDisplayed()).toBeTruthy();
    // TODO Add remaining page buttons as they are added
  });

  it('should open settings dropdown when clicked and list links', function() {
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

'use strict';

describe('The navbar', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    browser.get(shared.mainUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should contain logo, Tenant drop down, page links, welcome message, etc', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.siteNavLogo.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavDropdown.isDisplayed()).toBeTruthy();
    expect(shared.usersNavButton.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavButton.isDisplayed()).toBeTruthy();
    expect(shared.flowsNavButton.isDisplayed()).toBeTruthy();
    expect(shared.invitesNavButton.isDisplayed()).toBeTruthy();
    expect(shared.welcomeMessage.isDisplayed()).toBeTruthy();
  });

  it('should open settings dropdown on click and list links', function() {
    shared.welcomeMessage.click();
    expect(shared.settingsDropdown.isDisplayed()).toBeTruthy();

    expect(shared.userProfileButton.isDisplayed()).toBeTruthy();
    expect(shared.logoutButton.isDisplayed()).toBeTruthy();
  });

  it('should navigate to main page logo is selected', function() {
    shared.siteNavLogo.click();
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
  });

  it('should change current Tenant when tenant drop down is altered', function() {
    shared.tenantsNavDropdown.click();
    shared.tenantsNavDropdown.all(by.repeater('item in items')).then(function(tenants) {
      var randomTenant = Math.floor((Math.random() * tenants.length) + 1);
      element(by.css('#tenant-dropdown > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(' + randomTenant + ')')).getText().then(function(value) {
        expect(value).not.toBe(null);

        element(by.css('#tenant-dropdown > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(' + randomTenant + ')')).click();
        expect(shared.tenantsNavDropdown.getAttribute('label')).toBe(value);

        browser.refresh();
        expect(shared.tenantsNavDropdown.getAttribute('label')).toBe(value);
      });
    });
  });

  it('should navigate to correct page when buttons are selected', function() {
    shared.usersNavButton.click();
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);

    shared.tenantsNavButton.click();
    expect(browser.getCurrentUrl()).toContain(shared.tenantsPageUrl);

    shared.flowsNavButton.click();
    expect(browser.getCurrentUrl()).toContain(shared.flowsPageUrl);

    shared.invitesNavButton.click();
    expect(browser.getCurrentUrl()).toContain(shared.invitesPageUrl);
  });

  it('should navigate to correct page when settings dropdown buttons are selected', function() {
    shared.welcomeMessage.click();
    shared.userProfileButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.profilePageUrl);

    shared.welcomeMessage.click();
    shared.logoutButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });
});

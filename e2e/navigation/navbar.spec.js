'use strict';

describe('The navbar', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    navbar = require('./navbar.po.js'),
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

  xit('should change current Tenant when tenant drop down is altered', function() {
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

  describe('User management', function(){
    it('should open user management dropdown on click and list links', function() {
      shared.usersNavButton.click();
      expect(navbar.userManagementDropdown.isDisplayed()).toBeTruthy();

      expect(navbar.userLink.isDisplayed()).toBeTruthy();
      expect(navbar.skillsLink.isDisplayed()).toBeTruthy();
      expect(navbar.groupsLink.isDisplayed()).toBeTruthy();

      expect(navbar.managementOptions.get(0).getText()).toBe('Users');
      expect(navbar.managementOptions.get(1).getText()).toBe('Skills');
      expect(navbar.managementOptions.get(2).getText()).toBe('Groups');
    });

    it('should navigate to users page when users link is selected', function() {
      shared.usersNavButton.click();
      navbar.userLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);;
    });

    it('should navigate to groups page when groups link is selected', function() {
      shared.usersNavButton.click()
      navbar.groupsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.groupsPageUrl);
    });

    it('should navigate to skills page when skills link is selected', function() {
      shared.usersNavButton.click()
      navbar.skillsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.skillsPageUrl);
    });
  });

  describe('Configuration', function(){
    it('should open configuration dropdown on click and list links', function() {
      shared.tenantsNavButton.click();
      expect(navbar.configurationDropdown.isDisplayed()).toBeTruthy();

      expect(navbar.tenantsLink.isDisplayed()).toBeTruthy();
      expect(navbar.integrationsLink.isDisplayed()).toBeTruthy();

      expect(navbar.configurationOptions.get(0).getText()).toBe('Tenants');
      expect(navbar.configurationOptions.get(1).getText()).toBe('Integrations');
    });

    it('should navigate to tenants page when tenants link is selected', function() {
      shared.tenantsNavButton.click();
      navbar.tenantsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.tenantsPageUrl);;
    });

    it('should navigate to integrations page when integrations link is selected', function() {
      shared.tenantsNavButton.click();
      navbar.integrationsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.integrationsPageUrl);
    });
  });

  describe('Flows', function(){
    it('should open flows dropdown on click and list links', function() {
      shared.flowsNavButton.click();
      expect(navbar.flowsDropdown.isDisplayed()).toBeTruthy();

      expect(navbar.flowsLink.isDisplayed()).toBeTruthy();
      expect(navbar.queuesLink.isDisplayed()).toBeTruthy();
      expect(navbar.mediaLink.isDisplayed()).toBeTruthy();
      expect(navbar.dispatchMappingsLink.isDisplayed()).toBeTruthy();

      expect(navbar.flowsOptions.get(0).getText()).toBe('Flows');
      expect(navbar.flowsOptions.get(1).getText()).toBe('Queues');
      expect(navbar.flowsOptions.get(2).getText()).toBe('Media Collections');
      expect(navbar.flowsOptions.get(3).getText()).toBe('Media');
      expect(navbar.flowsOptions.get(4).getText()).toBe('Dispatch Mappings');
    });

    it('should navigate to flows page when flows link is selected', function() {
      shared.flowsNavButton.click();
      navbar.flowsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.flowsPageUrl);
    });

    it('should navigate to queues page when queues link is selected', function() {
      shared.flowsNavButton.click();
      navbar.queuesLink.click().then(function () {
        expect(browser.getCurrentUrl()).toContain(shared.queuesPageUrl);
      });      
    });

    it('should navigate to media page when flows link is selected', function() {
      shared.flowsNavButton.click();
      navbar.mediaLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.mediaPageUrl);
    });

    it('should navigate to dispatch mappings page when dispatch mappings link is selected', function() {
      shared.flowsNavButton.click();
      navbar.dispatchMappingsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.dispatchMappingsPageUrl);
    });
  });

  it('should navigate to Invites page when buttons are selected', function() {
    shared.invitesNavButton.click().then(function() {
      expect(browser.getCurrentUrl()).toContain(shared.invitesPageUrl);
    });
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

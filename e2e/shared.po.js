'use strict';

var Shared = function() {
  // Page URLS
  this.mainUrl = 'http://localhost:3000/#/';
  this.loginPageUrl = this.mainUrl + 'login';
  this.profilePageUrl = this.mainUrl + 'userprofile';

  this.managementUrl = this.mainUrl + 'management/';
  this.configurationUrl = this.mainUrl + 'configuration/';
  this.designerUrl = this.mainUrl + 'designer/';

  this.usersPageUrl = this.managementUrl + 'users';
  this.groupsPageUrl = this.managementUrl + 'groups';
  this.skillsPageUrl = this.managementUrl + 'skills';

  this.tenantsPageUrl = this.configurationUrl + 'tenants';

  this.flowsPageUrl = this.designerUrl + 'flows';
  this.flowVersionsPageUrl = this.mainUrl + 'versions';
  this.queuesPageUrl = this.designerUrl + 'queues';
  this.mediaPageUrl = this.designerUrl + 'media';

  this.invitesPageUrl = this.mainUrl + 'invites';

  // Elements that are present on all pages: navbar, etc.
  this.navBar = element(by.id('topnav'));
  this.welcomeMessage = element(by.id('welcome'));
  this.siteNavLogo = element(by.id('logo'));
  this.tenantsNavDropdown = element(by.id('tenant-dropdown'));
  this.usersNavButton = element(by.id('users-nav-link'));
  this.tenantsNavButton = element(by.id('tenants-nav-link'));
  this.flowsNavButton = element(by.id('flows-nav-link'));
  this.queuesNavButton = element(by.id('queues-nav-link'));

  this.settingsDropdown = element(by.id('user-settings-dropdown'));
  this.settingsDropdownOptions = this.settingsDropdown.all(by.repeater('item in items'));
  this.userProfileButton = this.settingsDropdownOptions.get(1);
  this.logoutButton = this.settingsDropdownOptions.get(0);

  this.tearDown = function() {
    browser.executeScript('window.sessionStorage.clear()');
    browser.executeScript('window.localStorage.clear()');
  };
};

module.exports = new Shared();

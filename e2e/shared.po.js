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
  this.integrationsPageUrl = this.configurationUrl + 'integrations';

  this.flowsPageUrl = this.designerUrl + 'flows';
  this.queuesPageUrl = this.designerUrl + 'queues';
  this.mediaPageUrl = this.designerUrl + 'media';

  this.invitesPageUrl = this.mainUrl + 'invites';
  this.skillsPageUrl = this.managementUrl + 'skills';

  // Navbar elements
  this.navBar = element(by.id('topnav'));
  this.welcomeMessage = element(by.css('#user-settings-dropdown > div:nth-child(1) > a:nth-child(1)'));
  this.siteNavLogo = element(by.id('logo'));
  this.tenantsNavDropdown = element(by.id('tenant-dropdown'));
  this.usersNavButton = element(by.css('#users-nav-link > a:nth-child(1)'));
  this.tenantsNavButton = element(by.css('#tenants-nav-link > a:nth-child(1)'));
  this.flowsNavButton = element(by.css('#flows-nav-link > a:nth-child(1)'));
  this.invitesNavButton = element(by.css('#invites-nav-link > a:nth-child(1)'));
  this.settingsDropdown = element(by.id('user-settings-dropdown'));
  this.settingsDropdownOptions = this.settingsDropdown.all(by.repeater('item in items'));
  this.userProfileButton = this.settingsDropdownOptions.get(1);
  this.logoutButton = this.settingsDropdownOptions.get(0);

  // Shared page elements
  this.pageHeader = element(by.css('h2.ng-binding'));
  this.detailsFormHeader = element(by.css('.info > h1:nth-child(1)'));

  // Table controls
  this.table = element(by.css('.table'));
  this.tableElements = element.all(by.repeater('item in (filtered = (items | selectedTableOptions:config.fields | search:config.searchOn:searchQuery | orderBy:config.orderBy))'));
  this.createBtn = element(by.id('create-btn'));
  this.searchField = element(by.model('searchQuery'));
  this.actionsBtn = element(by.buttonText('Actions'));
  this.tableColumnsDropDown = element(by.css('filter-dropdown.btn'));

  // Shared Form elements
  this.detailsForm = element(by.css('.details-form'));
  this.submitFormBtn = element(by.buttonText('Submit'));
  this.cancelFormBtn = element(by.buttonText('Cancel'));
  this.successMessage = element(by.css('.toast-success'));
  this.errorMessage = element(by.css('.toast-error'));
  this.closeMessageBtn = element(by.css('.toast-close-button'));

  this.tearDown = function() {
    browser.executeScript('window.sessionStorage.clear()');
    browser.executeScript('window.localStorage.clear()');
    browser.get(this.loginPageUrl);
  };
};

module.exports = new Shared();

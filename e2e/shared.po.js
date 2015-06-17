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
  this.queuesPageUrl = this.designerUrl + 'queues';
  this.mediaPageUrl = this.designerUrl + 'media';

  this.invitesPageUrl = this.mainUrl + 'invites';
  this.skillsPageUrl = this.managementUrl + 'skills';

  // Navbar elements
  this.navBar = element(by.id('topnav'));
  this.welcomeMessage = element(by.id('welcome'));
  this.siteNavLogo = element(by.id('logo'));
  this.tenantsNavDropdown = element(by.id('tenant-dropdown'));
  this.usersNavButton = element(by.id('users-nav-link'));
  this.tenantsNavButton = element(by.id('tenants-nav-link'));
  this.flowsNavButton = element(by.id('flows-nav-link'));
  this.invitesNavButton = element(by.id('invites-nav-link'));
  this.settingsDropdown = element(by.id('user-settings-dropdown'));
  this.settingsDropdownOptions = this.settingsDropdown.all(by.repeater('item in items'));
  this.userProfileButton = this.settingsDropdownOptions.get(1);
  this.logoutButton = this.settingsDropdownOptions.get(0);

  // Shared page elements
  this.pageHeader = element(by.css('h2.ng-binding'));

  // Table controls
  this.table = element(by.css('.table'));
  this.tableElements = element.all(by.repeater('item in (filtered = (items | selectedTableOptions:config.fields | search:config.searchOn:searchQuery | orderBy:config.orderBy))'));
  this.createBtn = element(by.id('create-btn'));
  this.searchField = element(by.model('searchQuery'));
  this.actionBtn = element(by.buttonText('Actions'));
  this.tableColumnsDropDown = element(by.css('filter-dropdown.btn'));

  // Shared Form elements
  this.detailsForm = element(by.id('details-form'));
  this.submitFormBtn = element(by.buttonText('Submit'));
  this.cancelFormBtn = element(by.buttonText('Cancel'));
  this.successMessage = element(by.css('.toast-success'));
  this.errorMessage = element(by.css('.toast-error'));

  this.tearDown = function() {
    browser.executeScript('window.sessionStorage.clear()');
    browser.executeScript('window.localStorage.clear()');
  };
};

module.exports = new Shared();

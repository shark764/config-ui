'use strict';

var Shared = function() {
  // Page URLS
  this.mainUrl = 'http://localhost:3000/#/';
  this.loginPageUrl = this.mainUrl + 'login';
  this.profilePageUrl = this.mainUrl + 'userprofile';

  this.managementUrl = this.mainUrl + 'management/';
  this.configurationUrl = this.mainUrl + 'configuration/';
  this.flowsUrl = this.mainUrl + 'flows/';

  this.usersPageUrl = this.managementUrl + 'users';
  this.groupsPageUrl = this.managementUrl + 'groups';
  this.skillsPageUrl = this.managementUrl + 'skills';

  this.tenantsPageUrl = this.configurationUrl + 'tenants';
  this.integrationsPageUrl = this.configurationUrl + 'integrations';

  this.flowsPageUrl = this.flowsUrl + 'management';
  this.queuesPageUrl = this.flowsUrl + 'queues';
  this.mediaCollectionsPageUrl = this.flowsUrl + 'media-collections';
  this.mediaPageUrl = this.flowsUrl + 'media';
  this.dispatchMappingsPageUrl = this.flowsUrl + 'dispatchMappings';

  this.invitesPageUrl = this.mainUrl + 'invites';
  this.skillsPageUrl = this.managementUrl + 'skills';

  // Navbar elements
  this.navBar = element(by.id('topnav'));
  this.welcomeMessage = element(by.id('user-settings-dropdown'));
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
  this.detailsFormHeader = element(by.css('.info > h1:nth-child(1)'));

  // Table controls
  this.table = element(by.id('items-table'));
  this.firstTableRow = this.table.element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = this.table.element(by.css('tr.ng-scope:nth-child(2)'));
  this.tableElements = element.all(by.repeater('item in (filtered = (items | selectedTableOptions:config.fields | search:config.searchOn:searchQuery | orderBy:config.orderBy))'));
  this.createBtn = element(by.id('create-btn'));
  this.searchField = element(by.model('searchQuery'));
  this.actionsBtn = element(by.buttonText('Actions'));
  this.tableColumnsDropDown = element(by.id('table-columns-dropdown'));

  // Shared Form elements
  this.detailsPanel = element(by.id('details-pane'));
  this.detailsForm = this.detailsPanel.element(by.css('.details-form'));
  this.rightPanel = element(by.id('right-panel'));
  this.bulkActionsPanel = element(by.css('bulk-action-executor.details-pane'));
  this.submitFormBtn = this.detailsPanel.element(by.id('submit-details-btn'));
  this.cancelFormBtn = this.detailsPanel.element(by.id('cancel-details-btn'));
  this.successMessage = element(by.css('.toast-success'));
  this.errorMessage = element(by.css('.toast-error'));
  this.closeMessageBtn = element(by.css('.toast-close-button'));

  this.dismissChanges = function() {
    browser.switchTo().alert().then(
      function(alert) {
        alert.accept();
      },
      function(err) {}
    );
  };

  this.cancelNavigation = function() {
    browser.switchTo().alert().then(
      function(alert) {
        alert.dismiss();
      },
      function(err) {}
    );
  };

  this.tearDown = function() {
    browser.get(this.loginPageUrl);
    
    browser.executeScript('window.localStorage.clear()');
    browser.executeScript('window.sessionStorage.clear()');
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
  };
};

module.exports = new Shared();

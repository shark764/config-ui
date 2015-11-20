'use strict';

var Shared = function() {
  // Page URLS
  this.rootURL = 'http://localhost:3000';
  this.mainUrl = 'http://localhost:3000/#/';
  this.loginPageUrl = this.mainUrl + 'login';
  this.profilePageUrl = this.mainUrl + 'userprofile';

  this.managementUrl = this.mainUrl + 'management/';
  this.configurationUrl = this.mainUrl + 'configuration/';
  this.flowsUrl = this.mainUrl + 'flows/';

  this.usersPageUrl = this.managementUrl + 'users';
  this.groupsPageUrl = this.managementUrl + 'groups';
  this.skillsPageUrl = this.managementUrl + 'skills';

  this.rolesPageUrl = this.managementUrl + 'roles';
  this.rolePageUrl = this.managementUrl + 'roles';

  this.tenantsPageUrl = this.configurationUrl + 'tenants';
  this.integrationsPageUrl = this.configurationUrl + 'integrations';
  this.listsPageUrl = this.configurationUrl + 'lists';

  this.flowsPageUrl = this.flowsUrl + 'management';
  this.queuesPageUrl = this.flowsUrl + 'queues';
  this.mediaCollectionsPageUrl = this.flowsUrl + 'media-collections';
  this.mediaPageUrl = this.flowsUrl + 'media';
  this.dispatchMappingsPageUrl = this.flowsUrl + 'dispatchMappings';

  // Navbar elements
  this.navBar = element(by.id('topnav'));
  this.welcomeMessage = element(by.id('user-settings-dropdown'));
  this.siteNavLogo = element(by.id('logo'));
  this.tenantsNavDropdown = element(by.id('tenant-dropdown'));
  this.tenantsNavDropdownClick = element(by.css('#tenant-dropdown > div > div.drop-label > div > span'));
  this.tenantsNavDropdownContents = this.tenantsNavDropdown.all(by.repeater('item in items | orderBy:orderBy'));
  this.usersNavButton = element(by.id('users-nav-link'));
  this.tenantsNavButton = element(by.id('tenants-nav-link'));
  this.flowsNavButton = element(by.id('flows-nav-link'));
  this.reportingNavButton = element(by.id('reporting-nav-link'));

  this.settingsDropdown = element(by.id('user-settings-dropdown'));
  this.settingsDropdownOptions = this.settingsDropdown.all(by.repeater('item in items'));
  this.userProfileButton = this.settingsDropdownOptions.get(1);
  this.logoutButton = this.settingsDropdownOptions.get(0);

  // Shared page elements
  this.pageHeader = element(by.css('h2.ng-binding'));
  this.detailsFormHeader = element(by.css('.detail-header  h1'));

  // Table controls
  this.table = element(by.id('items-table'));
  this.firstTableRow = this.table.element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = this.table.element(by.css('tr.ng-scope:nth-child(2)'));
  this.tableRows = this.table.all(by.css('tr.ng-scope'));
  this.tableElements = element.all(by.repeater('item in (filtered = (items | selectedTableOptions:config.fields | search:config.searchOn:searchQuery | orderBy:orderBy:reverseSortOrder))'));
  this.createBtn = element(by.id('create-btn'));
  this.searchField = element(by.model('searchQuery'));
  this.actionsBtn = element(by.id('actions-btn'));
  this.tableColumnsDropDown = element(by.id('table-columns-dropdown'));
  this.tableColumnsDropDownOptions = this.tableColumnsDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.tableColumnsDropDownInputs = this.tableColumnsDropDown.all(by.css('input'));

  this.filteredResultsMessage = element(by.css('.filtered > span:nth-child(1)'));
  this.clearAllResultsLink = element(by.css('.filtered > a.ng-binding'));

  // Shared Form elements
  this.detailsPanel = element(by.css('.right-panel'));
  this.detailsForm = this.detailsPanel.element(by.css('.details-pane'));
  this.rightPanel = element(by.id('right-panel'));
  this.bulkActionsPanel = element(by.id('bulk-action-form'));
  this.submitFormBtn = this.rightPanel.element(by.id('submit-details-btn'));
  this.cancelFormBtn = this.rightPanel.element(by.id('cancel-details-btn'));
  this.closeFormBtn = this.detailsPanel.element(by.id('close-details-button'));
  this.message = element(by.css('.toast-message'));
  this.successMessage = element(by.css('.toast-success'));
  this.errorMessage = element(by.css('.toast-error'));
  this.closeMessageBtn = element(by.css('.toast-close-button'));

  // Modal
  this.confirmModal = element(by.css('#modal .confirm'));
  this.confirmModalCancelBtn = element(by.id('modal-cancel'));
  this.confirmModalOkBtn = element(by.id('modal-ok'));

  // Read Only Message
  this.readOnlyMessage = element(by.css('.lo-alert.lo-alert-info'));

  this.waitForSuccess = function () {
    browser.driver.wait(function() {
      return element(by.css('.toast-success')).isPresent().then(function (messageDisplayed) {
          return messageDisplayed;
      });
    }, 5000);
  };

  this.waitForError = function () {
    browser.driver.wait(function() {
      return element(by.css('.toast-error')).isPresent().then(function (messageDisplayed) {
          return messageDisplayed;
      });
    }, 5000);
  };

  this.waitForAlert = function () {
    browser.driver.wait(function() {
      return browser.driver.switchTo().alert().then(
        function() {
          return true;
        },
        function() {
          return false;
        }
      );
    }, 5000);
  };

  this.dismissChanges = function() {
    browser.driver.switchTo().alert().then(
      function(alert) {
        alert.accept();
      },
      function(err) {}
    );
  };

  this.cancelNavigation = function() {
    browser.driver.switchTo().alert().then(
      function(alert) {
        alert.dismiss();
      },
      function(err) {}
    );
  };

  this.waitForConfirm = function () {
    browser.driver.wait(function() {
      return element(by.css('#modal .confirm')).isPresent().then(function (confirmDisplayed) {
          return confirmDisplayed;
      });
    }, 5000);
  };

  this.tearDown = function() {
    // Ignore unsaved changes warnings
    browser.switchTo().alert().then(
      function(alert) {
        alert.accept();
      },
      function(err) {}
    );

    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(this.loginPageUrl);

    browser.executeScript('window.localStorage.clear()');
    browser.executeScript('window.sessionStorage.clear()');
  };
};

module.exports = new Shared();

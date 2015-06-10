'use strict';

var UserPage = function() {
  this.userTable = element(by.css('table-controls.ng-isolate-scope > table:nth-child(2)'));
  this.userDetails = element(by.id('right-panel'));

  this.userSearchField = element(by.model('searchQuery'));
  this.actionsBtn = element(by.buttonText('Actions'));
  this.createUserBtn = element(by.id('create-user-btn'));
  this.tableColumnsDropDown = element(by.css('filter-dropdown.ng-isolate-scope:nth-child(2)'));
  this.statusTableDropDown = element(by.css('th.ng-scope:nth-child(6) > filter-dropdown:nth-child(1)'));
  this.stateTableDropDown = element(by.css('th.ng-scope:nth-child(7) > filter-dropdown:nth-child(1)'));

  this.userElements = element.all(by.repeater('item in (filtered = (items | selectedTableOptions:config.fields | search:config.searchOn:searchQuery | orderBy:config.orderBy))'));

  this.firstNameFormField = element(by.model('resource.firstName'));
  this.lastNameFormField = element(by.model('resource.lastName'));
  this.displayNameFormField = element(by.model('resource.displayName'));
  this.emailFormField = element(by.model('resource.email'));
  this.passwordFormField = element(by.model('resource.password'));
  this.externalIdFormField = element(by.model('resource.externalId'));
  this.roleFormDropDown = element(by.model('resource.role'));
  this.stateFormDropDown = element(by.model('resource.state'));
  this.statusFormToggle = element(by.model('resource.status'));
  this.passwordEditFormBtn = element(by.buttonText('Reset Password'));

  this.cancelUserFormBtn = element(by.css('input.btn:nth-child(1)'));
  this.submitUserFormBtn = element(by.buttonText('Submit'));

  this.errors = element.all(by.css('.error'));

  this.userRoles = ['Admin', 'User', 'Other'];
  this.userStates = ['Busy', 'Logout', 'Ready', 'Login', 'Not Ready', 'Wrap']

  this.userNameDetailsHeader = element(by.css('h1.ng-binding'));
  this.userStateDetailsHeader = element(by.css('h1.ng-binding > user-state:nth-child(1) > div:nth-child(1)'));
  this.createNewUserHeader = element(by.css('h3.ng-scope'));
};

module.exports = new UserPage();

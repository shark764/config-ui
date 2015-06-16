'use strict';

var UserPage = function() {
  this.loadingMessage = element(by.id('.table-message > div:nth-child(1)'));

  this.statusTableDropDown = element(by.css('th.ng-scope:nth-child(7) > filter-dropdown:nth-child(1)'));
  this.stateTableDropDown = element(by.css('th.ng-scope:nth-child(8) > filter-dropdown:nth-child(1)'));

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

  this.errors = element.all(by.css('.error'));

  this.userStatuses = this.statusTableDropDown.all(by.repeater('option in options track by option[valuePath]'));
  this.userRoles = ['Admin', 'User', 'Other'];
  this.userStates = this.stateTableDropDown.all(by.repeater('option in options track by option[valuePath]'));

  this.userNameDetailsHeader = element(by.css('h1.ng-binding'));
  this.userStateDetailsHeader = element(by.css('h1.ng-binding > user-state:nth-child(1) > div:nth-child(1)'));
  this.createNewUserHeader = element(by.css('.info > h1:nth-child(1)'));
};

module.exports = new UserPage();

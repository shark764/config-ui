'use strict';

var UserPage = function() {
  this.userTable = element(by.css('.user-table'));
  this.userDetails = element(by.css('user-details'));

  this.userSearchField = element(by.model('searchQuery'));
  this.statusTableDropDown = element(by.css('.user-table > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(4) > filter-dropdown:nth-child(1)'));
  this.stateTableDropDown = element(by.css('.user-table > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(5) > filter-dropdown:nth-child(1)'));

  this.userElements = element.all(by.repeater('user in filteredUsers'));

  this.createUserBtn = element(by.id('create-user-btn'));

  this.firstNameFormField = element(by.model('user.firstName'));
  this.lastNameFormField = element(by.model('user.lastName'));
  this.displayNameFormField = element(by.model('user.displayName'));
  this.emailFormField = element(by.model('user.email'));
  this.passwordFormField = element(by.model('user.password'));
  this.externalIdFormField = element(by.model('user.externalId'));
  this.roleFormDropDown = element(by.model('user.role'));
  this.stateFormDropDown = element(by.model('user.state'));
  this.submitUserFormBtn = element(by.id('submit-user-form'));
  this.statusFormToggle = element(by.model('user.status'));

  this.errors = element.all(by.css('.error'));

  this.userRoles = ['Admin', 'User', 'Other'];
  this.userStates = ['Busy', 'Logout', 'Ready', 'Login', 'Not Ready', 'Wrap']

  this.userNameDetailsHeader = element(by.id('.user-name'));
  this.userDetailsHeader = element(by.id('.user-name'));
};

module.exports = new UserPage();

'use strict';

var UserPage = function() {
  this.loadingMessage = element(by.id('.table-message > div:nth-child(1)'));

  this.firstNameFormField = element(by.model('resource.firstName'));
  this.lastNameFormField = element(by.model('resource.lastName'));
  this.displayNameFormField = element(by.model('resource.displayName'));
  this.emailFormField = element(by.model('resource.email'));
  this.passwordFormField = element(by.model('resource.password'));
  this.externalIdFormField = element(by.model('resource.externalId'));
  this.passwordEditFormBtn = element(by.buttonText('Reset Password'));

  this.emailLabel = element(by.id('user-details-email'));
  this.error = element(by.css('.error'));
  this.requiredErrors = element.all(by.css('.error'));

  this.userNameDetailsHeader = element(by.css('h1.ng-binding'));
  this.userStateDetailsHeader = element(by.css('h1.ng-binding > user-state:nth-child(1) > div:nth-child(1)'));
  this.createNewUserHeader = element(by.css('h1.ng-scope'));

  this.firstTableRow = element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = element(by.css('tr.ng-scope:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.displayNameColumn = 'td:nth-child(3)';
  this.emailColumn = 'td:nth-child(4)';
  this.externalIdColumn = 'td:nth-child(5)';
  this.statusColumn = 'td:nth-child(6)';

  this.statusTableDropDown = element(by.css('filter-dropdown.ng-scope'));
  this.userStatuses = this.statusTableDropDown.all(by.repeater('option in options track by option[valuePath]'));
};

module.exports = new UserPage();

'use strict';

var UserPage = function() {
  this.loadingMessage = element(by.id('.table-message > div:nth-child(1)'));

  this.firstNameFormField = element(by.model('resource.firstName'));
  this.lastNameFormField = element(by.model('resource.lastName'));
  this.emailFormField = element(by.model('resource.email'));
  this.passwordFormField = element(by.model('resource.password'));
  this.externalIdFormField = element(by.model('resource.externalId'));
  this.passwordEditFormBtn = element(by.buttonText('Reset Password'));
  this.personalTelephoneFormField = element(by.model('resource.personalTelephone'));

  this.emailLabel = element(by.id('user-details-email'));
  this.error = element(by.css('.error'));
  this.requiredErrors = element.all(by.css('.error'));

  this.userNameDetailsHeader = element(by.css('h1.ng-binding'));
  this.userStateDetailsHeader = element(by.css('h1.ng-binding > user-state:nth-child(1) > div:nth-child(1)'));
  this.createNewUserHeader = element(by.css('h1.ng-scope'));

  this.tableHeader = element(by.css('#table-pane > div:nth-child(3) > table:nth-child(1)'));
  this.nameColumn = 'td:nth-child(2)';
  this.emailColumn = 'td:nth-child(3)';
  this.externalIdColumn = 'td:nth-child(4)';
  this.skillsColumn = 'td:nth-child(5)';
  this.groupsColumn = 'td:nth-child(6)';
  this.stateColumn = 'td:nth-child(7)';
  this.statusColumn = 'td:nth-child(8)';

  this.tableDropDowns = this.tableHeader.all(by.css('filter-dropdown'));
  this.statusTableDropDown = this.tableDropDowns.get(2);
  this.allUserStatus = this.statusTableDropDown.element(by.css('.all'));
  this.userStatuses = this.statusTableDropDown.all(by.repeater('option in options track by option[valuePath]'));
  this.userStatusInputs = this.statusTableDropDown.all(by.css('input'));
  
  this.statusBulkEnableCheck = element(by.id('user-status-bulk-enable-check'));
};

module.exports = new UserPage();

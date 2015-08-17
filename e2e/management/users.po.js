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
  this.activeFormToggle = element(by.model('resource.status'));

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

  //User Groups component
  this.addGroup = element(by.id('addGroup'));
  this.addGroupSearch = this.addGroup.element(by.css('input'));
  this.groupDropdownItems = this.addGroup.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:nameField)'));
  this.addGroupBtn = this.addGroup.element(by.id('add-group-btn'));
  this.noUserGroupsMessage = element(by.id('no-user-groups'));
  this.userGroups = element.all(by.repeater('userGroup in userGroups'));

  //User Skills component
  this.userSkills = element.all(by.css('user-skills'));
  this.addSkill = element(by.id('skillsForm'));
  this.addSkillSearch = this.addSkill.element(by.css('input'));
  this.skillDropdownItems = this.addSkill.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:nameField)'));
  this.skillProficiency = this.addSkill.element(by.css('.number-slider > input:nth-child(1)'))
  this.proficiencyCounterUp = this.addSkill.element(by.css('.top'))
  this.proficiencyCounterDown = this.addSkill.element(by.css('.bottom'))
  this.addSkillBtn = this.addSkill.element(by.id('add-skill-btn'));
  this.noUserSkillsMessage = element(by.id('no-user-skills'));
  this.userSkills = element.all(by.repeater('userSkill in userSkills | orderBy:\'name\''));
  this.userSkillTableRows = element.all(by.css('div.scrollable-table-container:nth-child(2) > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr'));
};

module.exports = new UserPage();

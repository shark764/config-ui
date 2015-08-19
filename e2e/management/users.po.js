'use strict';

var UserPage = function() {
  this.loadingMessage = element(by.id('.table-message > div:nth-child(1)'));

  this.emailFormField = element(by.model('resource.email'));
  this.roleFormDropdown = element(by.model('selectedTenantUser.roleId'));
  this.roleFormDropdownOptions = this.roleFormDropdown.all(by.css('option'));
  this.roles = ['Administrator', 'Supervisor', 'Agent'];
  
  this.inviteNowFormToggle = element(by.model('selectedTenantUser.status'));
  this.inviteNowHelp = element(by.id('invite-now-help'));
  this.tenantStatusHelp = element(by.id('tenant-status-help'));

  this.firstNameFormField = element(by.model('resource.firstName'));
  this.lastNameFormField = element(by.model('resource.lastName'));
  this.passwordFormField = element(by.model('resource.password'));
  this.externalIdFormField = element(by.model('resource.externalId'));
  this.passwordEditFormBtn = element(by.buttonText('Reset Password'));
  this.personalTelephoneFormField = element(by.model('resource.personalTelephone'));
  this.personalTelephoneHelp = element(by.id('personal-telephone-help'));
  this.activeFormToggle = element(by.model('resource.status'));

  this.emailLabel = element(by.id('user-details-email'));
  this.error = element(by.css('.error'));
  this.requiredErrors = element.all(by.css('.error'));

  this.userNameDetailsHeader = element(by.css('h1.ng-binding'));
  this.userStateDetailsHeader = element(by.css('h1.ng-binding > user-state:nth-child(1) > div:nth-child(1)'));
  this.createNewUserHeader = element(by.css('h1.ng-scope'));

  this.tablePane = element(by.id('table-pane'));
  this.tableHeader = this.tablePane.element(by.css('.clone-header'));
  this.nameColumn = 'td:nth-child(2)';
  this.emailColumn = 'td:nth-child(3)';
  this.externalIdColumn = 'td:nth-child(4)';
  this.skillsColumn = 'td:nth-child(5)';
  this.groupsColumn = 'td:nth-child(6)';
  this.rolesColumn = 'td:nth-child(7)';
  this.statusColumn = 'td:nth-child(8)';

  this.tableDropDowns = this.tableHeader.all(by.css('filter-dropdown'));

  // Status Table Dropdowns
  this.statusTableDropDown = this.tableHeader.element(by.id('user-status-table-column'));
  this.allUserStatus = this.statusTableDropDown.element(by.css('.all'));
  this.dropdownStatuses = this.statusTableDropDown.all(by.repeater('option in options | orderBy:orderBy track by (option | parse:valuePath | invoke:option)'));
  this.dropdownStatusInputs = this.statusTableDropDown.all(by.css('input'));

  // Roles Table Dropdowns
  this.rolesTableDropDown = this.tableHeader.element(by.id('user-state-table-column'));
  this.allUserRoles = this.rolesTableDropDown.element(by.css('.all'));
  this.dropdownRoles = this.rolesTableDropDown.all(by.repeater('option in options | orderBy:orderBy track by (option | parse:valuePath | invoke:option)'));
  this.dropdownRolesInputs = this.rolesTableDropDown.all(by.css('input'));

  // Skills Table Dropdowns
  this.skillsTableDropDown = this.tableHeader.element(by.id('user-skills-table-column'));
  this.allUserSkills = this.skillsTableDropDown.element(by.css('.all'));
  this.dropdownSkills = this.skillsTableDropDown.all(by.repeater('option in options | orderBy:orderBy track by (option | parse:valuePath | invoke:option)'));
  this.dropdownSkillsInputs = this.skillsTableDropDown.all(by.css('input'));

  // Groups Table Dropdowns
  this.groupsTableDropDown = this.tableHeader.element(by.id('user-groups-table-column'));
  this.allUserGroups = this.groupsTableDropDown.element(by.css('.all'));
  this.dropdownGroups = this.groupsTableDropDown.all(by.repeater('option in options | orderBy:orderBy track by (option | parse:valuePath | invoke:option)'));
  this.dropdownGroupsInputs = this.groupsTableDropDown.all(by.css('input'));

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

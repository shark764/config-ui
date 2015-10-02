'use strict';

var UserPage = function() {
  this.loadingMessage = element(by.id('.table-message > div:nth-child(1)'));

  this.userPanel = element(by.id('user-pane'));
  this.detailsForm = this.userPanel;
  this.rightPanel = element(by.id('right-panel'));
  this.bulkActionsPanel = element(by.css('bulk-action-executor.details-pane'));
  this.submitFormBtn = this.userPanel.element(by.id('submit-details-btn'));
  this.cancelFormBtn = this.userPanel.element(by.id('cancel-details-btn'));
  this.closeFormBtn = this.userPanel.element(by.id('close-details-button'));

  this.emailFormField = element(by.model('selectedTenantUser.email'));
  this.tenantRoleFormDropdown = element(by.model('selectedTenantUser.roleId'));
  this.tenantRoleFormDropdownOptions = this.tenantRoleFormDropdown.all(by.css('option'));
  this.tenantRoles = ['Administrator', 'Supervisor', 'Agent'];
  this.platformRoleFormDropdown = element(by.name('platformRoleId'));
  this.platformRoleFormDropdownOptions = this.platformRoleFormDropdown.all(by.css('option'));
  this.platformRoles = ['Platform User', 'Platform Administrator'];

  this.inviteNowFormToggle = element(by.model('selectedTenantUser.status'));
  this.inviteNowHelp = element(by.id('invite-now-help'));
  this.tenantStatus = this.userPanel.element(by.css('tenant-user-status'));
  this.tenantStatusHelp = element(by.id('tenant-status-help'));
  this.resendInvitationBtn = element(by.id('resend-invitation-btn'));
  this.userAlreadyExistsAlert = element(by.id('user-exists-alert'));

  this.firstNameFormField = element(by.model('selectedTenantUser.$user.firstName'));
  this.lastNameFormField = element(by.model('selectedTenantUser.$user.lastName'));
  this.passwordFormField = element(by.model('selectedTenantUser.$user.password'));
  this.externalIdFormField = element(by.model('selectedTenantUser.$user.externalId'));
  this.passwordEditFormBtn = element(by.buttonText('Reset Password'));
  this.personalTelephoneFormField = element(by.model('selectedTenantUser.$user.personalTelephone'));
  this.personalTelephoneHelp = element(by.id('personal-telephone-help'));
  this.activeFormToggle = element(by.css('.status-toggle'));

  this.emailLabel = element(by.id('user-details-email'));
  this.error = element(by.css('.lo-error'));
  this.requiredErrors = element.all(by.css('.lo-error'));

  this.userNameDetailsHeader = element(by.css('h1.ng-binding'));
  this.userStateDetailsHeader = element(by.css('h1.ng-binding > user-state:nth-child(1) > div:nth-child(1)'));
  this.createNewUserHeader = element(by.css('h1.ng-scope'));

  this.tablePane = element(by.id('table-pane'));
  this.tableHeader = this.tablePane.element(by.css('.clone-header'));
  this.nameColumn = 'td:nth-child(2)';
  this.emailColumn = 'td:nth-child(3)';
  this.externalIdColumn = 'td:nth-child(4)'; // Not displayed by default
  this.skillsColumn = 'td:nth-child(4)';
  this.groupsColumn = 'td:nth-child(5)';
  this.rolesColumn = 'td:nth-child(6)';
  this.presenceColumn = 'td:nth-child(7)';
  this.tenantStatusColumn = 'td:nth-child(8)';

  this.tableDropDowns = this.tableHeader.all(by.css('filter-dropdown'));

  // Status Table Dropdowns
  this.statusTableDropDown = this.tableHeader.element(by.id('user-status-table-column'));
  this.statusTableDropDownLabel = this.statusTableDropDown.element(by.css('.dropdown-label'));
  this.allUserStatus = this.statusTableDropDown.element(by.css('.all'));
  this.dropdownStatuses = this.statusTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.dropdownStatusInputs = this.statusTableDropDown.all(by.css('input'));

  // Status Table Dropdowns
  this.tenantStatusTableDropDown = this.tableHeader.element(by.id('tenant-status-table-column'));
  this.tenantStatusTableDropDownLabel = this.tenantStatusTableDropDown.element(by.css('.dropdown-label'));
  this.allUserTenantStatus = this.tenantStatusTableDropDown.element(by.css('.all'));
  this.dropdownTenantStatuses = this.tenantStatusTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.dropdownTenantStatusInputs = this.tenantStatusTableDropDown.all(by.css('input'));

  // Roles Table Dropdowns
  this.rolesTableDropDown = this.tableHeader.element(by.id('user-roles-table-column'));
  this.rolesTableDropDownLabel = this.rolesTableDropDown.element(by.css('.dropdown-label'));
  this.allUserRole = this.rolesTableDropDown.element(by.css('.all'));
  this.dropdownRoles = this.rolesTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.dropdownRolesInputs = this.rolesTableDropDown.all(by.css('input'));

  // Skills Table Dropdowns
  this.skillsTableDropDown = this.tableHeader.element(by.id('user-skills-table-column'));
  this.skillsTableDropDownLabel = this.skillsTableDropDown.element(by.css('.dropdown-label'));
  this.allUserSkills = this.skillsTableDropDown.element(by.css('.all'));
  this.dropdownSkills = this.skillsTableDropDown.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.dropdownSkillsInputs = this.skillsTableDropDown.all(by.css('input'));

  // Groups Table Dropdowns
  this.groupsTableDropDown = this.tableHeader.element(by.id('user-groups-table-column'));
  this.groupsTableDropDownLabel = this.groupsTableDropDown.element(by.css('.dropdown-label'));
  this.allUserGroups = this.groupsTableDropDown.element(by.css('.all'));
  this.dropdownGroups = this.groupsTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.dropdownGroupsInputs = this.groupsTableDropDown.all(by.css('input'));

  // Presence Table Dropdowns
  this.presenceTableDropDown = this.tableHeader.element(by.id('user-presence-table-column'));
  this.presenceTableDropDownLabel = this.presenceTableDropDown.element(by.css('.dropdown-label'));
  this.allUserPresence = this.presenceTableDropDown.element(by.css('.all'));
  this.dropdownPresence = this.presenceTableDropDown.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.dropdownPresenceInputs = this.presenceTableDropDown.all(by.css('input'));

  this.statusBulkEnableCheck = element(by.id('user-status-bulk-enable-check'));

  //User Groups component
  this.addGroup = element(by.id('addGroup'));
  this.addGroupSearch = this.addGroup.element(by.id('typeahead-container'));
  this.groupDropdownItems = this.addGroup.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.addGroupBtn = this.addGroup.element(by.id('add-group-btn'));
  this.noUserGroupsMessage = element(by.id('no-user-groups'));
  this.userGroups = element.all(by.repeater('userGroup in userGroups'));

  //User Skills component
  this.userSkills = element.all(by.css('user-skills'));
  this.addSkill = element(by.id('skillsForm'));
  this.addSkillSearch = this.addSkill.element(by.id('typeahead-container'));
  this.skillDropdownItems = this.addSkill.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.skillProficiency = this.addSkill.element(by.css('#new-user-skill-proficiency input'));
  this.proficiencyCounterUp = this.addSkill.element(by.css('.top'));
  this.proficiencyCounterDown = this.addSkill.element(by.css('.bottom'));
  this.addSkillBtn = this.addSkill.element(by.id('add-skill-btn'));
  this.noUserSkillsMessage = element(by.id('no-user-skills'));
  this.userSkills = element.all(by.repeater('userSkill in userSkills | orderBy:\'name\''));
  this.userSkillsTable = element(by.css('[name=userSkills]'));
  this.userSkillTableRows = element.all(by.repeater('userSkill in userSkills | orderBy:\'name\''));
  this.editSkillProficiency = 'userSkill.proficiency';
  this.editCounterUp = 'userSkill.proficiency';
  this.editCounterDown = 'userSkill.proficiency';
  this.editProficiencySave = element(by.id('save-proficiency-edit-btn'));
  this.editProficiencyCancel = element(by.id('cancel-proficiency-edit-btn'));
};

module.exports = new UserPage();

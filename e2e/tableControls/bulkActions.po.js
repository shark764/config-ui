'use strict';

var BulkActions = function() {
  this.tableHeader = element(by.css('.clone-header'));
  this.selectAllTableHeader = this.tableHeader.element(by.id('bulk-actions-select-table-header'));
  this.selectItemTableCells = element.all(by.id('bulk-actions-select-table-cell'));

  this.bulkActionsForm = element(by.id('bulk-action-form'));
  this.selectedItemsDropdownHeader = element(by.id('bulk-actions-selected-header'));
  this.selectedItemsDropdownHeaderLabel = element(by.css('#bulk-actions-selected-header > filter-dropdown:nth-child(1)'));
  this.selectedItemsDropdown = this.selectedItemsDropdownHeader.element(by.css('.dropdown'));
  this.selectedItemsDropdownElements = this.selectedItemsDropdown.all(by.repeater('option in options | orderBy:orderBy'));

  this.bulkActionDivs = element.all(by.css('.bulk-action'));

  // User Management Bulk Actions
  this.userSelectEnable = element(by.id('user-status-bulk-enable-check'));
  this.userDetailsPanel = element(by.id('user-pane'));
  this.selectInviteNow = element(by.id('user-invite-now-bulk-enable-check'));
  this.selectCancelInvite = element(by.id('user-cancel-invite-bulk-enable-check'));
  this.selectResendInvite = element(by.id('user-resend-invite-bulk-enable-check'));

  this.changeSkills = element(by.css('ba-user-skills'));
  this.selectChangeSkills = element(by.id('user-skill-bulk-enable-check'));
  this.firstSkillDiv = this.changeSkills.element(by.css('.skills-section'));
  this.skillsAffectedUsers = this.changeSkills.element(by.css('.affected-banner'));
  this.addNewSkillBtn = element(by.css('#user-skill-bulk > div:nth-child(3) > a:nth-child(1)'));
  this.addSkillDropdownFields = this.changeSkills.all(by.model('userSkillsBulkAction.selectedType'));
  this.skillProficiencyFields = this.changeSkills.all(by.id('user-skill-bulk-proficiency-field'));
  this.selectSkillsInputFields = this.changeSkills.all(by.model('userSkillsBulkAction.selectedSkill'));
  this.removeSkillBtns = this.changeSkills.all(by.css('.remove'));
  this.noSkillsMessage = this.changeSkills.element(by.css('p'));

  this.changeGroups = element(by.css('ba-user-groups'));
  this.selectChangeGroups = element(by.id('user-group-bulk-enable-check'));
  this.firstGroupDiv = this.changeGroups.element(by.css('ba-user-groups.ng-scope > div:nth-child(3)'));
  this.groupsAffectedUsers = this.changeGroups.element(by.css('.affected-banner'));
  this.addNewGroupBtn = element(by.css('#user-group-bulk > div:nth-child(3) > a:nth-child(1)'));
  this.addGroupDropdownFields = this.changeGroups.all(by.model('action.selectedType'));
  this.selectGroupsInputFields = this.changeGroups.all(by.model('action.selectedGroup'));
  this.removeGroupBtns = this.changeGroups.all(by.css('.remove'));
  this.noGroupsMessage = this.changeGroups.element(by.css('p'));

  // Skill Management Bulk Actions
  this.selectProficiency = element(by.id('skill-proficiency-bulk-enable-check'));
  this.proficiencyDropdownField = element(by.id('skill-proficiency-bulk-dropdown'));
  this.proficiencyDropdownOptions = this.proficiencyDropdownField.all(by.css('option'));

  // Generic Management Bulk Actions
  this.selectEnable = element(by.id('select-enable-bulk-action'));
  this.enableToggle = element(by.id('bulk-action-enable-toggle'));
  this.enableToggleSwitch = this.enableToggle.element(by.css('.switch-handle'));
  this.enableToggleClick = this.enableToggle.element(by.css('label:nth-child(2) > .switch-handle'));

  // Bulk Actions buttons
  this.submitFormBtn = this.bulkActionsForm.element(by.id('submit-bulk-actions-btn'));
  this.cancelFormBtn = this.bulkActionsForm.element(by.id('cancel-bulk-actions-btn'));
  this.closeFormBtn = element(by.id('close-bulk-button'))

  // Confirm bulk actions modal
  this.confirmModal = element(by.css('.confirm'));
  this.confirmHeader = this.confirmModal.element(by.css('.header'));
  this.confirmMessage = this.confirmModal.element(by.css('p'));
  this.confirmOK = this.confirmModal.element(by.id('modal-ok'));
  this.confirmCancel = this.confirmModal.element(by.id('modal-cancel'));

  // Status table selectors
  this.tableHeader = element(by.css('.clone-header > thead:nth-child(1)'));
  this.statusColumnDropDown = this.tableHeader.element(by.id('status-column-dropdown'));
  this.statusColumnDropDownLabel = this.statusColumnDropDown.element(by.css('.dropdown-label'));
  this.allStatus = this.statusColumnDropDown.element(by.css('.all'));
  this.statuses = this.statusColumnDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.statusInputs = this.statusColumnDropDown.all(by.css('input'));

  // Tenant Status table selectors
  this.tenantStatusColumnDropDown = this.tableHeader.element(by.id('tenant-status-table-column'));
  this.tenantStatusColumnDropDownLabel = this.tenantStatusColumnDropDown.element(by.css('.dropdown-label'));
  this.allTenantStatus = this.tenantStatusColumnDropDown.element(by.css('.all'));
  this.tenantStatuses = this.tenantStatusColumnDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.tenantStatusInputs = this.tenantStatusColumnDropDown.all(by.css('input'));
};

module.exports = new BulkActions();

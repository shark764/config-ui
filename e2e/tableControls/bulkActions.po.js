'use strict';

var BulkActions = function() {
  this.tableHeader = element(by.css('.clone-header'));
  this.selectAllTableHeader = this.tableHeader.element(by.id('bulk-actions-select-table-header'));
  this.selectItemTableCells = element.all(by.id('bulk-actions-select-table-cell'));

  this.bulkActionsForm = element(by.id('bulk-action-form'));
  this.selectedItemsDropdownHeader = element(by.id('bulk-actions-selected-header'));
  this.selectedItemsDropdownHeaderLabel = element(by.css('#bulk-actions-selected-header > filter-dropdown:nth-child(1)'));
  this.selectedItemsDropdown = this.selectedItemsDropdownHeader.element(by.css('.dropdown'));
  this.selectedItemsDropdownElements = this.selectedItemsDropdown.all(by.repeater('option in options | orderBy:orderBy track by option[valuePath]'));

  this.bulkActionDivs = element.all(by.css('.bulk-action'));

  // User Management Bulk Actions
  this.userSelectEnable = element(by.id('user-status-bulk-enable-check'));
  this.selectResetPassword = element(by.id('user-password-bulk-enable-check'));
  this.resetPasswordInputField = element(by.id('user-password-bulk-input-field'));

  this.changeSkills = element(by.css('ba-user-skills'));
  this.selectChangeSkills = element(by.id('user-skill-bulk-enable-check'));
  this.firstSkillDiv = this.changeSkills.element(by.css('.skills-section'));
  this.skillsAffectedUsers = this.changeSkills.element(by.css('.affected-banner'));
  this.addNewSkillBtn = element(by.css('#user-skill-bulk > div:nth-child(3) > a:nth-child(1)'));
  this.addSkillDropdownFields = this.changeSkills.all(by.model('userSkillsBulkAction.selectedType'));
  this.selectSkillsInputFields = this.changeSkills.all(by.model('userSkillsBulkAction.selectedSkill'));
  this.removeSkillBtns = this.changeSkills.all(by.css('.remove'));
  this.noSkillsMessage = this.changeSkills.element(by.css('p'));

  this.changeGroups = element(by.css('ba-user-groups'));
  this.selectChangeGroups = element(by.id('user-group-bulk-enable-check'));
  this.firstGroupDiv = this.changeSkills.element(by.css('ba-user-groups.ng-scope > div:nth-child(3)'));
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
  this.enableToggleClick = element(by.css('#bulk-action-enable-toggle > label:nth-child(2)'));

  // Bulk Actions buttons
  this.submitFormBtn = this.bulkActionsForm.element(by.id('submit-bulk-actions-btn'));
  this.cancelFormBtn = this.bulkActionsForm.element(by.id('cancel-bulk-actions-btn'));
  this.closeFormBtn = element(by.id('close-bulk-actions-btn'))

  // Confirm bulk actions modal
  this.confirmModal = element(by.css('.confirm'));
  this.confirmHeader = this.confirmModal.element(by.css('.header'));
  this.confirmMessage = this.confirmModal.element(by.css('p'));
  this.confirmOK = this.confirmModal.element(by.id('modal-ok'));
  this.confirmCancel = this.confirmModal.element(by.id('modal-cancel'));

  // Status table selectors
  this.tableHeader = element(by.css('#table-pane > div:nth-child(3) > table:nth-child(1)'));
  this.statusTableDropDown = this.tableHeader.element(by.css('filter-dropdown:nth-child(2)'));
  this.dispatchMappingsStatusTableDropDown = element(by.css('.clone-header > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(7) > filter-dropdown:nth-child(2)'));
  this.allStatus = this.statusTableDropDown.element(by.css('.all'));
  this.statuses = this.statusTableDropDown.all(by.repeater('option in options | orderBy:orderBy track by option[valuePath]'));
  this.statusInputs = this.statusTableDropDown.all(by.css('input'));
};

module.exports = new BulkActions();
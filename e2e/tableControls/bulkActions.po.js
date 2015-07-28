'use strict';

var BulkActions = function() {
  this.selectAllTableHeader = element(by.id('bulk-actions-select-table-header'));
  this.selectItemTableCell = element(by.id('bulk-actions-select-table-cell'));

  this.bulkActionsForm = element(by.id('bulk-action-form'));
  this.selectedItemsDropdownHeader = element(by.id('bulk-actions-selected-header'));
  this.selectedItemsDropdown = this.selectedItemsDropdownHeader.element(by.css('.dropdown'));
  this.selectedItemsDropdownElements = this.selectedItemsDropdown.all(by.repeater('option in options track by option[valuePath]'));

  this.bulkActionDivs = element.all(by.css('.bulk-action'));

  // User Management Bulk Actions
  this.userSelectEnable = element(by.id('user-status-bulk-enable-check'));
  this.selectResetPassword = element(by.id('user-password-bulk-enable-check'));
  this.resetPasswordInputField = element(by.id('user-password-bulk-input-field'));

  this.changeSkills = element(by.id('user-skill-bulk'));
  this.selectChangeSkills = element(by.id('user-skill-bulk-enable-check'));
  this.skillsAffectedUsers = this.changeSkills.element(by.css('.affected-banner'));
  this.addNewSkillBtn = this.changeSkills.element(by.css('.btn'));
  this.addSkillDropdownFields = this.changeSkills.element.all(by.model('userSkillsBulkAction.selectedType'));
  this.selectSkillsInputFields = this.changeSkills.element.all(by.model('userSkillsBulkAction.selectedSkill'));
  this.removeSkillBtns = this.changeSkills.element.all(by.css('.remove'));

  this.changeGroups = element(by.id('user-group-bulk'));
  this.selectChangeGroups = element(by.id('user-group-bulk-enable-check'));
  this.groupsAffectedUsers = this.changeGroups.element(by.css('.affected-banner'));
  this.addNewGroupBtn = this.changeGroups.element(by.css('.btn'));
  this.addGroupDropdownFields = this.changeGroups.element.all(by.model('userGroupsBulkAction.selectedType'));
  this.selectGroupsInputFields = this.changeGroups.element.all(by.model('userGroupsBulkAction.selectedGroup'));
  this.removeGroupBtns = this.changeGroups.element.all(by.css('.remove'));

  // Skill Management Bulk Actions
  this.selectProficiency = element(by.id('skill-proficiency-bulk-enable-check'));
  this.proficiencyDropdownField = element(by.id('skill-proficiency-bulk-dropdown'));
  this.proficiencyDropdownOptions = this.proficiencyDropdownField.all(by.css('option'));

  // Generic Management Bulk Actions
  this.selectEnable = element(by.id('select-enable-bulk-action'));
  this.enableToggle = element(by.id('bulk-action-enable-toggle'));
};

module.exports = new BulkActions();

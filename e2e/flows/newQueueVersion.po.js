'use strict';

var NewQueueVersion = function() {
  // CREATE NEW QUEUE VERSION
  this.newQueueVersionPanel = element(by.id('queue-version-panel'));

  this.newVersionDetails = this.newQueueVersionPanel.element(by.id('create-new-version-details'));
  this.createVersionHeader = this.newQueueVersionPanel.element(by.id('create-new-queue-version-header'));
  this.createVersionBtn = this.newQueueVersionPanel.element(by.id('create-version-btn'));
  this.cancelVersionBtn = this.newQueueVersionPanel.element(by.id('cancel-version-btn'));

  this.showAdvancedQueryLink = this.newQueueVersionPanel.element(by.id('show-advanced-query'));
  this.showBasicQueryLink = this.newQueueVersionPanel.element(by.id('show-basic-query'));

  // Query Fields
  this.newQueueQuerySection = this.newQueueVersionPanel.element(by.id('selected-queue-version-section'));

  this.addFilterSection = this.newQueueVersionPanel.element(by.id('add-query-filter'));
  this.addFilterDropdown = this.addFilterSection.element(by.id('select-filter-dropdown'));
  this.groupFilterDropdownOption = this.addFilterDropdown.all(by.css('[value=":groups"]'));
  this.skillFilterDropdownOption = this.addFilterDropdown.all(by.css('[value=":skills"]'));
  this.userFilterDropdownOption = this.addFilterDropdown.all(by.css('[value=":user-id"]'));
  this.addFilterBtn = this.addFilterSection.element(by.id('add-filter-btn'));

  this.basicQueryDetails = this.newQueueVersionPanel.element(by.id('version-basic-query-details'));
  this.basicQueryDetailsAll = this.newQueueVersionPanel.all(by.repeater('condition in cqe.conditionGroup.conditions'));

  this.advancedQueryFormField = this.newQueueVersionPanel.element(by.id('advanced-query-field'));

  this.basicQueryAllGroups = this.newQueueVersionPanel.element(by.id(':groups-all'));
  this.allGroupsTypeAhead = this.basicQueryAllGroups.element(by.id('typeahead-container'));
  this.allGroupsDropdownGroups = this.basicQueryAllGroups.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:getDisplayString)'));
  this.allGroupsAdd = this.basicQueryAllGroups.element(by.css('.fa-plus'));
  this.allGroupsSelected = this.basicQueryAllGroups.all(by.repeater('condition in cqe.conditionGroup.conditions'));

  this.basicQueryAnyGroups = this.newQueueVersionPanel.element(by.id(':groups-any'));
  this.anyGroupsTypeAhead = this.basicQueryAnyGroups.element(by.id('typeahead-container'));
  this.anyGroupsDropdownGroups = this.basicQueryAnyGroups.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:getDisplayString)'));
  this.anyGroupsAdd = this.basicQueryAnyGroups.element(by.css('.fa-plus'));
  this.anyGroupsSelected = this.basicQueryAnyGroups.all(by.repeater('condition in cqe.conditionGroup.conditions'));

  this.basicQueryAllSkills = this.newQueueVersionPanel.element(by.id(':skills-all'));
  this.allSkillsTypeAhead = this.basicQueryAllSkills.element(by.id('typeahead-container'));
  this.allSkillsDropdownSkills = this.basicQueryAllSkills.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:getDisplayString)'));
  this.allSkillsProficiencyOperator = this.basicQueryAllSkills.element(by.id('proficiency-operator-dropdown'));
  this.allSkillsProficiencyValue = this.basicQueryAllSkills.element(by.id('proficiency-value'));
  this.allSkillsAdd = this.basicQueryAllSkills.element(by.css('.fa-plus'));
  this.allSkillsSelected = this.basicQueryAllSkills.all(by.repeater('condition in cqe.conditionGroup.conditions'));

  this.basicQueryAnySkills = this.newQueueVersionPanel.element(by.id(':skills-any'));
  this.anySkillsTypeAhead = this.basicQueryAnySkills.element(by.id('typeahead-container'));
  this.anySkillsDropdownSkills = this.basicQueryAnySkills.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:getDisplayString)'));
  this.anySkillsProficiencyOperator = this.basicQueryAnySkills.element(by.id('proficiency-operator-dropdown'));
  this.anySkillsProficiencyValue = this.basicQueryAnySkills.element(by.id('proficiency-value'));
  this.anySkillsAdd = this.basicQueryAnySkills.element(by.css('.fa-plus'));
  this.anySkillsSelected = this.basicQueryAnySkills.all(by.repeater('condition in cqe.conditionGroup.conditions'));

  this.basicQueryAllUsers = this.newQueueVersionPanel.element(by.id(':user-id-all'));

  this.basicQueryAnyUsers = this.newQueueVersionPanel.element(by.id(':user-id-any'));
  this.anyUsersTypeAhead = this.basicQueryAnyUsers.element(by.id('typeahead-container'));
  this.anyUsersDropdownUsers = this.basicQueryAnyUsers.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:getDisplayString)'));
  this.anyUsersAdd = this.basicQueryAnyUsers.element(by.css('.fa-plus'));
  this.anyUsersSelected = this.basicQueryAnyUsers.all(by.repeater('condition in cqe.conditionGroup.conditions'));

  // Priority Fields
  this.minPriorityInputField = this.newQueueVersionPanel.element(by.id('version-min-priority'));
  this.maxPriorityInputField = this.newQueueVersionPanel.element(by.id('version-max-priority'));
  this.priorityValueInputField = this.newQueueVersionPanel.element(by.id('version-priority-value'));
  this.priorityRateInputField = this.newQueueVersionPanel.element(by.id('version-priority-rate'));
  this.priorityRateUnitField = this.newQueueVersionPanel.element(by.id('version-rate-units-input'));
};

module.exports = new NewQueueVersion();

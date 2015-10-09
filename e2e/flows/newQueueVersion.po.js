'use strict';

var NewQueueVersion = function() {
  // CREATE NEW QUEUE VERSION
  this.newQueueVersionPanel = element(by.id('queue-version-panel'));

  this.newVersionDetails = this.newQueueVersionPanel.element(by.id('create-new-version-details'));
  this.createVersionHeader = this.newQueueVersionPanel.element(by.id('create-new-queue-version-header'));
  this.createVersionBtn = this.newQueueVersionPanel.element(by.id('create-version-btn'));
  this.cancelVersionBtn = this.newQueueVersionPanel.element(by.id('cancel-version-btn'));

  // Query Fields
  this.newQueueQuerySection = this.newQueueVersionPanel.element(by.id('selected-queue-version-section'));

  this.basicQueryDetails = this.newQueueVersionPanel.element(by.id('version-basic-query-details'));
  this.basicQueryDetailsAll = this.newQueueVersionPanel.all(by.repeater('operand in operands'));

  this.advancedQueryFormField = this.newQueueVersionPanel.element(by.id('advanced-query-field'));

  this.basicQueryAllGroups = this.newQueueVersionPanel.element(by.id('basic-query-all-groups'));
  this.allGroupsTypeAhead = this.basicQueryAllGroups.element(by.id('typeahead-container'));
  this.allGroupsDropdownGroups = this.basicQueryAllGroups.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.allGroupsAdd = this.basicQueryAllGroups.element(by.css('.fa-plus'));
  this.allGroupsSelected = this.basicQueryAllGroups.all(by.repeater('operand in operands'));

  this.basicQueryAnyGroups = this.newQueueVersionPanel.element(by.id('basic-query-any-groups'));
  this.anyGroupsTypeAhead = this.basicQueryAnyGroups.element(by.id('typeahead-container'));
  this.anyGroupsDropdownGroups = this.basicQueryAnyGroups.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.anyGroupsAdd = this.basicQueryAnyGroups.element(by.css('.fa-plus'));
  this.anyGroupsSelected = this.basicQueryAnyGroups.all(by.repeater('operand in operands'));

  this.basicQueryAllSkills = this.newQueueVersionPanel.element(by.id('basic-query-all-skills'));
  this.allSkillsTypeAhead = this.basicQueryAllSkills.element(by.id('typeahead-container'));
  this.allSkillsDropdownSkills = this.basicQueryAllSkills.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.allSkillsProficiencyOperator = this.basicQueryAllSkills.element(by.id('proficiency-operator-dropdown'));
  this.allSkillsProficiencyValue = this.basicQueryAllSkills.element(by.id('proficiency-value'));
  this.allSkillsAdd = this.basicQueryAllSkills.element(by.css('.fa-plus'));
  this.allSkillsSelected = this.basicQueryAllSkills.all(by.repeater('operand in operands'));

  this.basicQueryAnySkills = this.newQueueVersionPanel.element(by.id('basic-query-any-skills'));
  this.anySkillsTypeAhead = this.basicQueryAnySkills.element(by.id('typeahead-container'));
  this.anySkillsDropdownSkills = this.basicQueryAnySkills.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.anySkillsProficiencyOperator = this.basicQueryAnySkills.element(by.id('proficiency-operator-dropdown'));
  this.anySkillsProficiencyValue = this.basicQueryAnySkills.element(by.id('proficiency-value'));
  this.anySkillsAdd = this.basicQueryAnySkills.element(by.css('.fa-plus'));
  this.anySkillsSelected = this.basicQueryAnySkills.all(by.repeater('operand in operands'));

  // Priority Fields
  this.minPriorityInputField = this.newQueueVersionPanel.element(by.id('version-min-priority'));
  this.maxPriorityInputField = this.newQueueVersionPanel.element(by.id('version-max-priority'));
  this.priorityValueInputField = this.newQueueVersionPanel.element(by.id('version-priority-value'));
  this.priorityRateInputField = this.newQueueVersionPanel.element(by.id('version-priority-rate'));
  this.priorityRateUnitField = this.newQueueVersionPanel.element(by.id('version-rate-units-input'));
};

module.exports = new NewQueueVersion();

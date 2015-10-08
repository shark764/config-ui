'use strict';

var NewQueue = function() {
  // CREATE NEW QUEUE QUERY FIELDS
  // Query Fields
  this.newQueueQuerySection = element(by.id('create-new-queue-query-details'));

  this.showAdvancedQueryLink = this.newQueueQuerySection.element(by.id('show-advanced-query'));
  this.showBasicQueryLink = this.newQueueQuerySection.element(by.id('show-basic-query'));

  this.basicQueryDetails = this.newQueueQuerySection.element(by.id('version-basic-query-details'));
  this.basicQueryDetailsAll = this.newQueueQuerySection.element(by.repeater('operand in operands'));
  this.basicQueryAllGroupDetails = this.newQueueQuerySection.$('.group-query[operator=every]');
  this.basicQueryAnyGroupDetails = this.newQueueQuerySection.$('.group-query[operator=some]');
  this.basicQueryAllSkillDetails = this.newQueueQuerySection.$('.skill-query[operator=and]');
  this.basicQueryAnySkillDetails = this.newQueueQuerySection.$('.skill-query[operator=or]');

  this.advancedQueryFormField = this.newQueueQuerySection.element(by.id('advanced-query-field'));

  this.basicQueryAllGroups = this.newQueueQuerySection.element(by.id('basic-query-all-groups'));
  this.allGroupsTypeAhead = this.basicQueryAllGroups.element(by.id('typeahead-container'));
  this.allGroupsDropdownGroups = this.basicQueryAllGroups.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.allGroupsAdd = this.basicQueryAllGroups.element(by.css('.fa-plus'));
  this.allGroupsSelected = this.basicQueryAllGroups.all(by.repeater('operand in operands'));

  this.basicQueryAnyGroups = this.newQueueQuerySection.element(by.id('basic-query-any-groups'));
  this.anyGroupsTypeAhead = this.basicQueryAnyGroups.element(by.id('typeahead-container'));
  this.anyGroupsDropdownGroups = this.basicQueryAnyGroups.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.anyGroupsAdd = this.basicQueryAnyGroups.element(by.css('.fa-plus'));
  this.anyGroupsSelected = this.basicQueryAnyGroups.all(by.repeater('operand in operands'));

  this.basicQueryAllSkills = this.newQueueQuerySection.element(by.id('basic-query-all-skills'));
  this.allSkillsTypeAhead = this.basicQueryAllSkills.element(by.id('typeahead-container'));
  this.allSkillsDropdownGroups = this.basicQueryAllSkills.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.allSkillsProficiencyOperator = this.basicQueryAllSkills.element(by.id('proficiency-operator-dropdown'));
  this.allSkillsProficiencyValue = this.basicQueryAllSkills.element(by.id('proficiency-value'));
  this.allSkillsAdd = this.basicQueryAllSkills.element(by.css('.fa-plus'));
  this.allSkillsSelected = this.basicQueryAllSkills.all(by.repeater('operand in operands'));

  this.basicQueryAnySkills = this.newQueueQuerySection.element(by.id('basic-query-any-skills'));
  this.anySkillsTypeAhead = this.basicQueryAnySkills.element(by.id('typeahead-container'));
  this.anySkillsDropdownGroups = this.basicQueryAnySkills.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.anySkillsProficiencyOperator = this.basicQueryAnySkills.element(by.id('proficiency-operator-dropdown'));
  this.anySkillsProficiencyValue = this.basicQueryAnySkills.element(by.id('proficiency-value'));
  this.anySkillsAdd = this.basicQueryAnySkills.element(by.css('.fa-plus'));
  this.anySkillsSelected = this.basicQueryAnySkills.all(by.repeater('operand in operands'));

  // Priority Fields
  this.minPriorityInputField = this.newQueueQuerySection.element(by.id('version-min-priority'));
  this.maxPriorityInputField = this.newQueueQuerySection.element(by.id('version-max-priority'));
  this.priorityValueInputField = this.newQueueQuerySection.element(by.id('version-priority-value'));
  this.priorityRateInputField = this.newQueueQuerySection.element(by.id('version-priority-rate'));
  this.priorityRateUnitField = this.newQueueQuerySection.element(by.id('version-rate-units-input'));
};

module.exports = new NewQueue();

'use strict';

var QueuePage = function() {
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.activeVersionDropdown = element(by.id('active-version-field'));
  this.activeFormToggle = element(by.model('resource.status'));
  this.createdByAudit = element(by.id('created-by-audit'));
  this.updatedByAudit = element(by.id('updated-by-audit'));

  // Query Fields
  this.showAdvancedQueryLink = element(by.id('show-advanced-query'));
  this.showBasicQueryLink = element(by.id('show-basic-query'));

  this.basicQueryDetailsAll = element.all(by.repeater('operand in operands'));
  this.basicQueryAllGroupDetails = $('.group-query[operator=every]');
  this.basicQueryAnyGroupDetails = $('.group-query[operator=some]');
  this.basicQueryAllSkillDetails = $('.skill-query[operator=and]');
  this.basicQueryAnySkillDetails = $('.skill-query[operator=or]');

  this.advancedQueryFormField = element(by.id('advanced-query-field'));

  this.basicQueryAllGroups = element(by.id('basic-query-all-groups'));
  this.allGroupsTypeAhead = this.basicQueryAllGroups.element(by.id('typeahead-container'));
  this.allGroupsDropdownGroups = this.basicQueryAllGroups.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.allGroupsAdd = this.basicQueryAllGroups.element(by.css('.fa .fa-plus'));
  this.allGroupsSelected = this.basicQueryAllGroups.all(by.repeater('operand in operands'));

  this.basicQueryAnyGroups = element(by.id('basic-query-any-groups'));
  this.anyGroupsTypeAhead = this.basicQueryAnyGroups.element(by.id('typeahead-container'));
  this.anyGroupsDropdownGroups = this.basicQueryAnyGroups.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.anyGroupsAdd = this.basicQueryAnyGroups.element(by.css('.fa .fa-plus'));
  this.anyGroupsSelected = this.basicQueryAnyGroups.all(by.repeater('operand in operands'));

  this.basicQueryAllSkills = element(by.id('basic-query-all-skills'));
  this.allSkillsTypeAhead = this.basicQueryAllSkills.element(by.id('typeahead-container'));
  this.allSkillsDropdownGroups = this.basicQueryAllSkills.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.allSkillsProficiencyOperator = this.basicQueryAllSkills.element(by.id('proficiency-operator-dropdown'));
  this.allSkillsProficiencyValue = this.basicQueryAllSkills.element(by.id('proficiency-value'));
  this.allSkillsAdd = this.basicQueryAllSkills.element(by.css('.fa .fa-plus'));
  this.allSkillsSelected = this.basicQueryAllSkills.all(by.repeater('operand in operands'));

  this.basicQueryAnySkills = element(by.id('basic-query-any-skills'));
  this.anySkillsTypeAhead = this.basicQueryAnySkills.element(by.id('typeahead-container'));
  this.anySkillsDropdownGroups = this.basicQueryAnySkills.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.anySkillsProficiencyOperator = this.basicQueryAnySkills.element(by.id('proficiency-operator-dropdown'));
  this.anySkillsProficiencyValue = this.basicQueryAnySkills.element(by.id('proficiency-value'));
  this.anySkillsAdd = this.basicQueryAnySkills.element(by.css('.fa .fa-plus'));
  this.anySkillsSelected = this.basicQueryAnySkills.all(by.repeater('operand in operands'));

  // Priority Fields
  this.minPriorityInputField = element(by.id('version-min-priority'));
  this.minPriorityDefault = '1';
  this.maxPriorityInputField = element(by.id('version-max-priority'));
  this.maxPriorityDefault = '1000';
  this.priorityValueInputField = element(by.id('version-priority-value'));
  this.priorityValueDefault = '1';
  this.priorityRateInputField = element(by.id('version-priority-rate'));
  this.priorityRateDefault = '10';
  this.priorityRateUnitField = element(by.id('version-rate-units-input'));
  this.priorityRateUnitDefault = 'seconds';

  // Queue Versions
  this.queueVersionsTable = element(by.id('queue-version-table'));
  this.queueVersions = this.queueVersionsTable.all(by.repeater('version in fetchVersions() | orderBy:\'created\':\'reverse\''));
  this.activeVersion = this.queueVersionsTable.element(by.css('.fa .fa-circle'));
  this.copyVersionBtn = element(by.css('create-version-copy-btn'));

  // Queue Version Copy
  this.newQueueVersionPanel = element(by.id('queue-version-panel'));
  this.createVersionHeader = this.newQueueVersionPanel.element(by.id('create-new-queue-version-header'));
  this.createVersionBtn = this.newQueueVersionPanel.element(by.id('create-version-btn'));
  this.cancelVersionBtn = this.newQueueVersionPanel.element(by.id('cancel-version-btn'));

  this.requiredErrors = element.all(by.css('.lo-error'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.activeVersionColumn = 'td:nth-child(4)';
  this.statusColumn = 'td:nth-child(5)';
};

module.exports = new QueuePage();

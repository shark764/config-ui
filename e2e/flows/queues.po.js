'use strict';

var QueuePage = function() {
  this.nameFormField = element(by.model('qc.selectedQueue.name'));
  this.descriptionFormField = element(by.model('qc.selectedQueue.description'));
  this.activeVersionDropdown = element(by.id('active-version-field'));
  this.activeFormToggle = element(by.model('qc.selectedQueue.active'));
  this.createdByAudit = element(by.id('created-by-audit'));
  this.updatedByAudit = element(by.id('updated-by-audit'));
  this.queueDetailsPane = element(by.id('details-pane'));

  this.requiredErrors = element.all(by.css('.lo-error'));
  this.showAdvancedQueryLink = this.queueDetailsPane.element(by.id('show-advanced-query'));
  this.showBasicQueryLink = this.queueDetailsPane.element(by.id('show-basic-query'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.activeVersionColumn = 'td:nth-child(4)';
  this.statusColumn = 'td:nth-child(5)';

  this.addNewVersionBtn = element(by.id('add-queue-version-btn'));

  this.minPriorityDefault = '1';
  this.maxPriorityDefault = '1000';
  this.priorityValueDefault = '1';
  this.priorityRateDefault = '10';
  this.priorityRateUnitDefault = 'seconds';

  // EXISTING QUEUE VERSIONS
  this.noVersionsMsg = element(by.id('no-versions-msg'));
  this.versionsTable = element(by.css('.queue-version-table'));
  this.queueVersions = this.versionsTable.all(by.css('[id^=version-row]')); // All rows with id that starts with 'version-row'
  this.activeVersion = this.versionsTable.element(by.css('.fa-circle'));
  this.copyVersionBtn = element.all(by.id('create-version-copy-btn'));
  this.basicQueryDetails = element.all(by.id('version-basic-query-details'));

  this.basicQueryAllGroupSection = this.versionsTable.element(by.id(':groups-all'));
  this.basicQueryAnyGroupSection = this.versionsTable.element(by.id(':groups-any'));
  this.basicQueryAllSkillSection = this.versionsTable.element(by.id(':skills-all'));
  this.basicQueryAnySkillSection = this.versionsTable.element(by.id(':skills-any'));
  this.basicQueryAnyUserSection = this.versionsTable.element(by.id(':user-id-any'));

  this.basicQueryAllGroups = this.basicQueryAllGroupSection.all(by.repeater('condition in cqe.conditionGroup.conditions'));
  this.basicQueryAnyGroups = this.basicQueryAnyGroupSection.all(by.repeater('condition in cqe.conditionGroup.conditions'));
  this.basicQueryAllSkills = this.basicQueryAllSkillSection.all(by.repeater('condition in cqe.conditionGroup.conditions'));
  this.basicQueryAnySkills = this.basicQueryAnySkillSection.all(by.repeater('condition in cqe.conditionGroup.conditions'));
  this.basicQueryAnyUsers = this.basicQueryAnyUserSection.all(by.repeater('condition in cqe.conditionGroup.conditions'));

  this.advancedQueryFormField = this.versionsTable.all(by.id('advanced-query-field'));

  // Priority Fields
  this.minPriorityInputField = this.versionsTable.all(by.id('version-min-priority'));
  this.maxPriorityInputField = this.versionsTable.all(by.id('version-max-priority'));
  this.priorityValueInputField = this.versionsTable.all(by.id('version-priority-value'));
  this.priorityRateInputField = this.versionsTable.all(by.id('version-priority-rate'));
  this.priorityRateUnitField = this.versionsTable.all(by.id('version-rate-units-input'));
};

module.exports = new QueuePage();

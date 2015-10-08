'use strict';

var QueuePage = function() {
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.activeVersionDropdown = element(by.id('active-version-field'));
  this.activeFormToggle = element(by.model('selectedQueue.active'));
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
  this.versionsTable = element(by.css('.queue-version-table'));
  this.queueVersions = this.versionsTable.all(by.css('[id^=version-row]')); // All rows with id that starts with 'version-row'
  this.activeVersion = this.versionsTable.element(by.css('.fa-circle'));
  this.copyVersionBtn = element.all(by.id('create-version-copy-btn'));
  this.basicQueryDetails = element.all(by.id('version-basic-query-details'));

  this.basicQueryAllGroupDetails = this.versionsTable.all(by.css('[operator=every]'));
  this.basicQueryAnyGroupDetails = this.versionsTable.all(by.css('[operator=some]'));
  this.basicQueryAllSkillDetails = this.versionsTable.all(by.css('[operator=and]'));
  this.basicQueryAnySkillDetails = this.versionsTable.all(by.css('[operator=or]'));

  this.advancedQueryFormField = this.versionsTable.all(by.id('advanced-query-field'));

  // Priority Fields
  this.minPriorityInputField = this.versionsTable.all(by.id('version-min-priority'));
  this.maxPriorityInputField = this.versionsTable.all(by.id('version-max-priority'));
  this.priorityValueInputField = this.versionsTable.all(by.id('version-priority-value'));
  this.priorityRateInputField = this.versionsTable.all(by.id('version-priority-rate'));
  this.priorityRateUnitField = this.versionsTable.all(by.id('version-rate-units-input'));
};

module.exports = new QueuePage();

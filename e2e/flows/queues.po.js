'use strict';

var QueuePage = function() {
  this.nameFormField = element(by.model('selectedQueue.name'));
  this.descriptionFormField = element(by.model('selectedQueue.description'));
  this.activeVersionDropdown = element(by.model('currVersion'));
  this.activeFormToggle = element(by.model('selectedQueue.active'));

  this.activeVersionQuery = element(by.model('curr-version.query'));
  this.activeVersionPriority = element(by.id('curr-version-priority'));
  this.activeVersionRate = element(by.id('curr-version-rate'));
  this.activeVersionRateUnit = element(by.id('curr-version-rate-units'));

  this.versionsTable = element(by.css('.queue-version-table'));
  this.versionRowV1 = element(by.id('version-row-v1'));
  this.versionRowDetailsV1 = element(by.id('view-version-v1'));
  this.versionRowV1Plus = this.versionRowV1.element(by.css('.fa-plus'));
  this.versionRowV1Minus = this.versionRowV1.element(by.css('.fa-minus'));
  this.copyVersionBtn = this.versionRowDetailsV1.element(by.id('copy-version-btn'));
  this.closeVersionBtn = this.versionRowDetailsV1.element(by.id('close-version-btn'));

  this.versionRowV2 = element(by.id('version-row-v2'));
  this.versionRowDetailsV2 = element(by.id('view-version-v2'));

  this.createVersionNumberFormField = element(by.id('create-version-number'));
  this.createVersionQueryFormField = element(by.model('extendScope.initialVersion.query'));
  this.createVersionMinPriorityFormField = element(by.id('curr-version-min-priority'));
  this.createVersionMaxPriorityFormField = element(by.id('curr-version-max-priority'));
  this.createVersionPriorityValueFormField = element(by.id('curr-version-priority-value'));
  this.createVersionRateFormField = element(by.id('curr-version-priority-rate'));
  this.createVersionRateUnitDropdown = element(by.id('create-version-rate-units-input'));

  this.requiredErrors = element.all(by.css('.lo-error'));

  this.selectedVersionQuery = this.versionRowDetailsV1.element(by.model('version.query'));
  this.selectedVersionMinPriority = this.versionRowDetailsV1.element(by.id('curr-version-min-priority'));
  this.selectedVersionMaxPriority = this.versionRowDetailsV1.element(by.id('curr-version-max-priority'));
  this.selectedVersionRate = this.versionRowDetailsV1.element(by.id('curr-version-priority-rate'));
  this.selectedVersionRateUnit = this.versionRowDetailsV1.element(by.id('create-version-rate-units-input'));

  this.copyVersionNumberFormField = element(by.id('copy-version-number'));
  this.copyVersionQueryFormField = element(by.model('versionCopy.query'));
  this.copyVersionMinPriorityFormField = element(by.id('curr-version-min-priority'));
  this.copyVersionMaxPriorityFormField = element(by.id('curr-version-max-priority'));
  this.copyVersionRateFormField = element(by.id('curr-version-priority-rate'));
  this.copyVersionRateUnitDropdown = element(by.id('create-version-rate-units-input'));
  this.createVersionBtn = element(by.id('create-queue-version-btn'));
  this.cancelVersionBtn = element(by.id('cancel-queue-version-btn'));

  this.firstTableRow = element(by.css('#items-table > tbody:nth-child(2) > tr:nth-child(1)'));
  this.secondTableRow = element(by.css('#items-table > tbody:nth-child(2) > tr:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
};

module.exports = new QueuePage();

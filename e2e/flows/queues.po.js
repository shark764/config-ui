'use strict';

var QueuePage = function() {
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.activeVersionDropdown = element(by.model('currVersion'));
  this.activeFormToggle = element(by.model('resource.status'));

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
  this.createVersionQueryFormField = element(by.model('extendScope.initialQuery'));
  this.createVersionPriorityFormField = element(by.id('create-version-priority-input'));
  this.createVersionRateFormField = element(by.id('create-version-rate-input'));
  this.createVersionRateUnitDropdown = element(by.id('create-version-rate-units-input'));
  this.createVersionBtn = element(by.id('create-queue-version-btn'));
  this.cancelVersionBtn = element(by.id('cancel-queue-version-btn'));

  this.requiredErrors = element.all(by.css('.error'));

  this.selectedVersionQuery = element(by.model('version.query'));
  this.selectedVersionPriority = element(by.id('selected-version-priority-input'));
  this.selectedVersionRate = element(by.id('selected-version-rate-input'));
  this.selectedVersionRateUnit = element(by.id('selected-version-rate-units-input'));

  this.copyVersionNumberFormField = element(by.id('copy-version-number'));
  this.copyVersionQueryFormField = element(by.model('versionCopy.query'));
  this.copyVersionPriorityFormField = element(by.id('copy-version-priority-input'));
  this.copyVersionRateFormField = element(by.id('copy-version-rate-input'));
  this.copyVersionRateUnitDropdown = element(by.id('copy-version-rate-units-input'));

  this.firstTableRow = element(by.css('#items-table > tbody:nth-child(2) > tr:nth-child(1)'));
  this.secondTableRow = element(by.css('#items-table > tbody:nth-child(2) > tr:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
};

module.exports = new QueuePage();

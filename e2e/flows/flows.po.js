'use strict';

var FlowPage = function() {
  this.nameFormField = element(by.model('selectedFlow.name'));
  this.descriptionFormField = element(by.model('selectedFlow.description'));
  this.typeFormDropdown = element(by.model('selectedFlow.type'));
  this.activeFormToggle = element(by.model('selectedFlow.active'));
  this.activeVersionDropdown = element(by.model('selectedFlow.activeVersion'));

  this.versionsTable = element(by.id('flow-details-versions-table'));
  this.versionsTableElements =  this.versionsTable.all(by.repeater('version in getVersions() | orderBy:\'created\':\'reverse\''));
  this.versionNameFormField = element(by.model('version.name'));
  this.versionDescriptionFormField = element(by.model('version.description'));

  this.createModal = element(by.id('modal'));
  this.modalHeader = this.createModal.element(by.css('h3'));
  this.modalNameField = this.createModal.element(by.model('flow.name'));
  this.modalTypeDropdown = this.createModal.element(by.model('flow.type'));
  this.customerTypeOption = this.createModal.element(by.css('[label="Customer"]'));
  this.resourceTypeOption = this.createModal.element(by.css('[label="Resource"]'));
  this.reusableTypeOption = this.createModal.element(by.css('[label="Reusable"]'));
  this.submitModalBtn = this.createModal.element(by.id('modal-ok'));
  this.cancelModalBtn = this.createModal.element(by.id('modal-cancel'));
  this.modalErrors = this.createModal.element.by(css('form-error'));

  this.requiredErrors = element.all(by.css('.lo-error'));

  this.firstTableRow = element(by.css('#items-table > tbody:nth-child(2) > tr:nth-child(1)'));
  this.secondTableRow = element(by.css('#items-table > tbody:nth-child(2) > tr:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.activeVersionColumn = 'td:nth-child(3)';

  this.showCreateNewVersionBtn = element(by.id("show-create-new-version"));
  this.cancelVersionFormBtn = element(by.id('cancel-flow-version-btn'));;
  this.createVersionFormBtn = element(by.id('create-flow-version-btn'));;
};

module.exports = new FlowPage();

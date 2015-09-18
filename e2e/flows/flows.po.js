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

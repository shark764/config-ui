'use strict';

var FlowPage = function() {
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.typeFormDropdown = element(by.model('resource.type'));
  this.activeFormToggle = element(by.model('resource.active'));
  this.activeVersionDropdown = element(by.model('resource.activeVersion'));

  this.versionsTable = element(by.id('flow-details-versions-table'));
  this.versionsTableElements =  this.versionsTable.all(by.repeater('version in versions | orderBy:\'created\':\'reverse\''));
  this.versionNameFormField = element(by.model('version.name'));
  this.versionDescriptionFormField = element(by.model('version.description'));

  this.requiredErrors = element.all(by.css('.error'));

  this.firstTableRow = element(by.css('.table > tbody:nth-child(2) > tr:nth-child(1)'));
  this.secondTableRow = element(by.css('.table > tbody:nth-child(2) > tr:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.activeVersionColumn = 'td:nth-child(3)';

  this.showCreateNewVersionBtn = element(by.id("show-create-new-version"));
  this.cancelVersionFormBtn = element(by.id('cancel-flow-version-btn'));;
  this.createVersionFormBtn = element(by.id('create-flow-version-btn'));;
};

module.exports = new FlowPage();

'use strict';

var FlowPage = function() {
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.typeFormDropdown = element(by.model('resource.type'));
  this.activeFormToggle = element(by.model('originalResource.status'));
  this.activeVersionDropdown = element(by.model('resource.activeVersion'));

  this.versionsTable =  element(by.css('flow-versions.ng-isolate-scope > table:nth-child(1)'));
  this.versionsTableElements =  this.versionsTable.all(by.repeater('version in versions track by $index'));
  this.versionNameFormField = element(by.model('version.name'));
  this.versionDescriptionFormField = element(by.model('version.description'));
  this.createVersionBtn = element(by.css('input.btn:nth-child(3)'));

  this.requiredErrors = element.all(by.css('.error'));

  this.firstTableRow = element(by.css('.table > tbody:nth-child(2) > tr:nth-child(1)'));
  this.secondTableRow = element(by.css('.table > tbody:nth-child(2) > tr:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.activeVersionColumn = 'td:nth-child(3)';
};

module.exports = new FlowPage();

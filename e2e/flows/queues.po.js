'use strict';

var QueuePage = function() {
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.activeVersionDropdown = element(by.model('resource.activeVersion'));
  this.activeFormToggle = element(by.model('originalResource.status'));

  this.versionsTable =  element(by.css('queue-versions.ng-isolate-scope > table:nth-child(1)'));
  this.versionsTableElements =  this.versionsTable.all(by.repeater('version in versions | orderBy:\'created\':\'reverse\''));
  this.versionNameFormField = element(by.model('version.name'));
  this.versionDescriptionFormField = element(by.model('version.description'));
  this.versionQueryFormField = element(by.model('version.query'));
  this.createVersionBtn = element(by.id('create-queue-version-btn'));
  this.requiredErrors = element.all(by.css('.error'));

  this.firstTableRow = element(by.css('.table > tbody:nth-child(2) > tr:nth-child(1)'));
  this.secondTableRow = element(by.css('.table > tbody:nth-child(2) > tr:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
};

module.exports = new QueuePage();

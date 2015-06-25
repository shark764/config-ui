'use strict';

var GroupsPage = function() {
  this.creatingGroupHeader = element(by.css('.details-header'));
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.activeFormToggle = element(by.model('resource.status'));

  this.nameHeader = element(by.css('h1.ng-binding'));
  this.detailsMemberCount = element(by.css('.count'));

  this.firstTableRow = element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = element(by.css('tr.ng-scope:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.membersColumn = 'td:nth-child(4)';

  this.nameRequiredError = element.all(by.css('.error'));
};

module.exports = new GroupsPage();

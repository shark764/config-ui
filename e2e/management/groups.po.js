'use strict';

var GroupsPage = function() {
  this.creatingGroupHeader = element(by.css('h1.ng-binding:nth-child(2)'));
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.activeFormToggle = element(by.model('resource.status'));

  this.nameHeader = element(by.id('group-details-name-header'));
  this.detailsMemberCount = element(by.css('.count'));

  this.tablePane = element(by.id('table-pane'));
  this.firstTableRow = this.tablePane.element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = this.tablePane.element(by.css('tr.ng-scope:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.membersColumn = 'td:nth-child(4)';

  this.nameRequiredError = element.all(by.css('.error'));
};

module.exports = new GroupsPage();

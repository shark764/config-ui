'use strict';

var GroupsPage = function() {
  this.creatingGroupHeader = element(by.css('h1.ng-binding:nth-child(2)'));
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.activeFormToggle = element(by.model('resource.active'));

  this.nameHeader = element(by.id('group-details-name-header'));
  this.detailsMemberCount = element(by.css('.count'));

  this.tablePane = element(by.id('table-pane'));
  this.headerRow = this.tablePane.element(by.css('.clone-header tr'));
  this.firstTableRow = this.tablePane.element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = this.tablePane.element(by.css('tr.ng-scope:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.membersColumn = 'td:nth-child(4)';
  this.statusColumn = 'td:nth-child(5)';

  this.nameRequiredError = element.all(by.css('.lo-error'));

  this.groupMembersLoading = element(by.css('#right-panel loading'));
  this.groupMembersEmpty = element(by.css('#right-panel #empty-members-message'));
  this.groupMembersRows = element.all(by.repeater('user in resource.fetchGroupUsers()'));
};

module.exports = new GroupsPage();

'use strict';

var Columns = function() {
  this.dropdownFilter = element(by.css('#table-columns-dropdown  > div:nth-child(2) > div:nth-child(1)'));
  this.options = element.all(by.repeater('option in options track by option[valuePath]'));
  this.optionCheckboxes = this.dropdownFilter.all(by.css('input'));

  this.users = ['Name', 'Email', 'ID', 'State', 'Status'];
  this.groups = ['Name', 'Description', 'Members', 'Status'];
  this.skills = ['Name', 'Description', 'Members', 'Proficiency', 'Status'];
  this.tenants = ['Name', 'Description', 'Status'];
  this.integrations = ['Type', 'Account', 'Status', 'WebRTC'];
  this.dispatchMappings = ['Name', 'Description', 'Value', 'Interaction Field', 'Channel Type', 'Status'];
  this.flows = ['Name', 'Description', 'Active Version'];
  this.queues = ['Name', 'Description', 'Active Version', 'Status'];
  this.mediaCollections = ['Name', 'Description', 'Identifier'];
  this.media = ['Name', 'Source', 'Type', 'Properties'];

  this.userDefaults = ['Name', 'Display Name', 'Email', 'ID'];

  this.selectAll = element(by.css('th.check-col > input:nth-child(1)'));

  this.tablePane = element(by.id('table-pane'));
  this.itemTable = this.tablePane.element(by.id('items-table'));
  this.columnTwo = this.itemTable.element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2)'));
  this.columnThree = this.itemTable.element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(3)'));
  this.columnFour = this.itemTable.element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(4)'));
  this.columnFive = this.itemTable.element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(5)'));
  this.columnSix = this.itemTable.element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(6)'));
  this.columnSeven = this.itemTable.element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(7)'));
  this.columnEight = this.itemTable.element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(8)'));

  this.tableHeader = this.tablePane.element(by.css('.clone-header'));
  this.columnTwoHeader = this.tableHeader.element(by.css('th.ng-scope:nth-child(2)'));
  this.columnThreeHeader = this.tableHeader.element(by.css('th.ng-scope:nth-child(3)'));
  this.columnFourHeader = this.tableHeader.element(by.css('th.ng-scope:nth-child(4)'));
  this.columnFiveHeader = this.tableHeader.element(by.css('th.ng-scope:nth-child(5)'));
  this.columnSixHeader = this.tableHeader.element(by.css('th.ng-scope:nth-child(6)'));
  this.columnSevenHeader = this.tableHeader.element(by.css('th.ng-scope:nth-child(7)'));
  this.columnEightHeader = this.tableHeader.element(by.css('th.ng-scope:nth-child(8)'));
};

module.exports = new Columns();

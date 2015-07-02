'use strict';

var Columns = function() {
  this.dropdownFilter = element(by.css('#table-columns-dropdown  > div:nth-child(2) > div:nth-child(1)'));
  this.options = element.all(by.repeater('option in options track by option[valuePath]'));
  this.optionCheckboxes = this.dropdownFilter.all(by.css('input'));

  this.users = ['Name', 'Display Name', 'Email', 'ID', 'State', 'Status'];
  this.groups = ['Group Name', 'Description', 'Members', 'Status'];
  this.skills = ['Skill', 'Description', 'Members', 'Proficiency', 'Status'];
  this.tenants = ['Name', 'Description', 'Status'];
  this.integrations = ['Type', 'Account', 'Status', 'WebRTC'];
  this.dispatchMappings = ['Name', 'Description', 'Value', 'Interaction Field', 'Channel Type', 'Status'];
  this.flows = ['Name', 'Description', 'Active Version'];
  this.queues = ['Name', 'Description', 'Active Version', 'Status'];
  this.mediaCollections = ['Name', 'Description', 'Identifiers'];
  this.media = ['Source', 'Type', 'Properties'];

  this.userDefaults = ['Name', 'Display Name', 'Email', 'ID'];

  this.selectAll = element(by.css('th.check-col > input:nth-child(1)'));

  this.columnTwo = element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2)'));
  this.columnThree = element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(3)'));
  this.columnFour = element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(4)'));
  this.columnFive = element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(5)'));
  this.columnSix = element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(6)'));
  this.columnSeven = element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(7)'));
  this.columnEight = element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(8)'));

  this.columnTwoHeader = element(by.css('th.ng-scope:nth-child(2)'));
  this.columnThreeHeader = element(by.css('th.ng-scope:nth-child(3)'));
  this.columnFourHeader = element(by.css('th.ng-scope:nth-child(4)'));
  this.columnFiveHeader = element(by.css('th.ng-scope:nth-child(5)'));
  this.columnSixHeader = element(by.css('th.ng-scope:nth-child(6)'));
  this.columnSevenHeader = element(by.css('th.ng-scope:nth-child(7)'));
  this.columnEightHeader = element(by.css('th.ng-scope:nth-child(8)'));
};

module.exports = new Columns();

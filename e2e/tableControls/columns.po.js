'use strict';

var Columns = function() {
  this.dropdownFilter = element(by.css('#table-columns-dropdown  > div:nth-child(2) > div:nth-child(1)'));
  this.options = element.all(by.repeater('option in options | orderBy:orderBy'));
  this.optionCheckboxes = this.dropdownFilter.all(by.css('input'));

  this.users = ['Name', 'Email', 'ID', 'Skills', 'Groups', 'State', 'Status'];
  this.groups = ['Name', 'Description', 'Members', 'Status'];
  this.skills = ['Name', 'Description', 'Proficiency', 'Status'];
  this.tenants = ['Name', 'Description', 'Status'];
  this.interactions = ['Type', 'Account', 'Status', 'WebRTC'];
  this.dispatchMappings = ['Name', 'Description', 'Value', 'Interaction Field', 'Channel Type', 'Status'];
  this.flows = ['Name', 'Description', 'Active Version', 'Status'];
  this.queues = ['Name', 'Description', 'Active Version', 'Status'];
  this.mediaCollections = ['Name', 'Description', 'Identifier'];
  this.media = ['Name', 'Source', 'Type', 'Properties'];

  this.userDefaults = ['Name', 'Email', 'ID', 'Skills', 'Groups'];

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

  this.allFilterDropDowns = this.tableHeader.all(by.css('filter-dropdown'));

  // Status Table Dropdowns
  this.statusTableDropDown = this.tableHeader.element(by.id('status-column-dropdown'));
  this.statusTableDropDownLabel = this.statusTableDropDown.element(by.css('.dropdown-label'));
  this.allStatus = this.statusTableDropDown.element(by.css('.all'));
  this.dropdownStatuses = this.statusTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.dropdownStatusInputs = this.statusTableDropDown.all(by.css('input'));

  // Skill Proficiency Table Dropdowns
  this.proficiencyTableDropDown = this.tableHeader.element(by.id('proficiency-column-dropdown'));
  this.proficiencyTableDropDownLabel = this.proficiencyTableDropDown.element(by.css('.dropdown-label'));
  this.allSkillProficiency = this.proficiencyTableDropDown.element(by.css('.all'));
  this.dropdownProficiencies = this.proficiencyTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.dropdownProficiencyInputs = this.proficiencyTableDropDown.all(by.css('input'));

  // Interaction WebRTC Table Dropdowns
  this.webRTCTableDropDown = this.tableHeader.element(by.id('webRtc-column-dropdown'));
  this.webRTCTableDropDownLabel = this.webRTCTableDropDown.element(by.css('.dropdown-label'));
  this.allWebRTCs = this.webRTCTableDropDown.element(by.css('.all'));
  this.dropdownWebRTCOptions = this.webRTCTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.dropdownWebRTCInputs = this.webRTCTableDropDown.all(by.css('input'));

  // Media Type Table Dropdowns
  this.typeTableDropDown = this.tableHeader.element(by.id('type-column-dropdown'));
  this.typeTableDropDownLabel = this.typeTableDropDown.element(by.css('.dropdown-label'));
  this.allTypes = this.typeTableDropDown.element(by.css('.all'));
  this.dropdownTypes = this.typeTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.dropdownTypeInputs = this.typeTableDropDown.all(by.css('input'));

  // Dispatch Mapping Interaction Field Table Dropdowns
  this.interactionTableDropDown = this.tableHeader.element(by.id('interaction-column-dropdown'));
  this.interactionTableDropDownLabel = this.interactionTableDropDown.element(by.css('.dropdown-label'));
  this.allInteractions = this.interactionTableDropDown.element(by.css('.all'));
  this.dropdownInteractions = this.interactionTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.dropdownInteractionInputs = this.interactionTableDropDown.all(by.css('input'));

  // Dispatch Mapping Channel Type Table Dropdowns
  this.channelTypeTableDropDown = this.tableHeader.element(by.id('channelType-column-dropdown'));
  this.channelTypeTableDropDownLabel = this.channelTypeTableDropDown.element(by.css('.dropdown-label'));
  this.allChannelTypes = this.channelTypeTableDropDown.element(by.css('.all'));
  this.dropdownChannelTypes = this.channelTypeTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.dropdownChannelTypeInputs = this.channelTypeTableDropDown.all(by.css('input'));
};

module.exports = new Columns();

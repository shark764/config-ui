'use strict';

var DispatchMappingsPage = function() {
  this.creatingDispatchMappingHeader = element(by.id('dispatch-mappings-details-create-header'));
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.interactionTypeDropdown = element(by.model('resource.channelType'));
  this.mappingDropdown = element(by.model('resource.interactionField'));
  this.flowDropdown = element(by.model('resource.flowId'));
  this.valueFormField = element(by.model('resource.value'));

  this.nameHeader = element(by.id('dispatch-mappings-details-name-header'));
  this.statusSwitch = element(by.model('resource.active'));
  this.statusSwitchInput = this.statusSwitch.element(by.css('label:nth-child(2) > input:nth-child(1)'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.valueColumn = 'td:nth-child(4)';
  this.interactionFieldColumn = 'td:nth-child(5)';
  this.channelTypeColumn = 'td:nth-child(6)';
  this.statusColumn = 'td:nth-child(7)';

  this.requiredErrors = element.all(by.css('.lo-error'));

  this.interactionTypes = ('Voice');

  this.mappingOptions = this.mappingDropdown.all(by.css('option'));
  this.phoneFormField = element(by.id('phone-form-field'));
  this.integrationFormDropdown = element(by.id('integration-form-dropdown'));
  this.integrationValues = element.all(by.repeater('integration.id as integration.type for integration in integrations'));
  this.directionFormDropdown = element(by.id('direction-form-dropdown'));
  this.directions = ('Outbound');

  // Status table selectors
  this.tableHeader = element(by.css('.clone-header > thead:nth-child(1)'));
  this.statusTableDropDown = this.tableHeader.element(by.id('status-column-dropdown'));
  this.statusTableDropDownLabel = this.statusTableDropDown.element(by.css('.dropdown-label'));
  this.allStatus = this.statusTableDropDown.element(by.css('.all'));
  this.statuses = this.statusTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
  this.statusInputs = this.statusTableDropDown.all(by.css('input'));

  this.interactionFieldTableDropDown = this.tableHeader.element(by.id('interaction-column-dropdown'));
  this.interactionFieldDropDownLabel = this.interactionFieldTableDropDown.element(by.css('.dropdown-label'));
  this.interactionFields = this.interactionFieldTableDropDown.all(by.repeater('option in options | orderBy:orderBy'));
};

module.exports = new DispatchMappingsPage();

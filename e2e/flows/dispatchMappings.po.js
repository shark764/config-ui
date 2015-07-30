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

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.valueColumn = 'td:nth-child(4)';
  this.interactionFieldColumn = 'td:nth-child(5)';
  this.channelTypeColumn = 'td:nth-child(6)';
  this.statusColumn = 'td:nth-child(7)';

  this.requiredErrors = element.all(by.css('.error'));

  this.interactionTypes = ('Voice');

  this.mappingOptions = this.mappingDropdown.all(by.css('option'));
  this.phoneFormField = element(by.id('phone-form-field'));
  this.integrationFormDropdown = element(by.id('integration-form-dropdown'));
  this.integrationValues = element.all(by.repeater('integration.id as integration.type for integration in integrations'));
  this.directionFormDropdown = element(by.id('direction-form-dropdown'));
  this.directions = ('Outbound');

  // Status table selectors
  this.tableHeader = element(by.css('#table-pane > div:nth-child(3) > table:nth-child(1)'));
  this.statusTableDropDown = this.tableHeader.element(by.css('tr:nth-child(1) > th:nth-child(7) > filter-dropdown:nth-child(1)'));
  this.allStatus = this.statusTableDropDown.element(by.css('.all'));
  this.statuses = this.statusTableDropDown.all(by.repeater('option in options track by option[valuePath]'));
  this.statusInputs = this.statusTableDropDown.all(by.css('input'));
};

module.exports = new DispatchMappingsPage();

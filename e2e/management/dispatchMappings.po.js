'use strict';

var DispatchMappingsPage = function() {
  this.creatingDispatchMappingHeader = element(by.id('dispatch-mapping-details-create-header'));
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.interactionTypeDropdown = element(by.model('resource.channelType'));
  this.mappingDropdown = element(by.model('resource.interactionField'));
  this.flowDropdown = element(by.model('resource.flowId'));
  this.value = element(by.model('resource.value'));

  this.typeHeader = element(by.id('dispatch-mapping-details-name-header'));
  this.statusSwitch = element(by.model('resource.status'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.valueColumn = 'td:nth-child(4)';
  this.interactionFieldColumn = 'td:nth-child(5)';
  this.channelTypeColumn = 'td:nth-child(6)';
  this.statusColumn = 'td:nth-child(7)';

  this.requiredErrors = element.all(by.css('.error'));

  this.interactionTypes = ('voice');

  this.mappings = ('Customer', 'Contact Point', 'Integration', 'Direction');
  this.phoneFormField = element(by.id('phone-form-field'));
  this.integrationFormDropdown = element(by.id('integration-form-dropdown'));
  this.integrationValues = element(by.repeater('integration.id as integration.type for integration in integrations'));
  this.directionFormDropdown = element(by.id('direction-form-dropdown'));
  this.directions = ('Outbound');
};

module.exports = new DispatchMappingsPage();

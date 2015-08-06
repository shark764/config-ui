'use strict';

var IntegrationsPage = function() {
  this.creatingIntegrationHeader = element(by.id('integration-details-create-header'));
  this.accountSIDFormField = element(by.model('resource.properties.accountSid'));
  this.authTokenFormField = element(by.model('resource.properties.authToken'));
  this.webRTCFormSwitch = element(by.model('resource.properties.webRtc'));

  this.typeHeader = element(by.id('integration-details-type-header'));
  this.statusSwitch = element(by.model('resource.active'));

  this.typeColumn = 'td:nth-child(2)';
  this.accountColumn = 'td:nth-child(3)';
  this.statusColumn = 'td:nth-child(4)';
  this.webRTCColumn = 'td:nth-child(5)';

  this.requiredErrors = element.all(by.css('.error'));
};

module.exports = new IntegrationsPage();

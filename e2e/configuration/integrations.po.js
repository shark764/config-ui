'use strict';

var IntegrationsPage = function() {
  this.typeHeader = element(by.id('integration-details-type-header'));
  this.statusSwitch = element(by.model('selectedIntegration.active'));
  this.statusSwitchToggle = this.statusSwitch.element(by.css('label:nth-child(2) > input:nth-child(1)'));

  // birst fields
  this.spaceIdFormField = element(by.model('selectedIntegration.properties.birstSpaceId'));
  this.ssoPasswordFormField = element(by.model('selectedIntegration.properties.birstSsoPassword'));
  this.baseURLFormField = element(by.model('selectedIntegration.properties.birstBaseUrl'));
  this.adminPasswordFormField = element(by.model('selectedIntegration.properties.birstAdminPassword'));
  this.adminUsernameFormField = element(by.model('selectedIntegration.properties.birstAdminUsername'));

  // client fields
  this.accessKeyFormField = element(by.model('selectedIntegration.properties.accessKey'));
  this.secretKeyFormField = element(by.model('selectedIntegration.properties.secretKey'));

  // twilio fields
  this.accountSIDFormField = element(by.model('selectedIntegration.properties.accountSid'));
  this.authTokenFormField = element(by.model('selectedIntegration.properties.authToken'));
  this.webRTCFormSwitch = element(by.model('selectedIntegration.properties.webRtc'));
  this.webRTCFormSwitchToggle = this.webRTCFormSwitch.element(by.css('label:nth-child(2) > input:nth-child(1)'));

  this.typeColumn = 'td:nth-child(2)';
  this.statusColumn = 'td:nth-child(3)';

  this.requiredErrors = element.all(by.css('.lo-error'));
};

module.exports = new IntegrationsPage();

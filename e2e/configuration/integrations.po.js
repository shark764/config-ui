'use strict';

var IntegrationsPage = function() {
  this.typeHeader = element(by.id('integration-details-type-header'));
  this.statusSwitch = element(by.model('resource.active'));
  this.statusSwitchToggle = this.statusSwitch.element(by.css('label:nth-child(2) > input:nth-child(1)'));

  // birst fields
  this.spaceIdFormField = element(by.model('resource.properties.birstSpaceId'));
  this.ssoPasswordFormField = element(by.model('resource.properties.birstSsoPassword'));
  this.baseURLFormField = element(by.model('resource.properties.birstBaseUrl'));
  this.adminPasswordFormField = element(by.model('resource.properties.birstAdminPassword'));
  this.adminUsernameFormField = element(by.model('esource.properties.birstAdminUsername'));

  // client fields
  this.accessKeyFormField = element(by.model('resource.properties.accessKey'));
  this.secretKeyFormField = element(by.model('resource.properties.secretKey'));

  // twilio fields
  this.accountSIDFormField = element(by.model('resource.properties.authToken'));
  this.authTokenFormField = element(by.model('resource.properties.accountSid'));
  this.webRTCFormSwitch = element(by.model('resource.properties.webRtc'));
  this.webRTCFormSwitchToggle = this.webRTCFormSwitch.element(by.css('label:nth-child(2) > input:nth-child(1)'));

  this.typeColumn = 'td:nth-child(2)';
  this.statusColumn = 'td:nth-child(3)';

  this.requiredErrors = element.all(by.css('.lo-error'));
};

module.exports = new IntegrationsPage();

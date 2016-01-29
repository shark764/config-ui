'use strict';

var Extensions = function() {
  this.extensionsSection = element(by.css('lo-extensions'));

  this.typeDropdown = this.extensionsSection.element(by.id('extension-type-dropdown'));
  this.pstnDropdownOption = this.typeDropdown.element(by.css('[label="PSTN"]'));
  this.webRtcDropdownOption = this.typeDropdown.element(by.css('[label="WebRTC"]'));
  this.sipDropdownOption = this.typeDropdown.element(by.css('[label="SIP"]'));

  this.providerDropdown = this.extensionsSection.element(by.id('extension-provider-dropdown'));
  this.twilioDropdownOption = this.providerDropdown.element(by.css('[label="Twilio"]'));
  this.plivoDropdownOption = this.providerDropdown.element(by.css('[label="Plivo"]'));

  this.pstnValueFormField = this.extensionsSection.element(by.model('phoneNumber'));
  this.extFormField = this.extensionsSection.element(by.id('extension-ext-field'));

  this.sipValueFormField = this.extensionsSection.element(by.model('sipExtension'));

  this.descriptionFormField = this.extensionsSection.element(by.model('newExtension.description'));
  this.addBtn = this.extensionsSection.element(by.id('add-extension-btn'));

  this.errors = this.extensionsSection.all(by.css('.lo-error'));

  this.table = this.extensionsSection.element(by.css('.lo-extension-table-body'));
  this.userExtensions = this.table.all(by.css('.lo-extension-table-row'));
  this.sortingHandles = this.table.all(by.css('.handle'));
  this.removeBtns = this.table.all(by.css('.remove'));

  this.primary = this.table.element(by.css('div:nth-child(1)'));
  this.primaryValue = this.primary.element(by.css('.phone-number-col'));

  this.webRtcTwilio = this.table.element(by.id('WebRTC-Twilio'));
  this.webRtcTwilioValue = this.webRtcTwilio.element(by.css('.phone-number-col'));
  this.webRtcTwilioRemove = this.webRtcTwilio.element(by.css('.remove-col'));
};

module.exports = new Extensions();

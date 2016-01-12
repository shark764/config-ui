'use strict';

var MediaPage = function() {
  this.creatingMediaHeader = element(by.css('.detail-header-pane'));

  this.nameFormField = element(by.model('selectedMedia.name'));
  this.typeFormDropdown = element(by.model('selectedMedia.type'));
  this.requiredError = element.all(by.css('.lo-error'));
  this.submitFormBtn = element(by.id('submit-details-btn'));

  // Text-to-Speech fields
  this.ttsSourceFormField = element(by.id('tts-source-field'));
  this.languageFormDropdown = element(by.id('tts-property-language-field'));
  this.languageOptions = this.languageFormDropdown.all(by.css('option'));
  this.voiceFormDropdown = element(by.id('tts-property-voice-field'));
  this.voiceOptions = this.voiceFormDropdown.all(by.css('option'));

  // Audio fields
  this.audioSourceFormField = element(by.id('audio-source-url-field'));
  this.sourceUploadAudioName = element(by.id('audio-source-upload-file'));
  this.sourceUploadAudioBtn = element(by.id('audio-source-upload-btn'));

  this.nameColumn = 'td:nth-child(2)';
  this.sourceColumn = 'td:nth-child(3)';
  this.typeColumn = 'td:nth-child(4)';
  this.propertiesColumn = 'td:nth-child(5)';
};

module.exports = new MediaPage();

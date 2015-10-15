'use strict';

var MediaPage = function() {
  this.creatingMediaHeader = element(by.css('.detail-header-pane'));

  this.nameFormField = element(by.model('selectedMedia.name'));
  this.ttsSourceFormField = element(by.id('tts-source-field'));
  this.typeFormDropdown = element(by.model('selectedMedia.type'));
  this.requiredError = element.all(by.css('.lo-error'));

  this.sourceUploadAudioName = element(by.model('selectedMedia.$sourceAudioFile.name'));
  this.sourceUploadAudioBtn = element(by.model('selectedMedia.$sourceAudioFile'));
  this.audioSourceFormField = element(by.id('audio-source-url-field'));

  this.submitFormBtn = element(by.id('submit-details-btn'));

  this.nameColumn = 'td:nth-child(2)';
  this.sourceColumn = 'td:nth-child(3)';
  this.typeColumn = 'td:nth-child(4)';
  this.propertiesColumn = 'td:nth-child(5)';
};

module.exports = new MediaPage();

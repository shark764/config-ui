'use strict';

var MediaCollectionsPage = function() {

  this.mediaCollectionPane = element(by.id('media-collection-pane'));
  this.mediaCollectionForm = element(by.id('media-collection-form'));
  this.submitFormBtn = this.mediaCollectionPane.element(by.id('submit-details-btn'));
  this.cancelFormBtn = this.mediaCollectionPane.element(by.id('cancel-details-btn'));
  this.closeFormBtn = this.mediaCollectionPane.element(by.id('close-details-button'));
  this.createFormHeader = this.mediaCollectionPane.element(by.css('h1:nth-child(2)'));
  this.editFormHeader = this.mediaCollectionPane.element(by.css('h1:nth-child(1)'));
  this.nameFormField = this.mediaCollectionPane.element(by.model('selectedMediaCollection.name'));
  this.descriptionFormField = this.mediaCollectionPane.element(by.model('selectedMediaCollection.description'));
  this.defaultIdDropdown = this.mediaCollectionPane.element(by.model('selectedMediaCollection.defaultMediaKey'));
  this.addMediaMappingButton = this.mediaCollectionPane.element(by.id('add-media-mapping-button'));

  this.mediaMappingsTable = element(by.css('.media-collection-table'));
  this.noMediaMappingsMessage = this.mediaMappingsTable.element(by.css('.null'));
  this.mediaMappings = element.all(by.repeater('mapping in collection.mediaMap'));
  this.mediaIdentifiers = element.all(by.model('mapping.lookup'));
  this.mediaDropdownBoxes = element.all(by.css('lo-multibox'));
  this.mediaDropdowns = element.all(by.model('display'));
  this.mediaDropdownSearchFields = element.all(by.model('currentText'));
  this.mediaElementsSelector = 'item in filtered = (items | filter:filterCriteria | orderBy:getDisplayString)';
  this.removeMedia = element.all(by.id('remove-media-mapping-button'));

  this.requiredError = this.mediaCollectionPane.all(by.css('.lo-error'));

  this.openCreateMediaButton = element.all(by.id('show-create-new-item-btn'));
  this.createMediaForm = element(by.id('media-pane'));
  this.mediaNameField = this.createMediaForm.element(by.model('selectedMedia.name'));
  this.mediaTypeDropdown = this.createMediaForm.element(by.model('selectedMedia.type'));
  this.ttsSourceField = this.createMediaForm.element(by.id('tts-source-field'));
  this.voiceField = this.createMediaForm.element(by.id('tts-property-voice-field'));
  this.languageField = this.createMediaForm.element(by.id('tts-property-language-field'));
  this.audioSourceField = this.createMediaForm.element(by.id('audio-source-url-field'));
  this.mediaCancelBtn = this.createMediaForm.element(by.id('cancel-media-btn'));
  this.mediaCreateBtn = this.createMediaForm.element(by.id('create-media-btn'));
  this.mediaCreateAndNewBtn = this.createMediaForm.element(by.id('create-and-new-media-btn'));

  this.mediaRequiredError = this.createMediaForm.all(by.css('.lo-error'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.identifierColumn = 'td:nth-child(4)';

  this.submitFormBtn = this.mediaCollectionPane.element(by.id('submit-details-btn'));
  this.cancelFormBtn = this.mediaCollectionPane.element(by.id('cancel-details-btn'));
  this.closeMediaCollection = this.mediaCollectionPane.element(by.id('close-details-button'));
  this.closeMedia = this.createMediaForm.element(by.id('close-details-button'));

  this.openCreateNewMedia = function() {
    this.mediaDropdowns.get(0).click();
    this.openCreateMediaButton.get(0).click();
  };
};

module.exports = new MediaCollectionsPage();

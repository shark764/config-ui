'use strict';

var MediaCollectionsPage = function() {

  this.mediaCollectionsForm = element(by.id('details-pane'));
  this.creatingMediaHeader = this.mediaCollectionsForm.element(by.css('.detail-header-pane'));
  this.editingMediaHeader = this.mediaCollectionsForm.element(by.css('h1'));
  this.nameFormField = this.mediaCollectionsForm.element(by.model('resource.name'));
  this.descriptionFormField = this.mediaCollectionsForm.element(by.model('resource.description'));
  this.defaultIdDropdown = this.mediaCollectionsForm.element(by.model('resource.defaultMediaKey'));
  this.addMediaMappingButton = this.mediaCollectionsForm.element(by.id('add-media-mapping-button'));

  this.mediaMappingsTable = element(by.css('.media-collection-table'));
  this.noMediaMappingsMessage = this.mediaMappingsTable.element(by.css('.null'));
  this.mediaMappings = element.all(by.repeater('mapping in resource.mediaMap'));
  this.mediaIdentifiers = element.all(by.model('mapping.lookup'));
  this.mediaDropdowns = element.all(by.model('mapping.name'));
  this.mediaDropdownSearchFields = element.all(by.model('currentText'));
  this.removeMedia = element.all(by.id('remove-media-mapping-button'));

  this.requiredError = this.mediaCollectionsForm.all(by.css('.error'));

  this.openCreateMediaButton = element.all(by.css('.new-media-btn'));
  this.createMediaForm = element(by.id('media-pane'));
  this.createMediaHeader = this.createMediaForm.element(by.css('h1'));
  this.mediaNameField = this.createMediaForm.element(by.model('resource.name'));
  this.mediaTypeDropdown = this.createMediaForm.element(by.model('resource.type'));
  this.mediaSourceDropdown = this.createMediaForm.element(by.model('resource.source'));
  this.mediaCancelBtn = this.createMediaForm.element(by.buttonText('Cancel'));
  this.mediaCreateBtn = this.createMediaForm.element(by.buttonText('Create'));
  this.mediaCreateAndNewBtn = this.createMediaForm.element(by.buttonText('Create & New'));

  this.mediaRequiredError = this.createMediaForm.all(by.css('.error'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.identifierColumn = 'td:nth-child(4)';

  this.closeMediaCollection = this.mediaCollectionsForm.element(by.id('close-details-button'));
  this.closeMedia = this.createMediaForm.element(by.id('close-details-button'));
};

module.exports = new MediaCollectionsPage();

'use strict';

var MediaCollectionsPage = function() {

  this.mediaCollectionsForm = element(by.id('details-pane'));
  this.creatingMediaCollectionHeader = this.mediaCollectionsForm.element(by.css('.detail-header-pane'));
  this.editingMediaCollectionHeader = this.mediaCollectionsForm.element(by.css('h1'));
  this.nameFormField = this.mediaCollectionsForm.element(by.model('resource.name'));
  this.descriptionFormField = this.mediaCollectionsForm.element(by.model('resource.description'));
  this.defaultIdDropdown = this.mediaCollectionsForm.element(by.model('resource.defaultMediaKey'));
  this.addMediaMappingButton = this.mediaCollectionsForm.element(by.id('add-media-mapping-button'));

  this.mediaMappingsTable = element(by.css('.media-collection-table'));
  this.noMediaMappingsMessage = this.mediaMappingsTable.element(by.css('.null'));
  this.mediaMappings = element.all(by.repeater('mapping in collection.mediaMap'));
  this.mediaIdentifiers = element.all(by.model('mapping.lookup'));
  this.mediaDropdownBoxes = element.all(by.css('lo-multibox'));
  this.mediaDropdowns = element.all(by.model('model[displayField]'));
  this.mediaDropdownSearchFields = element.all(by.model('currentText'));
  this.mediaElementsSelector = 'item in filtered = (items | filter:filterCriteria | orderBy:nameField)';
  this.removeMedia = element.all(by.id('remove-media-mapping-button'));

  this.requiredError = this.mediaCollectionsForm.all(by.css('.error'));

  this.openCreateMediaButton = element.all(by.id('show-create-new-item-btn'));
  this.createMediaForm = element(by.id('media-pane'));
  this.mediaNameField = this.createMediaForm.element(by.model('resource.name'));
  this.mediaTypeDropdown = this.createMediaForm.element(by.model('resource.type'));
  this.mediaSourceField = this.createMediaForm.element(by.model('resource.source'));
  this.mediaCancelBtn = this.createMediaForm.element(by.id('cancel-media-btn'));
  this.mediaCreateBtn = this.createMediaForm.element(by.id('create-media-btn'));
  this.mediaCreateAndNewBtn = this.createMediaForm.element(by.id('create-and-new-media-btn'));

  this.mediaRequiredError = this.createMediaForm.all(by.css('.error'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.identifierColumn = 'td:nth-child(4)';

  this.closeMediaCollection = this.mediaCollectionsForm.element(by.id('close-details-button'));
  this.closeMedia = this.createMediaForm.element(by.id('close-details-button'));

  this.openCreateNewMedia = function() {
    this.addMediaMappingButton.click();
    this.mediaDropdowns.get(0).click();
    this.openCreateMediaButton.get(0).click();
  };
};

module.exports = new MediaCollectionsPage();

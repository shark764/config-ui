'use strict';

describe('The media collections view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    mediaCollections = require('./mediaCollections.po.js'),
    media = require('./media.po.js'),
    params = browser.params,
    mediaCollectionCount,
    randomCollection;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.mediaCollectionsPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include valid fields when creating a new Media Collection', function() {
    shared.createBtn.click();
    expect(mediaCollections.createFormHeader.getText()).toContain('Creating New Media Collection');
    expect(mediaCollections.descriptionFormField.isDisplayed()).toBeTruthy();

    expect(mediaCollections.addMediaMappingButton.isDisplayed()).toBeTruthy();
    expect(mediaCollections.mediaMappingsTable.isDisplayed()).toBeTruthy();

    expect(mediaCollections.cancelFormBtn.isDisplayed()).toBeTruthy();
    expect(mediaCollections.submitFormBtn.isDisplayed()).toBeTruthy();
    expect(mediaCollections.closeMediaCollection.isDisplayed()).toBeTruthy();

    // Create New Media details are displayed by default
    expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
    expect(mediaCollections.mediaIdentifiers.count()).toBe(1);
    expect(mediaCollections.mediaDropdowns.count()).toBe(1);
    expect(mediaCollections.removeMedia.count()).toBe(1);
    expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeFalsy();
    expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
  });

  it('should include Media Collection page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(mediaCollections.mediaCollectionForm.isDisplayed()).toBeFalsy(); // Hide by default
    expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy(); // Hide by default
    expect(shared.actionsBtn.isDisplayed()).toBeFalsy(); // No bulk actions
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Media Collection Management');
  });

  it('should require field input when creating a new Media Collection', function() {
    mediaCollectionCount = shared.tableElements.count();
    shared.createBtn.click();

    // Submit button is disabled
    expect(mediaCollections.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    mediaCollections.submitFormBtn.click();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCollectionCount);
  });

  it('should require name when creating a new Media Collection', function() {
    mediaCollectionCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    mediaCollections.descriptionFormField.sendKeys('Media Collection Description');

    // Submit button is still disabled
    expect(mediaCollections.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    mediaCollections.submitFormBtn.click();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCollectionCount);

    // Touch name input field
    mediaCollections.nameFormField.click();
    mediaCollections.descriptionFormField.click();

    // Submit button is still disabled
    expect(mediaCollections.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(mediaCollections.requiredError.get(0).getText()).toBe('Please enter a name');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCollectionCount);
  });

  it('should require Media Mapping when creating a new Media Collection', function() {
    mediaCollectionCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    mediaCollections.nameFormField.sendKeys('Media Collection Name');

    // Submit button is still disabled
    expect(mediaCollections.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    mediaCollections.submitFormBtn.click();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCollectionCount);

    // Remove Media Mapping fields
    mediaCollections.removeMedia.get(0).click();

    // Submit button is still disabled
    expect(mediaCollections.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(mediaCollections.requiredError.get(0).getText()).toBe('You must include at least one media mapping');
  });

  it('should add new Media Mapping when creating a new Media Collection', function() {
    mediaCollectionCount = shared.tableElements.count();
    shared.createBtn.click();
    mediaCollections.openCreateNewMedia();

    var randomMedia = Math.floor((Math.random() * 1000) + 1);

    // Edit required fields
    mediaCollections.mediaNameField.sendKeys('Audio from Media Collections ' + randomMedia);
    mediaCollections.mediaTypeDropdown.all(by.css('option')).get(1).click();
    mediaCollections.audioSourceField.sendKeys('http://www.example.com/' + randomMedia);

    mediaCollections.mediaCreateBtn.click().then(function() {
      shared.waitForSuccess();

      mediaCollections.nameFormField.sendKeys('Media Collection ' + randomMedia);
      mediaCollections.mediaIdentifiers.get(0).sendKeys('Identifier ' + randomMedia);
      mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

      mediaCollections.submitFormBtn.click().then(function() {
        shared.waitForSuccess();
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
        expect(shared.tableElements.count()).toBeGreaterThan(mediaCollectionCount);
      });
    });
  });

  it('should require Default Identifier when creating a new Media Collection', function() {
    mediaCollectionCount = shared.tableElements.count();
    shared.createBtn.click();

    mediaCollections.nameFormField.sendKeys('Media Collection');
    mediaCollections.defaultIdDropdown.click();
    mediaCollections.mediaIdentifiers.get(0).sendKeys('Identifier');
    mediaCollections.mediaDropdowns.get(0).click();
    mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();

    // Submit button is still disabled
    expect(mediaCollections.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    mediaCollections.submitFormBtn.click();

    // Error messages displayed
    expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(mediaCollections.requiredError.get(0).getText()).toBe('Please select a default identifier');
  });

  it('should successfully create new Media Collection without Description', function() {
    mediaCollectionCount = shared.tableElements.count();
    randomCollection = Math.floor((Math.random() * 1000) + 1);

    shared.createBtn.click();

    // Complete Name field
    mediaCollections.nameFormField.sendKeys('Media Collection ' + randomCollection);

    // Add Media Mapping with existing media
    mediaCollections.mediaIdentifiers.get(0).sendKeys('Media Identifier ' + randomCollection);
    mediaCollections.mediaDropdowns.get(0).click();
    mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();

    // Set default Identifier
    mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

    mediaCollections.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(mediaCollectionCount);
    });
  });

  it('should successfully create new Media Collection with existing Media when name is input', function() {
    // Get existing media details
    browser.get(shared.mediaPageUrl);
    shared.firstTableRow.click();
    media.nameFormField.getAttribute('value').then(function(mediaName) {
      browser.get(shared.mediaCollectionsPageUrl);
      shared.createBtn.click();

      randomCollection = Math.floor((Math.random() * 1000) + 1);

      // Complete fields
      mediaCollections.nameFormField.sendKeys('Media Collection ' + randomCollection);
      mediaCollections.descriptionFormField.sendKeys('Description for Media Collection');

      // Add Media Mapping with existing media
      mediaCollections.mediaIdentifiers.get(0).sendKeys('Media Identifier ' + randomCollection);
      mediaCollections.mediaDropdowns.get(0).click();
      mediaCollections.mediaDropdownSearchFields.get(0).sendKeys(mediaName);
      element.all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();

      // Set default Identifier
      mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

      mediaCollections.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
      });
    });
  });

  it('should successfully create new Media Collection with existing Media when name is selected', function() {
    // Get existing media details
    browser.get(shared.mediaPageUrl);
    shared.firstTableRow.click();
    media.nameFormField.getAttribute('value').then(function(mediaName) {
      browser.get(shared.mediaCollectionsPageUrl);
      shared.createBtn.click();

      randomCollection = Math.floor((Math.random() * 1000) + 1);

      // Complete fields
      mediaCollections.nameFormField.sendKeys('Media Collection ' + randomCollection);
      mediaCollections.descriptionFormField.sendKeys('Description for Media Collection');

      // Add Media Mapping with existing media
      mediaCollections.mediaIdentifiers.get(0).sendKeys('Media Identifier ' + randomCollection);
      mediaCollections.mediaDropdowns.get(0).click();
      mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();

      // Set default Identifier
      mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

      mediaCollections.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
      });
    });
  });

  it('should clear fields on Cancel', function() {
    mediaCollectionCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    mediaCollections.nameFormField.sendKeys('Media Collection Name');
    mediaCollections.descriptionFormField.sendKeys('Media Collection Description');
    mediaCollections.mediaIdentifiers.get(0).sendKeys('Media Identifier');
    mediaCollections.mediaDropdowns.get(0).click();
    mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();
    mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

    mediaCollections.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // New media is not created
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCollectionCount);

    // Form fields are cleared and reset to default
    shared.createBtn.click();
    expect(mediaCollections.nameFormField.getAttribute('value')).toBe('');
    expect(mediaCollections.descriptionFormField.getAttribute('value')).toBe('');
    expect(mediaCollections.defaultIdDropdown.getText()).toBe('Select default identifier...');
    expect(mediaCollections.mediaIdentifiers.get(0).getAttribute('value')).toBe('');
    expect(mediaCollections.mediaDropdowns.get(0).getText()).toBe('');
  });

  it('should include valid fields when editing an existing Media Collection', function() {
    shared.firstTableRow.click();
    expect(mediaCollections.editFormHeader.isDisplayed()).toBeTruthy();
    expect(mediaCollections.nameFormField.isDisplayed()).toBeTruthy();
    expect(mediaCollections.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();

    expect(mediaCollections.addMediaMappingButton.isDisplayed()).toBeTruthy();
    expect(mediaCollections.mediaMappingsTable.isDisplayed()).toBeTruthy();

    expect(mediaCollections.cancelFormBtn.isDisplayed()).toBeTruthy();
    expect(mediaCollections.submitFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should display media collection details when selected from table', function() {
    // Select first media from table
    shared.firstTableRow.click();

    // Verify media collections details in table matches populated field
    expect(mediaCollections.editFormHeader.getText()).toContain(shared.firstTableRow.element(by.css(mediaCollections.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(mediaCollections.nameColumn)).getText()).toBe(mediaCollections.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(mediaCollections.descriptionColumn)).getText()).toBe(mediaCollections.descriptionFormField.getAttribute('value'));

    shared.firstTableRow.element(by.css(mediaCollections.identifierColumn)).getText().then(function(identifiers) {
      expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
      expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).not.toBe('');
      expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeFalsy();
      mediaCollections.mediaIdentifiers.count().then(function(mediaCount) {
        for (var i = 0; i < mediaCount; i++) {
          expect(identifiers).toContain(mediaCollections.mediaIdentifiers.get(i).getText());
        }
      });
    }).then(function() {
      // Change selected media and ensure details are updated
      shared.tableElements.count().then(function(curMediaCount) {
        if (curMediaCount > 1) {
          shared.secondTableRow.click();

          // Verify media collections details in table matches populated field
          expect(mediaCollections.editFormHeader.getText()).toContain(shared.secondTableRow.element(by.css(mediaCollections.nameColumn)).getText());
          expect(shared.secondTableRow.element(by.css(mediaCollections.nameColumn)).getText()).toBe(mediaCollections.nameFormField.getAttribute('value'));
          expect(shared.secondTableRow.element(by.css(mediaCollections.descriptionColumn)).getText()).toBe(mediaCollections.descriptionFormField.getAttribute('value'));

          shared.secondTableRow.element(by.css(mediaCollections.identifierColumn)).getText().then(function(identifiers) {
            expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
            expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).not.toBe('');
            expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeFalsy();
            mediaCollections.mediaIdentifiers.count().then(function(mediaCount) {
              for (var i = 0; i < mediaCount; i++) {
                expect(identifiers).toContain(mediaCollections.mediaIdentifiers.get(i).getText());
              }
            });
          });
        };
      });
    });
  });

  it('should reset fields after editing Media Collection and selecting Cancel', function() {
    shared.firstTableRow.click();

    var originalName = mediaCollections.nameFormField.getAttribute('value');
    var originalDescription = mediaCollections.descriptionFormField.getAttribute('value');

    // Edit editable fields
    mediaCollections.nameFormField.sendKeys('Edit');
    mediaCollections.descriptionFormField.sendKeys('Edit');

    mediaCollections.cancelFormBtn.click();
    shared.dismissChanges();

    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(mediaCollections.nameFormField.getAttribute('value')).toBe(originalName);
    expect(mediaCollections.descriptionFormField.getAttribute('value')).toBe(originalDescription);
  });

  it('should reset fields after editing Media Mappings and selecting Cancel', function() {
    shared.firstTableRow.click();
    var originalDefaultId = '';
    var mappingOriginalId = '';
    var mappingOriginalMedia = '';

    // Edit and remove existing media
    mediaCollections.mediaMappings.count().then(function(originalMediaCount) {
      originalDefaultId = mediaCollections.defaultIdDropdown.$('option:checked').getText();
      mappingOriginalId = mediaCollections.mediaIdentifiers.get(0).getAttribute('value');
      mappingOriginalMedia = mediaCollections.mediaDropdowns.get(0).getAttribute('value');

      mediaCollections.mediaIdentifiers.get(0).sendKeys('edit');

      if (originalMediaCount > 1) {
        mediaCollections.removeMedia.get(1).click();
      }

      // add more media mappings
      mediaCollections.addMediaMappingButton.click();
      mediaCollections.addMediaMappingButton.click();

      mediaCollections.cancelFormBtn.click();
      shared.dismissChanges();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(mediaCollections.mediaMappings.count()).toBe(originalMediaCount);
      expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).toBe(originalDefaultId);
      expect(mediaCollections.mediaIdentifiers.get(0).getAttribute('value')).toBe(mappingOriginalId);
      expect(mediaCollections.mediaDropdowns.get(0).getAttribute('value')).toBe(mappingOriginalMedia);
    });
  });

  it('should allow fields to be updated when editing', function() {
    shared.firstTableRow.click();

    // Edit editable fields
    mediaCollections.nameFormField.sendKeys('Edit');
    mediaCollections.descriptionFormField.sendKeys('Edit');

    var editedName = mediaCollections.nameFormField.getAttribute('value');
    var editedDescription = mediaCollections.descriptionFormField.getAttribute('value');

    mediaCollections.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.firstTableRow.click();
      expect(mediaCollections.nameFormField.getAttribute('value')).toBe(editedName);
      expect(mediaCollections.descriptionFormField.getAttribute('value')).toBe(editedDescription);
    });
  });

  it('should require name field when editing', function() {
    shared.firstTableRow.click();

    // Edit editable fields
    mediaCollections.nameFormField.clear();
    mediaCollections.nameFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(mediaCollections.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    mediaCollections.submitFormBtn.click();

    // Error message displayed
    expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(mediaCollections.requiredError.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not require description when editing', function() {
    shared.firstTableRow.click();

    // Edit editable fields
    mediaCollections.descriptionFormField.sendKeys('Editing the description field'); // Incase the field was already blank
    mediaCollections.descriptionFormField.clear();
    mediaCollections.descriptionFormField.sendKeys('\t');

    mediaCollections.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.firstTableRow.click();
      expect(mediaCollections.descriptionFormField.getAttribute('value')).toBe('');
    });
  });

  it('should allow fields to be updated when editing Media Mappings', function() {
    shared.firstTableRow.click();

    // Edit existing media
    mediaCollections.mediaIdentifiers.get(0).sendKeys('edit');
    mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

    // Select Media, assume at least one media exists
    mediaCollections.mediaDropdowns.get(0).click();
    mediaCollections.mediaDropdownSearchFields.get(0).click();
    mediaCollections.mediaMappings.get(0).all(by.css('ul')).get(0).click();

    var mappingEditedId = mediaCollections.mediaIdentifiers.get(0).getAttribute('value');
    var editedDefaultId = mediaCollections.defaultIdDropdown.$('option:checked').getText();
    var mappingEditedMedia = mediaCollections.mediaDropdowns.get(0).getAttribute('value');

    mediaCollections.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.firstTableRow.click();

      expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();

      expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).toBe(editedDefaultId);
      expect(mediaCollections.mediaIdentifiers.get(0).getAttribute('value')).toBe(mappingEditedId);
      expect(mediaCollections.mediaDropdowns.get(0).getAttribute('value')).toBe(mappingEditedMedia);
    });
  });

  it('should require identifier field when editing a Media Mapping', function() {
    // Select first media from table
    shared.firstTableRow.click();

    mediaCollections.mediaIdentifiers.get(0).clear();
    mediaCollections.mediaIdentifiers.get(0).sendKeys('\t');

    // Submit button is still disabled
    expect(mediaCollections.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    mediaCollections.submitFormBtn.click();

    // Error messages displayed
    expect(mediaCollections.requiredError.get(1).isDisplayed()).toBeTruthy();
    expect(mediaCollections.requiredError.get(1).getText()).toBe('Please enter an identifier for this media item');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should allow Media Mappings to be added when editing with existing Media Collection', function() {
    shared.firstTableRow.click();
    randomCollection = Math.floor((Math.random() * 1000) + 1);

    mediaCollections.mediaMappings.count().then(function(originalMediaCount) {
      // Add media
      mediaCollections.addMediaMappingButton.click();
      mediaCollections.mediaIdentifiers.get(originalMediaCount).sendKeys('New Media Identifier ' + randomCollection);

      mediaCollections.mediaDropdowns.get(originalMediaCount).click();
      mediaCollections.mediaDropdownSearchFields.get(originalMediaCount).click();
      mediaCollections.mediaMappings.get(originalMediaCount).all(by.css('ul')).get(0).click();

      mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

      mediaCollections.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Changes persist
        browser.refresh();
        shared.firstTableRow.click();

        expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
        expect(mediaCollections.mediaMappings.count()).toBeGreaterThan(originalMediaCount);
      });
    });
  });

  // TODO Existing bug to verify TITAN2-2291
  xit('should require unique identifier field when editing a Media Mapping', function() {});

  xit('should require unique identifier field on create when adding a Media Mapping', function() {});

  xit('should require unique identifier field on edit when adding a new Media Mapping', function() {});

  it('should allow a Media Mapping to be removed when editing', function() {
    shared.firstTableRow.click();

    // Remove existing media
    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 2) {
        mediaCollections.removeMedia.get(0).click();
        mediaCollections.defaultIdDropdown.all(by.css('option')).get(2).click();

        expect(mediaCollections.mediaMappings.count()).toBeLessThan(mediaCount);

        mediaCollections.submitFormBtn.click();
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Changes persist
        browser.refresh();
        shared.firstTableRow.click();

        expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
        expect(mediaCollections.mediaMappings.count()).toBeLessThan(mediaCount);
      }
    });
  });
});

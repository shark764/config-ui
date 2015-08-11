'use strict';

describe('The media collections view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    mediaCollections = require('./mediaCollections.po.js'),
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
    expect(mediaCollections.creatingMediaCollectionHeader.getText()).toContain('Creating New Media Collection');
    expect(mediaCollections.descriptionFormField.isDisplayed()).toBeTruthy();

    expect(mediaCollections.addMediaMappingButton.isDisplayed()).toBeTruthy();
    expect(mediaCollections.mediaMappingsTable.isDisplayed()).toBeTruthy();
    expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeTruthy();

    expect(shared.cancelFormBtn.isDisplayed()).toBeTruthy();
    expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();
    expect(mediaCollections.closeMediaCollection.isDisplayed()).toBeTruthy();

    // Create New Media details are not displayed by default
    expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
    expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeTruthy();
    expect(mediaCollections.noMediaMappingsMessage.getText()).toBeTruthy('Add media items with the plus button above.');
    expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
  });

  it('should successfully create new Media Collection without Media', function() {
    mediaCollectionCount = shared.tableElements.count();
    randomCollection = Math.floor((Math.random() * 1000) + 1);
    var mediaCollectionAdded = false;
    var newMediaCollectionName = 'Media Collection' + randomCollection;
    shared.createBtn.click();

    // Complete fields
    mediaCollections.nameFormField.sendKeys(newMediaCollectionName);
    mediaCollections.descriptionFormField.sendKeys('Description for Media Collection');

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Confirm media is displayed in media list
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if media source in table matches newly added media
          element(by.css('tr:nth-child(' + i + ') > ' + mediaCollections.nameColumn)).getText().then(function(value) {
            if (value == newMediaCollectionName) {
              mediaCollectionAdded = true;
            }
          });
        }
      }).thenFinally(function() {
        // Verify new media was found in the media table
        expect(mediaCollectionAdded).toBeTruthy();
        expect(shared.tableElements.count()).toBeGreaterThan(mediaCollectionCount);
      });
    });
  });

  it('should include Media Collection page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeFalsy(); //Hide by default
    //expect(shared.actionsBtn.isDisplayed()).toBeFalsy(); // No bulk actions
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Media Collection Management');
  });

  it('should require field input when creating a new Media Collection', function() {
    mediaCollectionCount = shared.tableElements.count();
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

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
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCollectionCount);

    // Touch name input field
    mediaCollections.nameFormField.click();
    mediaCollections.descriptionFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(mediaCollections.requiredError.get(0).getText()).toBe('Please enter a name');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCollectionCount);
  });

  it('should successfully create new Media Collection without Description', function() {
    mediaCollectionCount = shared.tableElements.count();
    randomCollection = Math.floor((Math.random() * 1000) + 1);

    shared.createBtn.click();

    // Complete fields
    mediaCollections.nameFormField.sendKeys('Media Collection' + randomCollection);

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(mediaCollectionCount);
    });
  });

  it('should successfully create new Media Collection with existing Media when name is input', function() {
    // Get existing media details
    browser.get(shared.mediaPageUrl);
    var mediaName;

    shared.tableElements.then(function(mediaElements) {
      if (mediaElements.length > 0) {
        mediaName = mediaElements[0].element(by.css('td:nth-child(2)')).getText();

        browser.get(shared.mediaCollectionsPageUrl);
        shared.createBtn.click();

        randomCollection = Math.floor((Math.random() * 1000) + 1);

        // Complete fields
        mediaCollections.nameFormField.sendKeys('Media Collection ' + randomCollection);
        mediaCollections.descriptionFormField.sendKeys('Description for Media Collection');

        // Add Media Mapping with existing media
        mediaCollections.addMediaMappingButton.click();
        mediaCollections.mediaIdentifiers.get(0).sendKeys('Media Identifier ' + randomCollection);
        mediaCollections.mediaDropdownBoxes.get(0).click();
        mediaCollections.mediaDropdownSearchFields.get(0).sendKeys(mediaName);

        // Set default Identifier
        mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

        shared.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();
        });
      }
    });
  });

  it('should successfully create new Media Collection with existing Media when name is selected', function() {
    // Get existing media details
    browser.get(shared.mediaPageUrl);
    var mediaName;

    shared.tableElements.then(function(mediaElements) {
      if (mediaElements.length > 0) {
        mediaName = mediaElements[0].getText();

        browser.get(shared.mediaCollectionsPageUrl);
        shared.createBtn.click();

        randomCollection = Math.floor((Math.random() * 1000) + 1);

        // Complete fields
        mediaCollections.nameFormField.sendKeys('Media Collection ' + randomCollection);
        mediaCollections.descriptionFormField.sendKeys('Description for Media Collection');

        // Add Media Mapping with existing media
        mediaCollections.addMediaMappingButton.click();
        mediaCollections.mediaIdentifiers.get(0).sendKeys('Media Identifier ' + randomCollection);
        mediaCollections.mediaDropdownBoxes.get(0).click();
        mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();

        // Set default Identifier
        mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

        shared.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();
        });
      }
    });
  });

  it('should clear fields on Cancel', function() {
    mediaCollectionCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    mediaCollections.nameFormField.sendKeys('Media Collection Name');
    mediaCollections.descriptionFormField.sendKeys('Media Collection Description');
    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // New media is not created
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCollectionCount);

    // Form fields are cleared and reset to default
    expect(mediaCollections.nameFormField.getAttribute('value')).toBe('');
    expect(mediaCollections.descriptionFormField.getAttribute('value')).toBe('');
  });

  it('should clear and hide Media Mappings fields on Cancel', function() {
    mediaCollectionCount = shared.tableElements.count();
    shared.createBtn.click();
    mediaCollections.addMediaMappingButton.click();

    // Edit fields
    mediaCollections.mediaIdentifiers.get(0).sendKeys('Media Identifier');
    mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // New media is not created
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCollectionCount);

    // Media Mappings fields are hidden by default
    expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
    expect(mediaCollections.mediaMappingsTable.isDisplayed()).toBeFalsy();
  });

  it('should include valid fields when editing an existing Media Collection', function() {
    shared.firstTableRow.click();
    expect(mediaCollections.editingMediaCollectionHeader.isDisplayed()).toBeTruthy();
    expect(mediaCollections.nameFormField.isDisplayed()).toBeTruthy();
    expect(mediaCollections.descriptionFormField.isDisplayed()).toBeTruthy();

    shared.firstTableRow.element(by.css(mediaCollections.identifierColumn)).getText().then(function(identifiers) {
      if (identifiers == '') {
        expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
      } else {
        expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
      }
    });

    expect(mediaCollections.addMediaMappingButton.isDisplayed()).toBeTruthy();
    expect(mediaCollections.mediaMappingsTable.isDisplayed()).toBeTruthy();

    expect(shared.cancelFormBtn.isDisplayed()).toBeTruthy();
    expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should display media collection details when selected from table', function() {
    // Select first media from table
    shared.firstTableRow.click();

    // Verify media collections details in table matches populated field
    expect(mediaCollections.editingMediaCollectionHeader.getText()).toContain(shared.firstTableRow.element(by.css(mediaCollections.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(mediaCollections.nameColumn)).getText()).toBe(mediaCollections.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(mediaCollections.descriptionColumn)).getText()).toBe(mediaCollections.descriptionFormField.getAttribute('value'));

    shared.firstTableRow.element(by.css(mediaCollections.identifierColumn)).getText().then(function(identifiers) {
      if (identifiers == '') {
        expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
        expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeTruthy();
        expect(mediaCollections.noMediaMappingsMessage.getText()).toBeTruthy('Add media items with the plus button above.');
      } else {
        expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
        expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).not.toBe('');
        expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeFalsy();
        mediaCollections.mediaIdentifiers.count().then(function(mediaCount) {
          for (var i = 0; i < mediaCount; i++) {
            expect(identifiers).toContain(mediaCollections.mediaIdentifiers.get(i).getText());
          }
        });
      }
    }).then(function() {
      // Change selected media and ensure details are updated
      shared.tableElements.count().then(function(curMediaCount) {
        if (curMediaCount > 1) {
          shared.secondTableRow.click();

          // Verify media collections details in table matches populated field
          expect(mediaCollections.editingMediaCollectionHeader.getText()).toContain(shared.secondTableRow.element(by.css(mediaCollections.nameColumn)).getText());
          expect(shared.secondTableRow.element(by.css(mediaCollections.nameColumn)).getText()).toBe(mediaCollections.nameFormField.getAttribute('value'));
          expect(shared.secondTableRow.element(by.css(mediaCollections.descriptionColumn)).getText()).toBe(mediaCollections.descriptionFormField.getAttribute('value'));

          shared.secondTableRow.element(by.css(mediaCollections.identifierColumn)).getText().then(function(identifiers) {
            if (identifiers == '') {
              expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
              expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeTruthy();
              expect(mediaCollections.noMediaMappingsMessage.getText()).toBeTruthy('Add media items with the plus button above.');
            } else {
              expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
              expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).not.toBe('');
              expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeFalsy();
              mediaCollections.mediaIdentifiers.count().then(function(mediaCount) {
                for (var i = 0; i < mediaCount; i++) {
                  expect(identifiers).toContain(mediaCollections.mediaIdentifiers.get(i).getText());
                }
              });
            }
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

    shared.cancelFormBtn.click();
    shared.dismissChanges();

    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(mediaCollections.nameFormField.getAttribute('value')).toBe(originalName);
    expect(mediaCollections.descriptionFormField.getAttribute('value')).toBe(originalDescription);
  });

  it('should reset fields after editing Media Mappings and selecting Cancel', function() {
    shared.firstTableRow.click();
    var originalMediaCount = mediaCollections.mediaMappings.count();
    var originalDefaultId = '';
    var mappingOriginalId = '';
    var mappingOriginalMedia = '';

    // Edit and remove existing media
    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 0) {
        originalDefaultId = mediaCollections.defaultIdDropdown.$('option:checked').getText();
        mappingOriginalId = mediaCollections.mediaIdentifiers.get(0).getAttribute('value');
        mappingOriginalMedia = mediaCollections.mediaDropdowns.get(0).getAttribute('value');

        mediaCollections.mediaIdentifiers.get(0).sendKeys('edit');

        if (mediaCount > 1) {
          mediaCollections.removeMedia.get(1).click();
        }
      }

      // add more media mappings
      mediaCollections.addMediaMappingButton.click();
      mediaCollections.addMediaMappingButton.click();

      shared.cancelFormBtn.click();
      shared.dismissChanges();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(mediaCollections.mediaMappings.count()).toBe(originalMediaCount);
      if (mediaCount > 0) {
        // TODO Bug: Field doesn't get reset
        // expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).toBe(originalDefaultId);

        expect(mediaCollections.mediaIdentifiers.get(0).getAttribute('value')).toBe(mappingOriginalId);
        expect(mediaCollections.mediaDropdowns.get(0).getAttribute('value')).toBe(mappingOriginalMedia);
      } else {
        expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
      }
    });
  });

  it('should allow fields to be updated when editing', function() {
    shared.firstTableRow.click();

    // Edit editable fields
    mediaCollections.nameFormField.sendKeys('Edit');
    mediaCollections.descriptionFormField.sendKeys('Edit');

    var editedName = mediaCollections.nameFormField.getAttribute('value');
    var editedDescription = mediaCollections.descriptionFormField.getAttribute('value');

    shared.submitFormBtn.click().then(function() {
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
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
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

    shared.submitFormBtn.click().then(function() {
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
    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 0) {
        mediaCollections.mediaIdentifiers.get(0).sendKeys('edit');
        mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

        // Select Media, assume at least one media exists
        mediaCollections.mediaDropdowns.get(0).click();
        mediaCollections.mediaDropdownSearchFields.get(0).click();
        mediaCollections.mediaMappings.get(0).all(by.css('ul')).get(0).click();

        var mappingEditedId = mediaCollections.mediaIdentifiers.get(0).getAttribute('value');
        var editedDefaultId = mediaCollections.defaultIdDropdown.$('option:checked').getText();
        var mappingEditedMedia = mediaCollections.mediaDropdowns.get(0).getAttribute('value');

        shared.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Changes persist
          browser.refresh();
          shared.firstTableRow.click();

          expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
          expect(mediaCollections.mediaMappings.count()).toBe(mediaCount);

          expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).toBe(editedDefaultId);
          expect(mediaCollections.mediaIdentifiers.get(0).getAttribute('value')).toBe(mappingEditedId);
          expect(mediaCollections.mediaDropdowns.get(0).getAttribute('value')).toBe(mappingEditedMedia);

          // Table values are updated
          mediaCollections.mediaIdentifiers.each(function(mediaIdentifier) {
            expect(shared.firstTableRow.element(by.css(mediaCollections.identifierColumn)).getText()).toContain(mediaIdentifier.getAttribute('value'));
          });
        });
      }
    });
  });

  it('should require identifier field when editing a Media Mapping', function() {
    // Select first media from table
    shared.firstTableRow.click();

    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 0) {
        mediaCollections.mediaIdentifiers.get(0).clear();
        mediaCollections.mediaIdentifiers.get(0).sendKeys('\t');

        // Submit button is still disabled
        expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
        shared.submitFormBtn.click();

        // Error messages displayed
        expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
        expect(mediaCollections.requiredError.get(0).getText()).toBe('Please select a default identifier');
        expect(shared.successMessage.isPresent()).toBeFalsy();
      }
    });
  });

  it('should add required Default Identifier field when editing the Media Mapping', function() {
    shared.firstTableRow.click();

    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 0) {
        // Get current Default Identifier
        mediaCollections.defaultIdDropdown.$('option:checked').getAttribute('value').then(function(defaultIdentifierValue) {
          // Edit the media mappings identifier that's currently set to default
          mediaCollections.mediaIdentifiers.get(defaultIdentifierValue).sendKeys('Edit');

          // Default Identifer deselected
          expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).toBe('Select default identifier...');

          // Required field message displayed
          expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
          expect(mediaCollections.requiredError.get(0).getText()).toBe('Please select a default identifier');

          // Unable to save changes
          expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
          shared.submitFormBtn.click();
          expect(shared.successMessage.isPresent()).toBeFalsy();
        });
      }
    });
  });

  it('should allow Media Mappings to be added when editing with existing Media Collection', function() {
    shared.firstTableRow.click();
    randomCollection = Math.floor((Math.random() * 1000) + 1);

    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      // Add media
      mediaCollections.addMediaMappingButton.click();
      mediaCollections.mediaIdentifiers.get(mediaCount).sendKeys('New Media Identifier ' + randomCollection);

      mediaCollections.mediaDropdowns.get(mediaCount).click();
      mediaCollections.mediaDropdownSearchFields.get(mediaCount).click();
      mediaCollections.mediaMappings.get(mediaCount).all(by.css('ul')).get(0).click();

      mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Changes persist
        browser.refresh();
        shared.firstTableRow.click();

        expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
        expect(mediaCollections.mediaMappings.count()).toBeGreaterThan(mediaCount);

        // Table values are updated
        mediaCollections.mediaIdentifiers.each(function(mediaIdentifier) {
          expect(shared.firstTableRow.element(by.css(mediaCollections.identifierColumn)).getText()).toContain(mediaIdentifier.getAttribute('value'));
        });
      });
    });
  });

  it('should require unique identifier field when editing a Media Mapping', function() {
    // Select first media from table
    shared.firstTableRow.click();

    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 1) {
        mediaCollections.mediaIdentifiers.get(0).getAttribute('value').then(function(existingIdentifier) {
          // Edit a media identifier to be the same as an existing identifier
          mediaCollections.mediaIdentifiers.get(1).clear();
          mediaCollections.mediaIdentifiers.get(1).sendKeys(existingIdentifier);
          mediaCollections.defaultIdDropdown.all(by.css('option')).get(2).click();

          // Submit button is still disabled
          expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
          shared.submitFormBtn.click();

          // Error messages displayed
          expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
          expect(mediaCollections.requiredError.get(0).getText()).toBe('This lookup value already exists for this media collection.');

          expect(shared.successMessage.isPresent()).toBeFalsy();
        });
      }
    });
  });

  it('should require unique identifier field when creating a Media Collection', function() {

    shared.createBtn.click();

    randomCollection = Math.floor((Math.random() * 1000) + 1);

    // Complete fields
    mediaCollections.nameFormField.sendKeys('Media Collection ' + randomCollection);
    mediaCollections.descriptionFormField.sendKeys('Description for Media Collection');

    // Add first Media Mapping
    mediaCollections.addMediaMappingButton.click();
    mediaCollections.mediaIdentifiers.get(0).sendKeys('Media Identifier ' + randomCollection);
    mediaCollections.mediaDropdowns.get(0).click();
    mediaCollections.mediaDropdownSearchFields.get(0).click();
    mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();

    // Add second Media Mapping with duplicate identifier
    mediaCollections.addMediaMappingButton.click();
    mediaCollections.mediaIdentifiers.get(1).sendKeys('Media Identifier ' + randomCollection);
    mediaCollections.mediaDropdowns.get(1).click();
    mediaCollections.mediaDropdownSearchFields.get(1).click();
    mediaCollections.mediaDropdownBoxes.get(1).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();

    // Set default Identifier
    mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(mediaCollections.requiredError.get(0).getText()).toBe('This lookup value already exists for this media collection.');
    expect(mediaCollections.requiredError.get(1).isDisplayed()).toBeTruthy();
    expect(mediaCollections.requiredError.get(1).getText()).toBe('This lookup value already exists for this media collection.');

    // New Media Collection is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should require unique identifier field on edit when adding a new Media Mapping', function() {
    // Select first media from table
    shared.firstTableRow.click();

    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 0) {
        mediaCollections.mediaIdentifiers.get(0).getAttribute('value').then(function(existingIdentifier) {
          // Add media
          mediaCollections.addMediaMappingButton.click();
          mediaCollections.mediaIdentifiers.get(mediaCount).sendKeys(existingIdentifier);

          mediaCollections.mediaDropdowns.get(mediaCount).click();
          mediaCollections.mediaDropdownSearchFields.get(mediaCount).click();
          mediaCollections.mediaMappings.get(mediaCount).all(by.css('ul')).get(0).click();
          mediaCollections.defaultIdDropdown.all(by.css('option')).get(2).click();

          // Submit button is still disabled
          expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
          shared.submitFormBtn.click();

          // Error messages displayed
          expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
          expect(mediaCollections.requiredError.get(0).getText()).toBe('This lookup value already exists for this media collection.');

          expect(shared.successMessage.isPresent()).toBeFalsy();
        });
      }
    });
  });

  it('should immediately focus the multibox search box when adding a media to a new mapping', function() {
    shared.createBtn.click();

    mediaCollections.addMediaMappingButton.click();
    mediaCollections.mediaDropdownBoxes.get(0).click();
    expect(mediaCollections.mediaDropdownSearchFields.get(0).getAttribute('name')).toBe(browser.driver.switchTo().activeElement().getAttribute('name'));
  });

  it('should allow a Media Mapping to be removed when editing', function() {
    shared.firstTableRow.click();

    // Remove existing media
    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 2) {
        mediaCollections.removeMedia.get(0).click();
        mediaCollections.defaultIdDropdown.all(by.css('option')).get(2).click();

        expect(mediaCollections.mediaMappings.count()).toBeLessThan(mediaCount);

        shared.submitFormBtn.click().then(function () {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Changes persist
          browser.refresh();
          shared.firstTableRow.click();

          expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
          expect(mediaCollections.mediaMappings.count()).toBeLessThan(mediaCount);
        });
      }
    });
  });

  xit('should allow all Media Mappings to be removed when editing', function() {
    // TODO
    shared.firstTableRow.click();

    // Remove existing media
    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 0) {
        for (var i = 1; i <= mediaCount; i++) {
          mediaCollections.removeMedia.get(mediaCount - i).click();
        }
        expect(mediaCollections.mediaMappings.count()).toBe(0);

        shared.submitFormBtn.click();
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Changes persist
        browser.refresh();
        shared.firstTableRow.click();

        expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
        expect(mediaCollections.mediaMappings.count()).toBe(0);
      }
    });
  });

  describe('media mappings', function() {

    it('should include the correct number of Media elements', function() {
      shared.createBtn.click();
      mediaCollections.addMediaMappingButton.click();
      mediaCollections.mediaDropdowns.get(0).click();
      mediaCollections.mediaDropdownSearchFields.get(0).click();

      // Get list of Media
      mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:nameField)')).count().then(function(mediaListCount) {
        browser.get(shared.mediaPageUrl);

        // Media list on Media Collections page should contain the same number of Media records
        expect(shared.tableElements.count()).toBe(mediaListCount);
      });
    });

    xit('should list each existing Media', function() {
      //TODO
      shared.createBtn.click();
      mediaCollections.addMediaMappingButton.click();
      mediaCollections.mediaDropdowns.get(0).click();
      mediaCollections.mediaDropdownSearchFields.get(0).click();

      // Get list of Media
      var mediaNameList = [];
      mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).each(function(mediaElement, index) {
        mediaElement.getText().then(function(mediaName) {
          mediaNameList.push(mediaName);
        });
      }).then(function() {
        browser.get(shared.mediaPageUrl);

        // Media list on Media Collections page should contain each of the same Media records
        for (var i = 0; i < mediaNameList.length; i++) {
          shared.searchField.clear();
          shared.searchField.sendKeys(mediaNameList[i]);
          expect(shared.tableElements.get(0).getText()).toContain(mediaNameList[i]);
        }
      });
    });

    it('should search list all existing Media by Media name', function() {
      browser.get(shared.mediaPageUrl);
      // Get list of media from Media page
      var mediaNameList = [];
      shared.tableElements.each(function(mediaElement, index) {
        mediaElement.getText().then(function(mediaName) {
          mediaNameList.push(mediaName);
        });
      }).then(function() {
        browser.get(shared.mediaCollectionsPageUrl);
        shared.createBtn.click();
        mediaCollections.addMediaMappingButton.click();
        mediaCollections.mediaDropdowns.get(0).click();
        mediaCollections.mediaDropdownSearchFields.get(0).click();

        expect(mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).count()).toBe(mediaNameList.length);

        // Search Media Mappings for each media element
        for (var i = 0; i < mediaNameList.length; i++) {
          expect(mediaNameList[i]).toContain(mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(i).getText());
        }
      });
    });
  });

  describe('create new media pane', function() {

    it('should create new Media to be included in Media Collection', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      var randomMedia = Math.floor((Math.random() * 1000) + 1);
      var mediaAdded = false;
      var newMediaName = 'Text-To-Speech from Media Collections ' + randomMedia;

      // Edit required fields
      mediaCollections.mediaNameField.sendKeys(newMediaName);
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.mediaSourceField.sendKeys('Text-To-Speech Source ' + randomMedia);

      mediaCollections.mediaCreateBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Media pane is closed
        expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
        expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeTruthy();

        // Confirm media is selected in Media Collection
        expect(mediaCollections.mediaDropdowns.get(0).getAttribute('value')).toBe(newMediaName);

        // Continue to create new Media Collection
        mediaCollections.nameFormField.sendKeys('Media Collection ' + randomMedia);
        mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

        shared.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();
        });
      });
    });

    it('should create new Media to be included in Media Collection when adding to existing Collection', function() {
      shared.firstTableRow.click();

      mediaCollections.mediaDropdowns.then(function(mediaDropdowns) {
        mediaCollections.addMediaMappingButton.click();
        mediaCollections.mediaDropdowns.get(mediaDropdowns.length).click();
        mediaCollections.openCreateMediaButton.get(mediaDropdowns.length).click();

        var randomMedia = Math.floor((Math.random() * 1000) + 1);
        var mediaAdded = false;
        var newMediaName = 'Text-To-Speech from Media Collections ' + randomMedia;

        // Edit required fields
        mediaCollections.mediaNameField.sendKeys(newMediaName);
        mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
        mediaCollections.mediaSourceField.sendKeys('Text-To-Speech Source ' + randomMedia);

        mediaCollections.mediaCreateBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Media pane is closed
          expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
          expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeTruthy();

          // Confirm media is selected in New Media slot for Media Collection
          expect(mediaCollections.mediaDropdowns.get(mediaDropdowns.length).getAttribute('value')).toBe(newMediaName);

          // Ensure existing Media Mappings Remain unchanged
          for (var i = 0; i < mediaDropdowns.length; i++) {
            expect(mediaCollections.mediaDropdowns.get(i).getAttribute('value')).toBe(mediaDropdowns[i].getAttribute('value'));
          }

          // Continue to create new Media Collection
          mediaCollections.nameFormField.sendKeys('Media Collection ' + randomMedia);
          mediaCollections.mediaIdentifiers.get(mediaDropdowns.length).sendKeys('Identifier ' + randomMedia);
          mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

          shared.submitFormBtn.click().then(function() {
            expect(shared.successMessage.isDisplayed()).toBeTruthy();
          });
        });
      });
    });

    it('should be displayed when Create New Button is selected', function() {
      shared.createBtn.click();

      // Create Media pane is not displayed by default
      expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();

      mediaCollections.openCreateNewMedia();

      // Create Media pane is displayed
      expect(mediaCollections.createMediaForm.isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaNameField.isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaTypeDropdown.isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaSourceField.isDisplayed()).toBeTruthy();

      // Create Media Pane has it's own Cancel, Create and Create & New buttons
      expect(mediaCollections.mediaCancelBtn.isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaCreateBtn.isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaCreateAndNewBtn.isDisplayed()).toBeTruthy();
    });

    it('should create new Audio Media consistent with Media page create', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      var randomMedia = Math.floor((Math.random() * 1000) + 1);
      var mediaAdded = false;
      var newMediaName = 'Audio from Media Collections ' + randomMedia;

      // Edit required fields
      mediaCollections.mediaNameField.sendKeys(newMediaName);
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(1).click();
      mediaCollections.mediaSourceField.sendKeys('http://www.example.com/' + randomMedia);

      mediaCollections.mediaCreateBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Media pane is closed
        expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
        expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeTruthy();

        // Confirm media is displayed in media list
        browser.get(shared.mediaPageUrl);

        shared.tableElements.then(function(rows) {
          for (var i = 1; i <= rows.length; ++i) {
            // Check if media name in table matches newly added media
            element(by.css('tr:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
              if (value == newMediaName) {
                mediaAdded = true;
              }
            });
          }
        }).thenFinally(function() {
          // Verify new media was found in the media table
          expect(mediaAdded).toBeTruthy();
        });
      });
    });

    it('should create new Text-To-Speech Media consistent with Media page create', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      var randomMedia = Math.floor((Math.random() * 1000) + 1);
      var mediaAdded = false;
      var newMediaName = 'Text-To-Speech from Media Collections ' + randomMedia;

      // Edit required fields
      mediaCollections.mediaNameField.sendKeys(newMediaName);
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.mediaSourceField.sendKeys('Text-To-Speech Source ' + randomMedia);

      mediaCollections.mediaCreateBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Media pane is closed
        expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
        expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeTruthy();

        // Confirm media is displayed in media list
        browser.get(shared.mediaPageUrl);

        shared.tableElements.then(function(rows) {
          for (var i = 1; i <= rows.length; ++i) {
            // Check if media name in table matches newly added media
            element(by.css('tr:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
              if (value == newMediaName) {
                mediaAdded = true;
              }
            });
          }
        }).thenFinally(function() {
          // Verify new media was found in the media table
          expect(mediaAdded).toBeTruthy();
        });
      });
    });

    it('should require all fields', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      // Create buttons are disabled
      expect(mediaCollections.mediaCreateBtn.getAttribute('disabled')).toBeTruthy();
      expect(mediaCollections.mediaCreateAndNewBtn.getAttribute('disabled')).toBeTruthy();
      mediaCollections.mediaCreateBtn.click();
      mediaCollections.mediaCreateAndNewBtn.click();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Touch fields and ensure required field messages are displayed
      mediaCollections.mediaNameField.click();
      mediaCollections.mediaTypeDropdown.click();
      mediaCollections.mediaSourceField.sendKeys('\t');

      // Create buttons are still disabled
      expect(mediaCollections.mediaCreateBtn.getAttribute('disabled')).toBeTruthy();
      expect(mediaCollections.mediaCreateAndNewBtn.getAttribute('disabled')).toBeTruthy();
      mediaCollections.mediaCreateBtn.click();
      mediaCollections.mediaCreateAndNewBtn.click();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Required field messages displayed
      expect(mediaCollections.mediaRequiredError.get(0).isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaRequiredError.get(1).isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaRequiredError.get(2).isDisplayed()).toBeTruthy();

      expect(mediaCollections.mediaRequiredError.get(0).getText()).toBe('Please enter a name');
      expect(mediaCollections.mediaRequiredError.get(1).getText()).toBe('Please enter a type');
      expect(mediaCollections.mediaRequiredError.get(2).getText()).toBe('Please enter a source');
    });

    it('should validate Audio Media Source field', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      // Edit fields
      mediaCollections.mediaNameField.sendKeys('Media Name');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(1).click();
      mediaCollections.mediaSourceField.sendKeys('This is not a valid audio source\t');

      // Submit buttons are still disabled
      expect(mediaCollections.mediaCreateBtn.getAttribute('disabled')).toBeTruthy();
      expect(mediaCollections.mediaCreateAndNewBtn.getAttribute('disabled')).toBeTruthy();

      // Error messages displayed
      expect(mediaCollections.mediaRequiredError.get(0).isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaRequiredError.get(0).getText()).toBe('Audio source must be a URL');
    });

    it('should leave Media pane open when selecting Create & New', function() {
      var randomMedia = Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      // Edit required fields
      mediaCollections.mediaNameField.sendKeys('Text-To-Speech from Media Collections ' + randomMedia);
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.mediaSourceField.sendKeys('Text-To-Speech Source ' + randomMedia);

      mediaCollections.mediaCreateAndNewBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Media pane remains open
        expect(mediaCollections.createMediaForm.isDisplayed()).toBeTruthy();
        expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeTruthy();
      });
    });

    it('should clear new Media fields and close pane on Media cancel', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      mediaCollections.mediaNameField.sendKeys('Cancel Media');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.mediaSourceField.sendKeys('Cancel Source');

      mediaCollections.mediaCancelBtn.click();

      // Dismiss warning message
      shared.dismissChanges();

      // Media pane is closed
      expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
      expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeTruthy();

      // Fields are cleared and reset to defaults
      mediaCollections.openCreateNewMedia();
      expect(mediaCollections.mediaNameField.getAttribute('value')).toBe('');
      expect(mediaCollections.mediaTypeDropdown.$('option:checked').getText()).toBe('Select Type...');
      expect(mediaCollections.mediaSourceField.getAttribute('value')).toBe('');
    });

    it('should leave new Media fields and pane open on Media Collections cancel', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      mediaCollections.mediaNameField.sendKeys('Cancel Media Collections');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.mediaSourceField.sendKeys('Cancel Source');

      shared.cancelFormBtn.click();

      // Dismiss warning message
      shared.dismissChanges();

      // Media pane remains open
      expect(mediaCollections.createMediaForm.isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeFalsy();

      // Fields remain unchanged
      expect(mediaCollections.mediaNameField.getAttribute('value')).toBe('Cancel Media Collections');
      expect(mediaCollections.mediaTypeDropdown.$('option:checked').getText()).toBe('TTS');
      expect(mediaCollections.mediaSourceField.getAttribute('value')).toBe('Cancel Source');
    });

    it('should clear new Media fields and close pane on Media close', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      mediaCollections.mediaNameField.sendKeys('Close Media');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.mediaSourceField.sendKeys('Close Source');

      mediaCollections.closeMedia.click();

      // Dismiss warning message
      shared.dismissChanges();

      // Media pane is closed
      expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
      expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeTruthy();

      // Fields are cleared and reset to defaults
      mediaCollections.openCreateNewMedia();
      expect(mediaCollections.mediaNameField.getAttribute('value')).toBe('');
      expect(mediaCollections.mediaTypeDropdown.$('option:checked').getText()).toBe('Select Type...');
      expect(mediaCollections.mediaSourceField.getAttribute('value')).toBe('');
    });

    it('should leave new Media fields and pane open on Media Collections close', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      mediaCollections.mediaNameField.sendKeys('Close Media Collections');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.mediaSourceField.sendKeys('Close Source');

      mediaCollections.closeMediaCollection.click();

      // Dismiss warning message
      shared.dismissChanges();

      // Media pane remains open
      expect(mediaCollections.createMediaForm.isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeFalsy();

      // Fields remain unchanged
      expect(mediaCollections.mediaNameField.getAttribute('value')).toBe('Close Media Collections');
      expect(mediaCollections.mediaTypeDropdown.$('option:checked').getText()).toBe('TTS');
      expect(mediaCollections.mediaSourceField.getAttribute('value')).toBe('Close Source');
    });

    it('should leave new Media pane open on Media Collections create', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      // Create Media Collection
      randomCollection = Math.floor((Math.random() * 1000) + 1);
      mediaCollections.nameFormField.sendKeys('Media Collection' + randomCollection);
      mediaCollections.removeMedia.get(0).click();

      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Media pane remains open
        expect(mediaCollections.createMediaForm.isDisplayed()).toBeTruthy();
        expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeTruthy();
      });
    });

    xit('should leave new Media fields and pane open on Media Collections create', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      mediaCollections.mediaNameField.sendKeys('Create Media Collections');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.mediaSourceField.sendKeys('Create Source');

      // Create Media Collection
      randomCollection = Math.floor((Math.random() * 1000) + 1);
      mediaCollections.nameFormField.sendKeys('Media Collection' + randomCollection);
      mediaCollections.removeMedia.get(0).click();

      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Media pane remains open
        expect(mediaCollections.createMediaForm.isDisplayed()).toBeTruthy();
        expect(mediaCollections.mediaCollectionsForm.isDisplayed()).toBeTruthy();

        // Fields remain unchanged
        expect(mediaCollections.mediaNameField.getAttribute('value')).toBe('Create Media Collections');
        expect(mediaCollections.mediaTypeDropdown.$('option:checked').getText()).toBe('TTS');
        expect(mediaCollections.mediaSourceField.getAttribute('value')).toBe('Create Source');
      });
    });
  });
});

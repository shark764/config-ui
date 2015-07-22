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

  xit('should include valid fields when creating a new Media Collection', function() {
    shared.createBtn.click();
    expect(mediaCollections.creatingMediaHeader.getText()).toContain('Creating New Media Collection');
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

  xit('should successfully create new Media Collection without Media', function() {
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

  xit('should include Media Collection page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeFalsy(); //Hide by default
    //expect(shared.actionsBtn.isDisplayed()).toBeFalsy(); // No bulk actions
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Media Collection Management');
  });

  xit('should require field input when creating a new Media Collection', function() {
    mediaCollectionCount = shared.tableElements.count();
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCollectionCount);
  });

  xit('should require name when creating a new Media Collection', function() {
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

  xit('should successfully create new Media Collection without Description', function() {
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

  xit('should clear fields on Cancel', function() {
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

  xit('should clear and hide Media Mappings fields on Cancel', function() {
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

  xit('should include valid fields when editing an existing Media Collection', function() {
    shared.firstTableRow.click();
    expect(mediaCollections.editingMediaHeader.isDisplayed()).toBeTruthy();
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

  xit('should display media collection details when selected from table', function() {
    // Select first media from table
    shared.firstTableRow.click();

    // Verify media collections details in table matches populated field
    expect(mediaCollections.editingMediaHeader.getText()).toContain(shared.firstTableRow.element(by.css(mediaCollections.nameColumn)).getText());
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
          expect(mediaCollections.editingMediaHeader.getText()).toContain(shared.secondTableRow.element(by.css(mediaCollections.nameColumn)).getText());
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

  xit('should reset fields after editing Media Collection and selecting Cancel', function() {
    shared.firstTableRow.click();

    var originalName = mediaCollections.nameFormField.getAttribute('value');
    var originalDescription = mediaCollections.descriptionFormField.getAttribute('value');

    // Edit editable fields
    mediaCollections.nameFormField.sendKeys('Edit');
    mediaCollections.descriptionFormField.sendKeys('Edit');

    shared.cancelFormBtn.click();
    shared.dismissChanges();

    expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(mediaCollections.nameFormField.getAttribute('value')).toBe(originalName);
    expect(mediaCollections.descriptionFormField.getAttribute('value')).toBe(originalDescription);
  });

  xit('should reset fields after editing Media Mappings and selecting Cancel', function() {
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
        mappingOriginalMedia = mediaCollections.mediaDropdowns.get(0).$('option:checked').getText();

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

      expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(mediaCollections.mediaMappings.count()).toBe(originalMediaCount);
      if (mediaCount > 0) {
        expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).toBe(originalDefaultId);
        expect(mediaCollections.mediaIdentifiers.get(0).getAttribute('value')).toBe(mappingOriginalId);
        expect(mediaCollections.mediaDropdowns.$('option:checked').getText()).toBe(mappingOriginalMedia);
      } else {
        expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
      }
    });
  });

  xit('should allow fields to be updated when editing', function() {
    shared.firstTableRow.click();

    // Edit editable fields
    mediaCollections.nameFormField.sendKeys('Edit');
    mediaCollections.descriptionFormField.sendKeys('Edit');

    var editedName = mediaCollections.nameFormField.getAttribute('value');
    var editedDescription = mediaCollections.descriptionFormField.getAttribute('value');

    shared.submitFormBtn.click().then(function() {
      expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeFalsy();
      expect(mediaCollections.requiredError.get(1).isDisplayed()).toBeFalsy();
      expect(mediaCollections.requiredError.get(2).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.firstTableRow.click();
      expect(mediaCollections.nameFormField.getAttribute('value')).toBe(editedName);
      expect(mediaCollections.descriptionFormField.getAttribute('value')).toBe(editedDescription);
    });
  });

  xit('should require name field when editing', function() {
    shared.firstTableRow.click();

    // Edit editable fields
    mediaCollections.nameFormField.clear();
    mediaCollections.nameFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    // TODO
    //expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeTruthy();
    //expect(mediaCollections.requiredError.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  xit('should not require description when editing', function() {
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

  xit('should allow fields to be updated when editing Media Mappings', function() {
    shared.firstTableRow.click();

    // Edit existing media
    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 0) {
        mediaCollections.mediaIdentifiers.get(0).sendKeys('edit');
        mediaCollections.defaultIdDropdown.all(by.css('option')).get(2).click();

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
        });
      }
    });
  });

  xit('should require identifier field when editing a Media Mapping', function() {
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
        expect(mediaCollections.requiredError.get(4).isDisplayed()).toBeTruthy();
        expect(mediaCollections.requiredError.get(4).getText()).toBe('Please enter an identifier for this media item');
        expect(shared.successMessage.isPresent()).toBeFalsy();
      }
    });
  });

  xit('should allow Media Mappings to be added when editing', function() {
    shared.firstTableRow.click();
    var originalMediaCount = mediaCollections.mediaMappings.count();

    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      // Add media
      mediaCollections.addMediaMappingButton.click();
      mediaCollections.mediaIdentifiers.get(mediaCount).sendKeys('New Media Identifier');

      mediaCollections.mediaDropdowns.get(mediaCount).click();
      mediaCollections.mediaDropdownSearchFields.get(mediaCount).click();
      mediaCollections.mediaMappings.get(mediaCount).all(by.css('ul')).get(0).click();

      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Changes persist
        browser.refresh();
        shared.firstTableRow.click();

        expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
        expect(mediaCollections.mediaMappings.count()).toBeGreaterThan(mediaCount);
      });
    });
  });

  xit('should allow a Media Mappings to be removed when editing', function() {
    shared.firstTableRow.click();

    // Remove existing media
    mediaCollections.mediaMappings.count().then(function(mediaCount) {
      if (mediaCount > 1) {
        mediaCollections.removeMedia.get(0).click();
        mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

        expect(mediaCollections.mediaMappings.count()).toBeLessThan(mediaCount);

        shared.submitFormBtn.click();
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Changes persist
        browser.refresh();
        shared.firstTableRow.click();

        expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
        expect(mediaCollections.mediaMappings.count()).toBeLessThan(mediaCount);
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
    xit('should list all existing Media', function() {
      // TODO
    });

    xit('should search list all existing Media by Media name', function() {
      // TODO
    });
  });

  describe('create new media pane', function() {

    xit('should create new Media to be included in Media Collection', function() {
      // TODO
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
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

    xit('should create new Audio Media consistent with Media page create', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      randomMedia = Math.floor((Math.random() * 1000) + 1);
      var mediaAdded = false;
      var newMediaName = 'Audio Media ' + randomMedia;
      mediaCollections.mediaCreateBtn.click();

      // Edit required fields
      mediaCollections.mediaNameField.sendKeys(newMediaName);
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(1).click();
      mediaCollections.mediaSourceField.sendKeys('http://www.example.com/' + randomMedia);

      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Confirm media is displayed in media list
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

    xit('should require all fields', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
    });

    xit('should validate all fields', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
    });

    xit('should leave Media pane open when selecting Create & New', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
    });

    xit('should clear new Media fields and close pane on Media cancel', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
    });

    xit('should leave new Media fields and pane open on Media Collections cancel', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
    });

    xit('should clear new Media fields and close pane on Media close', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
    });

    xit('should leave new Media fields and pane open on Media Collections close', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
    });

    xit('should leave new Media fields and pane open on Media Collections create', function() {
      // TODO
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
    });
  });

});

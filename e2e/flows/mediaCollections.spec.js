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

  it('should include valid Media Collection fields when creating a new Media Collection', function() {
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

  it('should require name when creating a new Media', function() {
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
    expect(mediaCollections.editingMediaHeader.isDisplayed()).toBeTruthy();
    expect(mediaCollections.nameFormField.isDisplayed()).toBeTruthy();
    expect(mediaCollections.descriptionFormField.isDisplayed()).toBeTruthy();

    shared.firstTableRow.element(by.css(mediaCollections.identifierColumn)).getText().then(function(identifiers) {
      if (identifiers != null) {
        expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
      } else {
        expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
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
    expect(mediaCollections.editingMediaHeader.getText()).toContain(shared.firstTableRow.element(by.css(mediaCollections.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(mediaCollections.nameColumn)).getText()).toBe(mediaCollections.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(mediaCollections.descriptionColumn)).getText()).toBe(mediaCollections.descriptionFormField.getAttribute('value'));

    shared.firstTableRow.element(by.css(mediaCollections.identifierColumn)).getText().then(function(identifiers) {
      if (identifiers != null) {
        expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
        expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).not.toBe('');
        expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeFalsy();
        mediaCollections.mediaIdentifiers.count().then(function(mediaCount) {
          for (var i = 0; i < mediaCount; i++) {
            expect(identifiers).toContain(mediaCollections.mediaIdentifiers.get(i).getText());
          }
        });
      } else {
        expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
        expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeTruthy();
        expect(mediaCollections.noMediaMappingsMessage.getText()).toBeTruthy('Add media items with the plus button above.');
      }
    });

    // Change selected media and ensure details are updated
    shared.tableElements.count().then(function(curMediaCount) {
      if (curMediaCount > 1) {
        shared.secondTableRow.click();

        // Verify media collections details in table matches populated field
        expect(mediaCollections.editingMediaHeader.getText()).toContain(shared.secondTableRow.element(by.css(mediaCollections.nameColumn)).getText());
        expect(shared.secondTableRow.element(by.css(mediaCollections.nameColumn)).getText()).toBe(mediaCollections.nameFormField.getAttribute('value'));
        expect(shared.secondTableRow.element(by.css(mediaCollections.descriptionColumn)).getText()).toBe(mediaCollections.descriptionFormField.getAttribute('value'));

        shared.secondTableRow.element(by.css(mediaCollections.identifierColumn)).getText().then(function(identifiers) {
          if (identifiers != null) {
            expect(mediaCollections.defaultIdDropdown.isDisplayed()).toBeTruthy();
            expect(mediaCollections.defaultIdDropdown.$('option:checked').getText()).not.toBe('');
            expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeFalsy();
            mediaCollections.mediaIdentifiers.count().then(function(mediaCount) {
              for (var i = 0; i < mediaCount; i++) {
                expect(identifiers).toContain(mediaCollections.mediaIdentifiers.get(i).getText());
              }
            });
          } else {
            expect(mediaCollections.defaultIdDropdown.isPresent()).toBeFalsy();
            expect(mediaCollections.noMediaMappingsMessage.isDisplayed()).toBeTruthy();
            expect(mediaCollections.noMediaMappingsMessage.getText()).toBeTruthy('Add media items with the plus button above.');
          }
        });
      };
    });
  });

  it('should reset fields after editing Media Collection and selecting Cancel', function() {
    shared.firstTableRow.click();

    var originalName = mediaCollections.nameFormField.getAttribute('value');
    var originalDescription = mediaCollections.descriptionFormField.getAttribute('value');

    // Edit editable fields
    mediaCollections.sourceFormField.sendKeys('Edit');

    shared.cancelFormBtn.click();
    shared.dismissChanges();

    expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(mediaCollections.sourceFormField.getAttribute('value')).toBe(originalSource);
  });

  xit('should allow the Audio Media fields to be updated except Type', function() {
    shared.searchField.sendKeys('Audio');
    shared.firstTableRow.click();

    // Edit fields
    mediaCollections.sourceFormField.sendKeys('Edit');

    var editedSource = mediaCollections.sourceFormField.getAttribute('value');

    shared.submitFormBtn.click().then(function() {
      expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeFalsy();
      expect(mediaCollections.requiredError.get(1).isDisplayed()).toBeFalsy();
      expect(mediaCollections.requiredError.get(2).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.searchField.sendKeys('Audio');
      shared.firstTableRow.click();
      expect(mediaCollections.sourceFormField.getAttribute('value')).toBe(editedSource);
    });
  });

  xit('should allow the Text-To-Speech Media fields to be updated except Type', function() {
    shared.searchField.sendKeys('Text-To-Speech');
    shared.firstTableRow.click();

    // Edit fields
    mediaCollections.sourceFormField.sendKeys('Edit');

    var editedSource = mediaCollections.sourceFormField.getAttribute('value');

    shared.submitFormBtn.click().then(function() {
      expect(mediaCollections.requiredError.get(0).isDisplayed()).toBeFalsy();
      expect(mediaCollections.requiredError.get(1).isDisplayed()).toBeFalsy();
      expect(mediaCollections.requiredError.get(2).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.searchField.sendKeys('Text-To-Speech');
      shared.firstTableRow.click();
      expect(mediaCollections.sourceFormField.getAttribute('value')).toBe(editedSource);
    });
  });

  xit('should require source field when editing a Media', function() {
    // Select first media from table
    shared.firstTableRow.click();

    // Edit fields
    mediaCollections.sourceFormField.clear();
    mediaCollections.sourceFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(mediaCollections.requiredError.get(2).isDisplayed()).toBeTruthy();
    expect(mediaCollections.requiredError.get(2).getText()).toBe('Please enter a source');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});

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

    browser.get(shared.mediaCollectionsPageUrl);
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
      });
    });
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.mediaCollectionsPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  describe('media mappings', function() {

    it('should include the correct number of Media elements', function() {
      shared.createBtn.click();
      mediaCollections.mediaDropdowns.get(0).click();
      mediaCollections.mediaDropdownSearchFields.get(0).click();

      // Get list of Media
      mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).count().then(function(mediaListCount) {
        browser.get(shared.mediaPageUrl);

        // Media list on Media Collections page should contain the same number of Media records
        expect(shared.tableElements.count()).toBe(mediaListCount);
      });
    });

    it('should list each existing Media', function() {
      shared.createBtn.click();
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
        for (var i = 0; i < mediaNameList.length && i < 10; i++) {
          shared.searchField.clear();
          shared.searchField.sendKeys(mediaNameList[i]);
          expect(shared.tableElements.count()).toBeGreaterThan(0);
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
        mediaCollections.mediaDropdowns.get(0).click();
        mediaCollections.mediaDropdownSearchFields.get(0).click();

        expect(mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).count()).toBe(mediaNameList.length);

        // Search Media Mappings for each media element
        for (var i = 0; i < mediaNameList.length && i < 10; i++) {
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

      // Edit required fields
      mediaCollections.mediaNameField.sendKeys('Audio from Media Collections ' + randomMedia);
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(1).click();
      mediaCollections.audioSourceField.sendKeys('http://www.example.com/' + randomMedia);

      mediaCollections.mediaCreateBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
        // Media is shown as selected in the media mappings
        expect(mediaCollections.mediaDropdowns.get(0).getAttribute('value')).toBe('Audio from Media Collections ' + randomMedia);
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
      mediaCollections.audioSourceField.sendKeys('http://www.example.com/' + randomMedia);

      mediaCollections.mediaCreateBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Media pane is closed
        expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
        expect(mediaCollections.mediaCollectionForm.isDisplayed()).toBeTruthy();

        // Confirm media is displayed in media list
        browser.get(shared.mediaPageUrl);
        shared.searchField.sendKeys('Audio from Media Collections ' + randomMedia);

        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain('Audio from Media Collections ' + randomMedia);
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
      mediaCollections.ttsSourceField.sendKeys('Text-To-Speech Source ' + randomMedia);
      mediaCollections.voiceOptions.get((randomMedia % 3) + 1).click();
      mediaCollections.languageOptions.get((randomMedia % 26) + 1).click();

      mediaCollections.mediaCreateBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Media pane is closed
        expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
        expect(mediaCollections.mediaCollectionForm.isDisplayed()).toBeTruthy();

        // Confirm media is displayed in media list
        browser.get(shared.mediaPageUrl);
        shared.searchField.sendKeys('Text-To-Speech from Media Collections ' + randomMedia);

        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain('Text-To-Speech from Media Collections ' + randomMedia);
      });
    });

    it('should require all Text-to-Speech fields', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();

      // Create buttons are disabled
      expect(mediaCollections.mediaCreateBtn.getAttribute('disabled')).toBeTruthy();
      expect(mediaCollections.mediaCreateAndNewBtn.getAttribute('disabled')).toBeTruthy();
      mediaCollections.mediaCreateBtn.click();
      mediaCollections.mediaCreateAndNewBtn.click();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Touch fields and ensure required field messages are displayed
      mediaCollections.mediaNameField.click();
      mediaCollections.ttsSourceField.click();
      mediaCollections.languageFormDropdown.click();
      mediaCollections.voiceOptions.get((randomMedia % 3) + 1).click();

      // Create buttons are still disabled
      expect(mediaCollections.mediaCreateBtn.getAttribute('disabled')).toBeTruthy();
      expect(mediaCollections.mediaCreateAndNewBtn.getAttribute('disabled')).toBeTruthy();
      mediaCollections.mediaCreateBtn.click();
      mediaCollections.mediaCreateAndNewBtn.click();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Required field messages displayed
      expect(mediaCollections.mediaRequiredError.count()).toBe(4);
      expect(mediaCollections.mediaRequiredError.get(0).getText()).toBe('Please enter a name');
      expect(mediaCollections.mediaRequiredError.get(1).getText()).toBe('Please enter a source');
      expect(mediaCollections.mediaRequiredError.get(2).getText()).toBe('Please enter a language');
      expect(mediaCollections.mediaRequiredError.get(3).getText()).toBe('Please enter a voice');
    });

    it('should require all Audio fields', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(1).click();

      // Create buttons are disabled
      expect(mediaCollections.mediaCreateBtn.getAttribute('disabled')).toBeTruthy();
      expect(mediaCollections.mediaCreateAndNewBtn.getAttribute('disabled')).toBeTruthy();
      mediaCollections.mediaCreateBtn.click();
      mediaCollections.mediaCreateAndNewBtn.click();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Touch fields and ensure required field messages are displayed
      mediaCollections.mediaNameField.click();
      mediaCollections.audioSourceField.sendKeys('\t');

      // Create buttons are still disabled
      expect(mediaCollections.mediaCreateBtn.getAttribute('disabled')).toBeTruthy();
      expect(mediaCollections.mediaCreateAndNewBtn.getAttribute('disabled')).toBeTruthy();
      mediaCollections.mediaCreateBtn.click();
      mediaCollections.mediaCreateAndNewBtn.click();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Required field messages displayed
      expect(mediaCollections.mediaRequiredError.count()).toBe(2);
      expect(mediaCollections.mediaRequiredError.get(0).getText()).toBe('Please enter a name');
      expect(mediaCollections.mediaRequiredError.get(1).getText()).toBe('Please enter a source');
    });

    it('should validate Audio Media Source field', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      // Edit fields
      mediaCollections.mediaNameField.sendKeys('Media Name');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(1).click();
      mediaCollections.audioSourceField.sendKeys('This is not a valid audio source\t');

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
      mediaCollections.ttsSourceField.sendKeys('Text-To-Speech Source ' + randomMedia);
      mediaCollections.languageOptions.get((randomMedia % 26) + 1).click();
      mediaCollections.voiceOptions.get((randomMedia % 3) + 1).click();

      mediaCollections.mediaCreateAndNewBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Media pane remains open
        expect(mediaCollections.createMediaForm.isDisplayed()).toBeTruthy();
        expect(mediaCollections.mediaCollectionForm.isDisplayed()).toBeTruthy();
      });
    });

    it('should clear new Media fields and close pane on Media cancel', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      mediaCollections.mediaNameField.sendKeys('Cancel Media');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.ttsSourceField.sendKeys('Cancel Source');
      mediaCollections.languageOptions.get((randomMedia % 26) + 1).click();
      mediaCollections.voiceOptions.get((randomMedia % 3) + 1).click();

      mediaCollections.mediaCancelBtn.click();

      // Dismiss warning message
      shared.waitForAlert();
      shared.dismissChanges();

      // Media pane is closed
      expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
      expect(mediaCollections.mediaCollectionForm.isDisplayed()).toBeTruthy();
    });

    it('should leave new Media pane open on Media Collections cancel', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      mediaCollections.mediaNameField.sendKeys('Cancel Media Collections');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.ttsSourceField.sendKeys('Cancel Source');
      mediaCollections.languageOptions.get((randomMedia % 26) + 1).click();
      mediaCollections.voiceOptions.get((randomMedia % 3) + 1).click();

      var selectedLanguage = mediaCollections.languageFormDropdown.$('option:checked').getText();
      var selectedVoice = mediaCollections.voiceFormDropdown.$('option:checked').getText();

      mediaCollections.cancelFormBtn.click();

      // Dismiss warning message
      shared.waitForAlert();
      shared.dismissChanges();

      // Media pane remains open
      expect(mediaCollections.createMediaForm.isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaCollectionForm.isDisplayed()).toBeFalsy();

      // Media fields remain unchanged
      expect(mediaCollections.mediaNameField.getAttribute('value')).toBe('Cancel Media Collections');
      expect(mediaCollections.ttsSourceField.getAttribute('value')).toBe('Cancel Source');
      expect(mediaCollections.languageFormDropdown.$('option:checked').getText()).toBe(selectedLanguage);
      expect(mediaCollections.voiceFormDropdown.$('option:checked').getText()).toBe(selectedVoice);
    });

    it('should close new media pane on Media close', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      mediaCollections.mediaNameField.sendKeys('Close Media');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.ttsSourceField.sendKeys('Close Source');
      mediaCollections.languageOptions.get((randomMedia % 26) + 1).click();
      mediaCollections.voiceOptions.get((randomMedia % 3) + 1).click();

      mediaCollections.closeMedia.click();

      // Dismiss warning message
      shared.waitForAlert();
      shared.dismissChanges();

      // Media pane is closed
      expect(mediaCollections.createMediaForm.isDisplayed()).toBeFalsy();
      expect(mediaCollections.mediaCollectionForm.isDisplayed()).toBeTruthy();
    });

    it('should leave new Media fields and pane open on Media Collections close', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      mediaCollections.mediaNameField.sendKeys('Close Media Collections');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.ttsSourceField.sendKeys('Close Source');
      mediaCollections.languageOptions.get((randomMedia % 26) + 1).click();
      mediaCollections.voiceOptions.get((randomMedia % 3) + 1).click();

      var selectedLanguage = mediaCollections.languageFormDropdown.$('option:checked').getText();
      var selectedVoice = mediaCollections.voiceFormDropdown.$('option:checked').getText();

      mediaCollections.closeMediaCollection.click();

      // Dismiss warning message
      shared.waitForAlert();
      shared.dismissChanges();

      // Media pane remains open
      expect(mediaCollections.createMediaForm.isDisplayed()).toBeTruthy();
      expect(mediaCollections.mediaCollectionForm.isDisplayed()).toBeFalsy();

      // Fields remain unchanged
      expect(mediaCollections.mediaNameField.getAttribute('value')).toBe('Close Media Collections');
      expect(mediaCollections.mediaTypeDropdown.$('option:checked').getText()).toBe('Text-to-Speech');
      expect(mediaCollections.ttsSourceField.getAttribute('value')).toBe('Close Source');
      expect(mediaCollections.languageFormDropdown.$('option:checked').getText()).toBe(selectedLanguage);
      expect(mediaCollections.voiceFormDropdown.$('option:checked').getText()).toBe(selectedVoice);
    });

    it('should leave new Media fields and pane open on Media Collections create', function() {
      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      mediaCollections.mediaNameField.sendKeys('Create Media Collections');
      mediaCollections.mediaTypeDropdown.all(by.css('option')).get(2).click();
      mediaCollections.ttsSourceField.sendKeys('Create Source');
      mediaCollections.languageOptions.get((randomMedia % 26) + 1).click();
      mediaCollections.voiceOptions.get((randomMedia % 26) + 1).click();

      var selectedLanguage = mediaCollections.languageFormDropdown.$('option:checked').getText();
      var selectedVoice = mediaCollections.voiceFormDropdown.$('option:checked').getText();

      // Create Media Collection
      randomCollection = Math.floor((Math.random() * 1000) + 1);
      mediaCollections.nameFormField.sendKeys('Media Collection' + randomCollection);
      mediaCollections.removeMedia.get(0).click();

      // Add Another Media Mapping with existing media
      mediaCollections.addMediaMappingButton.click();
      mediaCollections.mediaIdentifiers.get(0).sendKeys('Media Identifier ' + randomCollection);
      mediaCollections.mediaDropdowns.get(0).click();
      mediaCollections.mediaDropdownSearchFields.get(0).click();
      mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();

      // Set default Identifier
      mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();

      mediaCollections.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Media pane remains open
        expect(mediaCollections.createMediaForm.isDisplayed()).toBeTruthy();
        expect(mediaCollections.mediaCollectionForm.isDisplayed()).toBeTruthy();

        // Fields remain unchanged
        expect(mediaCollections.mediaNameField.getAttribute('value')).toBe('Create Media Collections');
        expect(mediaCollections.mediaTypeDropdown.$('option:checked').getText()).toBe('Text-to-Speech');
        expect(mediaCollections.ttsSourceField.getAttribute('value')).toBe('Create Source');
        expect(mediaCollections.languageFormDropdown.$('option:checked').getText()).toBe(selectedLanguage);
        expect(mediaCollections.voiceFormDropdown.$('option:checked').getText()).toBe(selectedVoice);
      });
    });
  });
});

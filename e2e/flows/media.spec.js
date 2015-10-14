'use strict';

describe('The media view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    media = require('./media.po.js'),
    params = browser.params,
    mediaCount,
    randomMedia;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.mediaPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include valid Media fields when creating a new Media', function() {
    shared.createBtn.click();
    expect(shared.detailsFormHeader.getText()).toContain('Creating New Media');
    expect(media.audioSourceFormField.isDisplayed()).toBeTruthy();
    expect(media.typeFormDropdown.isDisplayed()).toBeTruthy();
    expect(media.typeFormDropdown.all(by.css('option')).get(1).getText()).toBe('Audio');
    expect(media.typeFormDropdown.all(by.css('option')).get(2).getText()).toBe('Text-to-Speech');
  });

  it('should successfully create new Media with Audio type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    var mediaAdded = false;
    var newMediaSource = 'http://www.example.com/' + randomMedia;
    shared.createBtn.click();

    // Edit required fields
    media.nameFormField.sendKeys('Audio Media ' + randomMedia);
    media.audioSourceFormField.sendKeys(newMediaSource);
    media.typeFormDropdown.all(by.css('option')).get(1).click();

    shared.submitFormBtn.click().then(function () {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Confirm media is displayed in media list
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if media source in table matches newly added media
          element(by.css('tr.ng-scope:nth-child(' + i + ') > ' + media.sourceColumn)).getText().then(function(value) {
            if (value == newMediaSource) {
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

  it('should successfully create new Media with Text-To-Speech type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    var mediaAdded = false;
    var newMediaSource = 'Text-To-Speech Media Source ' + randomMedia;
    shared.createBtn.click();

    // Edit fields
    media.nameFormField.sendKeys(newMediaSource);
    media.typeFormDropdown.all(by.css('option')).get(2).click();
    media.ttsSourceFormField.sendKeys(newMediaSource);

    shared.submitFormBtn.click().then(function () {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Confirm media is displayed in media list
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if media source in table matches newly added media
          element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
            if (value == newMediaSource) {
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

  it('should include media page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeFalsy(); //Hide by default
    expect(shared.actionsBtn.isDisplayed()).toBeFalsy(); //Hide, since there are no bulk actions
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Media Management');
  });

  it('should require field input when creating a new Media', function() {
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should require name when creating a new Media', function() {
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.typeFormDropdown.all(by.css('option')).get(2).click();
    media.ttsSourceFormField.sendKeys(randomMedia);

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch name input field
    media.nameFormField.click();
    media.ttsSourceFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(media.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(0).getText()).toBe('Please enter a name');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should require Source when creating a new Media with Audio type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.nameFormField.sendKeys('Audio Media ' + randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(1).click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch URL input field
    media.audioSourceFormField.click();
    media.nameFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(media.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(0).getText()).toBe('Please enter a source');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should validate Source when creating a new Media with Audio type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.nameFormField.sendKeys('Audio Media ' + randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(1).click();
    media.audioSourceFormField.sendKeys('Not a valid a Audio Media Source');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    //expect(media.requiredError.get(0).isDisplayed()).toBeTruthy();
    //expect(media.requiredError.get(0).getText()).toBe('Audio source must be a URL');
  });

  it('should require Source when creating a new Media with Text-To-Speech type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.nameFormField.sendKeys('Text-To-Speech Media ' + randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(2).click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch URL input field
    media.ttsSourceFormField.click();
    media.nameFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(media.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(0).getText()).toBe('Please enter a source');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should clear fields on Cancel', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.typeFormDropdown.all(by.css('option')).get(1).click();
    media.audioSourceFormField.sendKeys('http://www.example.com/' + randomMedia);
    shared.cancelFormBtn.click();

    // Warning message is displayed
    shared.waitForAlert();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // New media is not created
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Form fields are cleared and reset to default
    expect(media.audioSourceFormField.getAttribute('value')).toBe('');
    expect(media.typeFormDropdown.getAttribute('value')).toBe('');
  });

  it('should display media details when Audio media is selected from table', function() {
    shared.searchField.sendKeys('Audio');
    // Select first media from table
    shared.firstTableRow.click();

    // Verify media details in table matches populated field
    expect(shared.detailsFormHeader.getText()).toContain(shared.firstTableRow.element(by.css(media.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.audioSourceFormField.getAttribute('value'));

    // Change selected media and ensure details are updated
    shared.tableElements.count().then(function(curMediaCount) {
      if (curMediaCount > 1) {
        shared.secondTableRow.click();
        expect(shared.detailsFormHeader.getText()).toContain(shared.secondTableRow.element(by.css(media.nameColumn)).getText());
        expect(shared.secondTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.audioSourceFormField.getAttribute('value'));
      };
    });
  });

  it('should display media details when Text-To-Speech media is selected from table', function() {
    shared.searchField.sendKeys('Text-To-Speech');
    // Select first media from table
    shared.firstTableRow.click();

    // Verify media details in table matches populated field
    expect(shared.detailsFormHeader.getText()).toContain(shared.firstTableRow.element(by.css(media.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.ttsSourceFormField.getAttribute('value'));

    // Change selected media and ensure details are updated
    shared.tableElements.count().then(function(curMediaCount) {
      if (curMediaCount > 1) {
        shared.secondTableRow.click();
        expect(shared.detailsFormHeader.getText()).toContain(shared.secondTableRow.element(by.css(media.nameColumn)).getText());
        expect(shared.secondTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.ttsSourceFormField.getAttribute('value'));
      };
    });
  });

  it('should include valid Media fields when editing an existing Media', function() {
    shared.firstTableRow.click();
    expect(media.nameFormField.isDisplayed()).toBeTruthy();
    //expect(media.sourceFormField.isDisplayed()).toBeTruthy();
    expect(media.typeFormDropdown.getAttribute('disabled')).toBeTruthy();
  });

  it('should reset fields after editing Text-To-Speech media and selecting Cancel', function() {
    shared.searchField.sendKeys('Text-To-Speech');
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    shared.firstTableRow.click();

    var originalSource = media.ttsSourceFormField.getAttribute('value');

    // Edit editable fields
    media.ttsSourceFormField.sendKeys('Edit');

    shared.cancelFormBtn.click();
    shared.waitForAlert();
    shared.dismissChanges();

    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(media.ttsSourceFormField.getAttribute('value')).toBe(originalSource);
  });

  it('should reset fields after editing Audio media and selecting Cancel', function() {
    shared.searchField.sendKeys('Audio');
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    shared.firstTableRow.click();

    var originalSource = media.audioSourceFormField.getAttribute('value');

    // Edit fields
    media.audioSourceFormField.sendKeys('Edit');

    shared.cancelFormBtn.click().then(function () {
      shared.waitForAlert();
      shared.dismissChanges();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(media.audioSourceFormField.getAttribute('value')).toBe(originalSource);
    });
  });

  it('should allow the Audio Media fields to be updated except Type', function() {
    shared.searchField.sendKeys('Audio');
    shared.firstTableRow.click();

    // Edit fields
    media.audioSourceFormField.sendKeys('Edit');

    var editedSource = media.ttsSourceFormField.getAttribute('value');

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.searchField.sendKeys('Audio');
      shared.firstTableRow.click();
      expect(media.ttsSourceFormField.getAttribute('value')).toBe(editedSource);
    });
  });

  it('should allow the Text-To-Speech Media fields to be updated except Type', function() {
    shared.searchField.sendKeys('Text-To-Speech');
    shared.firstTableRow.click();

    // Edit fields
    media.ttsSourceFormField.sendKeys('Edit');

    var editedSource = media.ttsSourceFormField.getAttribute('value');

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.searchField.sendKeys('Text-To-Speech');
      shared.firstTableRow.click();
      expect(media.ttsSourceFormField.getAttribute('value')).toBe(editedSource);
    });
  });

  xit('should require source field when editing a Media', function() {
    // Select first media from table
    shared.firstTableRow.click();

    // Edit fields
    media.sourceFormField.clear();
    media.sourceFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

   // Error messages displayed
    expect(media.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(0).getText()).toBe('Please enter a source');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not dirty the form when selecting Audio media types', function() {
    shared.searchField.sendKeys('Audio');
    shared.tableElements.count().then(function (audioCount) {
      if (audioCount > 1) {
        shared.firstTableRow.click();
        expect(shared.detailsFormHeader.getText()).toContain(shared.firstTableRow.element(by.css(media.nameColumn)).getText());

        shared.secondTableRow.click();
        expect(shared.detailsFormHeader.getText()).toContain(shared.secondTableRow.element(by.css(media.nameColumn)).getText());
      }
    })
  });

  xit('should keep the same source text when switching between Audio and TTS types on create', function() {
    //Regression test for TITAN2-2645
    shared.createBtn.click();

    media.typeFormDropdown.all(by.css('option')).get(1).click(); //Select Audio type
    media.audioSourceFormField.sendKeys('This is not a URL');

    // Error messages displayed
    expect(media.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(0).getText()).toBe('Audio source must be a URL');

    media.typeFormDropdown.all(by.css('option')).get(2).click(); //Select TTS type

    // Error messages are removed
    media.requiredError.then(function(items){
    	expect(items.length).toBe(0);
    });

    expect(media.sourceFormField.getAttribute('value')).toEqual('This is not a URL');
  });
});

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
    expect(media.creatingMediaHeader.getText()).toContain('Creating New Media');
    expect(media.sourceFormField.isDisplayed()).toBeTruthy();
    expect(media.typeFormDropdown.isDisplayed()).toBeTruthy();
    expect(media.typeFormDropdown.all(by.css('option')).get(1).getText()).toBe('Audio');
    expect(media.typeFormDropdown.all(by.css('option')).get(2).getText()).toBe('TTS');
  });

  it('should successfully create new Media with Audio type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    var mediaAdded = false;
    var newMediaName = 'Audio Media ' + randomMedia;
    shared.createBtn.click();

    // Edit required fields
    media.nameFormField.sendKeys(newMediaName);
    media.sourceFormField.sendKeys('http://www.example.com/' + randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(1).click();

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

  it('should successfully create new Media with Text-To-Speech type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    var mediaAdded = false;
    var newMediaName = 'Text-To-Speech ' + randomMedia;;
    shared.createBtn.click();

    // Edit fields
    media.nameFormField.sendKeys(newMediaName);
    media.sourceFormField.sendKeys('Text-To-Speech Media Source ' + randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(2).click();

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

  it('should include media page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    //expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeFalsy(); //Hide by default
    expect(shared.actionsBtn.isDisplayed()).toBeFalsy(); //Hide, since there are no bulk actions
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Media Management');
    //TODO: verify that checkboxes are hidden in table
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
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.typeFormDropdown.all(by.css('option')).get(1).click();
    media.sourceFormField.sendKeys(randomMedia);

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch name input field
    media.nameFormField.click();
    media.sourceFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(media.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(0).getText()).toBe('Field "Name" is required.');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should require type when creating a new Media', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.nameFormField.sendKeys(randomMedia);
    media.sourceFormField.sendKeys(randomMedia);

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch type input field
    media.typeFormDropdown.click();
    media.sourceFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(media.requiredError.get(1).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(1).getText()).toBe('Please enter a type');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should require Source when creating a new Media with Audio type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.nameFormField.sendKeys(randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(1).click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch URL input field
    media.sourceFormField.click();
    media.nameFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(media.requiredError.get(2).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(2).getText()).toBe('Please enter a source');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should verify Source when creating a new Media with Audio type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.nameFormField.sendKeys(randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(1).click();
    media.sourceFormField.sendKeys('This is not a valid audio source\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(media.requiredError.get(3).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(3).getText()).toBe('Source must be valid url');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should require Source when creating a new Media with Text-To-Speech type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.nameFormField.sendKeys(randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(2).click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch URL input field
    media.sourceFormField.click();
    media.nameFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(media.requiredError.get(2).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(2).getText()).toBe('Please enter a source');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should clear fields on Cancel', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.nameFormField.sendKeys('Media ' + randomMedia);
    media.sourceFormField.sendKeys('http://www.example.com/' + randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(1).click();
    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // New media is not created
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Form fields are cleared and reset to default
    expect(media.nameFormField.getAttribute('value')).toBe('');
    expect(media.sourceFormField.getAttribute('value')).toBe('');
    expect(media.typeFormDropdown.$('option:checked').getText()).toBe('');
  });

  it('should display media details when media is selected from table', function() {
    shared.tableElements.count().then(function(mediaCount) {
      if (mediaCount > 0) {
        // Select first media from table
        shared.firstTableRow.click();

        // Verify media details in table matches populated field
        expect(shared.detailsFormHeader.getText()).toContain(shared.firstTableRow.element(by.css(media.nameColumn)).getText());
        expect(shared.firstTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.sourceFormField.getAttribute('value'));
        expect(media.sourceFormField.getAttribute('value')).toBe(shared.firstTableRow.element(by.css(media.sourceColumn)).getText());
        media.typeFormDropdown.$('option:checked').getText().then(function (selectedType) {
          expect(selectedType.toLowerCase()).toBe(shared.firstTableRow.element(by.css(media.typeColumn)).getText());
        });

        // Change selected media and ensure details are updated
        if (mediaCount > 1) {
          shared.secondTableRow.click();
          expect(shared.detailsFormHeader.getText()).toContain(shared.secondTableRow.element(by.css(media.nameColumn)).getText());
          expect(shared.secondTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.sourceFormField.getAttribute('value'));
          expect(media.sourceFormField.getAttribute('value')).toBe(shared.secondTableRow.element(by.css(media.sourceColumn)).getText());
          media.typeFormDropdown.$('option:checked').getText().then(function (selectedType) {
            expect(selectedType.toLowerCase()).toBe(shared.secondTableRow.element(by.css(media.typeColumn)).getText());
          });
        };
      };
    });
  });

  it('should include valid Media fields when editing an existing Media', function() {
    shared.firstTableRow.click();
    expect(shared.detailsFormHeader.isDisplayed()).toBeTruthy();
    expect(media.nameFormField.isDisplayed()).toBeTruthy();
    expect(media.nameFormField.getAttribute('disabled')).toBeTruthy();
    expect(media.sourceFormField.isDisplayed()).toBeTruthy();
    expect(media.typeFormDropdown.getAttribute('disabled')).toBeTruthy();
  });

  it('should reset fields after editing media and selecting Cancel', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    shared.firstTableRow.click();

    var originalSource = media.sourceFormField.getAttribute('value');

    // Edit editable fields
    media.sourceFormField.sendKeys('Edit');

    shared.cancelFormBtn.click();
    shared.dismissChanges();

    expect(media.requiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(media.sourceFormField.getAttribute('value')).toBe(originalSource);
  });

  it('should not allow the Media Name and Type fields to be updated', function() {
    shared.firstTableRow.click();

    expect(media.nameFormField.getAttribute('disabled')).toBeTruthy();
    expect(media.typeFormDropdown.getAttribute('disabled')).toBeTruthy();

    expect(media.sourceFormField.getAttribute('disabled')).toBeFalsy();
  });

  it('should allow the Media Source field to be updated', function() {
    shared.firstTableRow.click();

    // Edit fields
    media.sourceFormField.sendKeys('Edit');

    var editedSource = media.sourceFormField.getAttribute('value');

    shared.submitFormBtn.click().then(function() {
      expect(media.requiredError.get(0).isDisplayed()).toBeFalsy();
      expect(media.requiredError.get(1).isDisplayed()).toBeFalsy();
      expect(media.requiredError.get(2).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.firstTableRow.click();
      expect(media.sourceFormField.getAttribute('value')).toBe(editedSource);
    });
  });

  it('should require source field when editing a Media', function() {
    // Select first media from table
    shared.firstTableRow.click();

    // Edit fields
    media.sourceFormField.clear();
    media.sourceFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(media.requiredError.get(2).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(2).getText()).toBe('Please enter a source');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  xit('should verify source field input when editing a Media with Audio type', function() {
    // TODO
    shared.searchField.sendKeys('Audio');
    shared.firstTableRow.click();

    // Edit fields
    media.sourceFormField.clear();
    media.sourceFormField.sendKeys('This is not a valid audio source\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(media.requiredError.get(3).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(3).getText()).toBe('Source must be valid url');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should allow text source field input when editing a Media with Text-To-Speech type', function() {
    shared.searchField.sendKeys('Text-To-Speech');
    shared.firstTableRow.click();

    // Edit fields
    media.sourceFormField.clear();
    media.sourceFormField.sendKeys('This is a valid Text-To-Speech source\t');

    // Submit button is not disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeFalsy();

    shared.submitFormBtn.click();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();
  });
});

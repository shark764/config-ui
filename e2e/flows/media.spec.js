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
    expect(media.typeFormDropdown.all(by.css('option')).get(2).getText()).toBe('Text-To-Speech');
    expect(media.audioUrlFormField.isDisplayed()).toBeFalsy();
    expect(media.textFormField.isDisplayed()).toBeFalsy();

    media.typeFormDropdown.all(by.css('option')).get(1).click(); // Select Audio
    expect(media.audioUrlFormField.isDisplayed()).toBeTruthy();
    expect(media.textFormField.isDisplayed()).toBeFalsy();

    media.typeFormDropdown.all(by.css('option')).get(1).click(); // Select Text-To-Speech
    expect(media.audioUrlFormField.isDisplayed()).toBeFalsy();
    expect(media.textFormField.isDisplayed()).toBeTruthy();
  });

  it('should successfully create new Media with Audio type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    var mediaAdded = false;
    var newMediaSource = 'Audio Media Source ' + randomMedia;
    shared.createBtn.click();

    // Edit fields
    media.sourceFormField.sendKeys(newMediaSource);
    media.typeFormDropdown.all(by.css('option')).get(1).click();

    expect(media.audioUrlFormField.isDisplayed()).toBeTruthy(); // URL field displayed
    expect(media.textFormField.isDisplayed()).toBeFalsy(); // Text field not displayed
    media.audioUrlFormField.sendKeys(randomMedia);

    shared.submitFormBtn.click()
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

  it('should successfully create new Media with Text-To-Speech type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    var mediaAdded = false;
    var newMediaSource = 'Text-To-Speech Media Source ' + randomMedia;
    shared.createBtn.click();

    // Edit fields
    media.sourceFormField.sendKeys(newMediaSource);
    media.typeFormDropdown.all(by.css('option')).get(2).click();

    expect(media.textFormField.isDisplayed()).toBeTruthy(); // Text field displayed
    expect(media.audioUrlFormField.isDisplayed()).toBeFalsy(); // URL field not displayed
    media.textFormField.sendKeys(randomMedia);

    shared.submitFormBtn.click()
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

  it('should include media page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Media');
  });

  it('should require field input when creating a new Media', function() {
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Submit without field input
    shared.submitFormBtn.click();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should require source when creating a new Media', function() {
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.typeFormDropdown.all(by.css('option')).get(1).click();
    media.audioUrlFormField.sendKeys(randomMedia);

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch source input field
    media.sourceFormField.click();
    media.audioUrlFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    expect(media.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(0).getText()).toBe('Please enter a source');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should require type when creating a new Media', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.sourceFormField.sendKeys('Media Source ' + randomMedia);

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch type input field
    media.typeFormDropdown.click();
    media.sourceFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    expect(media.requiredError.get(1).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(1).getText()).toBe('Please enter a type');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should require URL when creating a new Media with Audio type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.sourceFormField.sendKeys('Media Source ' + randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(1).click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch URL input field
    media.audioUrlFormField.click();
    media.sourceFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    expect(media.requiredError.get(2).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(2).getText()).toBe('URL is required');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should require Text when creating a new Media with Text-To-Speech type', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.sourceFormField.sendKeys('Media Source' + randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(2).click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // New Media is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(mediaCount);

    // Touch URL input field
    media.textFormField.click();
    media.sourceFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    expect(media.requiredError.get(3).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(3).getText()).toBe('Text-to-Speech text is required');

    // New Media is not saved
    expect(shared.tableElements.count()).toBe(mediaCount);
  });

  it('should clear fields on Cancel', function() {
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    mediaCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    media.sourceFormField.sendKeys('Media Source' + randomMedia);
    media.typeFormDropdown.all(by.css('option')).get(1).click();
    media.audioUrlFormField.sendKeys(randomMedia);
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
    expect(media.sourceFormField.getAttribute('value')).toBe('');
    expect(media.typeFormDropdown.getAttribute('value')).toBe('? undefined:undefined ?');
  });

  it('should display media details when Audio media is selected from table', function() {
    // TODO Update based on expected display value of Properties in table
    shared.searchField.sendKeys('Audio');
    // Select first media from table
    media.firstTableRow.click();

    // Verify media details in table matches populated field
    expect(media.sourceHeader.getText()).toContain(media.firstTableRow.element(by.css(media.sourceColumn)).getText());
    expect(media.firstTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.sourceFormField.getAttribute('value'));
    expect(media.firstTableRow.element(by.css(media.typeColumn)).getText()).toBe(media.typeFormDropdown.getAttribute('value'));
    expect(media.firstTableRow.element(by.css(media.propertiesColumn)).getText()).toContain(media.audioUrlFormField.getAttribute('value'));


    // Change selected media and ensure details are updated
    shared.tableElements.count().then(function(curMediaCount) {
      if (curMediaCount > 1) {
        media.secondTableRow.click();
        expect(media.sourceHeader.getText()).toContain(media.secondTableRow.element(by.css(media.sourceColumn)).getText());
        expect(media.secondTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.sourceFormField.getAttribute('value'));
        expect(media.secondTableRow.element(by.css(media.typeColumn)).getText()).toBe(media.typeFormDropdown.getAttribute('value'));
        expect(media.secondTableRow.element(by.css(media.propertiesColumn)).getText()).toContain(media.audioUrlFormField.getAttribute('value'));
      };
    });
  });

  it('should display media details when Text-To-Speech media is selected from table', function() {
    // TODO Update based on expected display value of Properties in table
    shared.searchField.sendKeys('Text-To-Speech');
    // Select first media from table
    media.firstTableRow.click();

    // Verify media details in table matches populated field
    expect(media.sourceHeader.getText()).toContain(media.firstTableRow.element(by.css(media.sourceColumn)).getText());
    expect(media.firstTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.sourceFormField.getAttribute('value'));
    expect(media.firstTableRow.element(by.css(media.typeColumn)).getText()).toBe(media.typeFormDropdown.getAttribute('value'));
    expect(media.firstTableRow.element(by.css(media.propertiesColumn)).getText()).toContain(media.textFormField.getAttribute('value'));

    // Change selected media and ensure details are updated
    shared.tableElements.count().then(function(curMediaCount) {
      if (curMediaCount > 1) {
        media.secondTableRow.click();
        expect(media.sourceHeader.getText()).toContain(media.secondTableRow.element(by.css(media.sourceColumn)).getText());
        expect(media.secondTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.sourceFormField.getAttribute('value'));
        expect(media.secondTableRow.element(by.css(media.typeColumn)).getText()).toBe(media.typeFormDropdown.getAttribute('value'));
        expect(media.secondTableRow.element(by.css(media.propertiesColumn)).getText()).toContain(media.textFormField.getAttribute('value'));
      };
    });
  });

  it('should include valid Media fields when editing an existing Media', function() {
    media.firstTableRow.click();
    expect(media.sourceHeader.isDisplayed()).toBeTruthy();
    expect(media.sourceFormField.isDisplayed()).toBeTruthy();
    expect(media.typeFormDropdown.getAttribute('disabled')).toBeTruthy();
    expect(media.audioUrlFormField.isDisplayed() || media.textFormField.isDisplayed()).toBeTruthy();
    expect(media.audioUrlFormField.isDisplayed() && media.textFormField.isDisplayed()).toBeFalsy();
  });

  it('should reset fields after editing Text-To-Speech media and selecting Cancel', function() {
    shared.searchField.sendKeys('Text-To-Speech');
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    media.firstTableRow.click();

    var originalSource = media.sourceFormField.getAttribute('value');
    var originalText = media.textFormField.getAttribute('value');

    // Edit fields
    media.sourceFormField.sendKeys('Edit');
    media.textFormField.sendKeys('Edit');

    shared.cancelFormBtn.click();

    expect(media.requiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(media.sourceFormField.getAttribute('value')).toBe(originalSource);
    expect(media.textFormField.getAttribute('value')).toBe(originalText);
  });

  it('should reset fields after editing Audio media and selecting Cancel', function() {
    shared.searchField.sendKeys('Audio');
    randomMedia = Math.floor((Math.random() * 1000) + 1);
    media.firstTableRow.click();

    var originalSource = media.sourceFormField.getAttribute('value');
    var originalAudioUrl = media.audioUrlFormField.getAttribute('value');

    // Edit fields
    media.sourceFormField.sendKeys('Edit');
    media.audioUrlFormField.sendKeys('Edit');

    shared.cancelFormBtn.click();

    expect(media.requiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(media.sourceFormField.getAttribute('value')).toBe(originalSource);
    expect(media.audioUrlFormField.getAttribute('value')).toBe(originalAudioUrl);
  });

  it('should allow the Audio Media fields to be updated except Type', function() {
    shared.searchField.sendKeys('Audio');
    media.firstTableRow.click();

    // Edit fields
    media.sourceFormField.sendKeys('Edit');
    media.audioUrlFormField.sendKeys('Edit');

    var editedSource = media.sourceFormField.getAttribute('value');
    var editedAudio = media.audioUrlFormField.getAttribute('value');

    shared.submitFormBtn.click().then(function() {
      expect(media.requiredError.get(0).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.searchField.sendKeys('Text-To-Speech');
      media.firstTableRow.click();
      expect(media.sourceFormField.getAttribute('value')).toBe(editedSource);
      expect(media.audioUrlFormField.getAttribute('value')).toBe(editedAudio);
    });
  });

  it('should allow the Text-To-Speech Media fields to be updated except Type', function() {
    shared.searchField.sendKeys('Text-To-Speech');
    media.firstTableRow.click();

    // Edit fields
    media.sourceFormField.sendKeys('Edit');
    media.textFormField.sendKeys('Edit');

    var editedSource = media.sourceFormField.getAttribute('value');
    var editedText = media.textFormField.getAttribute('value');

    shared.submitFormBtn.click().then(function() {
      expect(media.requiredError.get(0).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      shared.searchField.sendKeys('Text-To-Speech');
      media.firstTableRow.click();
      expect(media.sourceFormField.getAttribute('value')).toBe(editedSource);
      expect(media.textFormField.getAttribute('value')).toBe(editedText);
    });
  });

  it('should require source field when editing a Media', function() {
    // Select first media from table
    media.firstTableRow.click();

    // Edit fields
    media.sourceFormField.clear();
    media.sourceFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    expect(media.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(media.requiredError.get(0).getText()).toBe('Please enter a source');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});

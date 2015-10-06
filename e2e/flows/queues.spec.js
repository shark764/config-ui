'use strict';

describe('The queues view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    queues = require('./queues.po.js'),
    params = browser.params,
    queueCount,
    queueVersionCount,
    randomQueue;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.queuesPageUrl);
    queueCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include queue management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
    expect(queues.newQueueVersionPanel.isDisplayed()).toBeFalsy();
    expect(queues.nameFormField.isDisplayed()).toBeFalsy();
    expect(queues.descriptionFormField.isDisplayed()).toBeFalsy();
    expect(shared.submitFormBtn.isDisplayed()).toBeFalsy();
  });

  it('should display queue details when selected from table', function() {
    queues.firstTableRow.click();

    // Verify queue name in table matches populated field
    expect(queues.firstTableRow.getText()).toContain(queues.nameFormField.getAttribute('value'));
    expect(queues.firstTableRow.getText()).toContain(queues.descriptionFormField.getAttribute('value'));
    expect(queues.firstTableRow.getText()).toContain(queues.activeVersionDropdown.$('option:checked').getText());

    shared.tableElements.count().then(function(numQueues) {
      if (numQueues > 1) {
        queues.secondTableRow.click();
        expect(queues.secondTableRow.getText()).toContain(queues.nameFormField.getAttribute('value'));
        expect(queues.secondTableRow.getText()).toContain(queues.descriptionFormField.getAttribute('value'));
        expect(queues.secondTableRow.getText()).toContain(queues.activeVersionDropdown.$('option:checked').getText());
      }
    });
  });

  it('should require name field when editing a Queue', function() {
    queues.firstTableRow.click();

    // Edit fields
    queues.nameFormField.clear();
    queues.nameFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    shared.submitFormBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // TODO TITAN2-4097
    //expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    //expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');
  });

  it('should not require description field when editing a Queue', function() {
    queues.firstTableRow.click();

    // Edit fields
    queues.descriptionFormField.sendKeys('not required');
    queues.descriptionFormField.clear();
    queues.descriptionFormField.sendKeys('\t');

    // Submit button is enabled
    expect(shared.submitFormBtn.isEnabled()).toBeTruthy();

    shared.submitFormBtn.click();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();
  });

  it('should not allow the Queue Version fields to be updated', function() {
    queues.firstTableRow.click();

    expect(queues.advancedQueryFormField.isEnabled()).toBeFalsy();

    expect(queues.minPriorityInputField.isEnabled()).toBeFalsy();
    expect(queues.maxPriorityInputField.isEnabled()).toBeFalsy();
    expect(queues.priorityValueInputField.isEnabled()).toBeFalsy();
    expect(queues.priorityRateInputField.isEnabled()).toBeFalsy();
    expect(queues.priorityRateUnitInputField.isEnabled()).toBeFalsy();
  });

  it('should not accept spaces only as valid field input', function() {
    queueCount = shared.tableElements.count();
    queues.firstTableRow.click();

    queues.nameFormField.clear();
    queues.nameFormField.sendKeys(' ');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // TODO TITAN2-4097
    //expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    //expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should reset fields after editing and selecting Cancel', function() {
    queues.firstTableRow.click();

    queues.activeVersionDropdown.all(by.css('option')).count().then(function(curQueueVersionCount) {
      randomQueue = Math.floor((Math.random() * 1000) + 1);

      var originalName = queues.nameFormField.getAttribute('value');
      var originalDescription = queues.descriptionFormField.getAttribute('value');
      var originalActiveVersion = queues.activeVersionDropdown.$('option:checked');

      // Edit fields
      queues.nameFormField.sendKeys('Edit');
      queues.descriptionFormField.sendKeys('Edit');
      queues.activeVersionDropdown.all(by.css('option')).get(randomQueue % curQueueVersionCount).click();

      shared.cancelFormBtn.click();

      // Warning message is displayed
      shared.waitForAlert();
      shared.dismissChanges();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(queues.nameFormField.getAttribute('value')).toBe(originalName);
      expect(queues.descriptionFormField.getAttribute('value')).toBe(originalDescription);
      expect(queues.activeVersionDropdown.$('option:checked')).toBe(originalActiveVersion);
    });
  });

  it('should display all queue versions in Active Version dropdown', function() {
    queues.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).then(function(dropdownVersions) {
      for (var i = 0; i < dropdownVersions.length; ++i) {
        expect(queues.versionsTable.element(by.id('version-row-v' + (i + 1))).getText()).toContain(queues.activeVersionDropdown.all(by.css('option')).get(i).getText());
      }
    });
  });

  it('should show active version details', function() {
    queues.firstTableRow.click();
    queues.activeVersionDropdown.$('option:checked').then(function(activeVersionNumber) {
      console.log('active version number: ' + activeVersionNumber);
      // Active version details are displayed by default
      var activeVersionRow = element(by.id("version-row-v" + activeVersionNumber));
      var activeVersionDetails = element(by.id("view-version-v" + activeVersionNumber));
      expect(activeVersionDetails.isDisplayed()).toBeTruthy();

      // Row shows that the version is selected and expanded
      expect(activeVersionRow.element(by.css('.fa .fa-circle')).isDisplayed()).toBeTruthy();
      expect(activeVersionRow.element(by.css('.fa .fa-caret-up')).isDisplayed()).toBeTruthy();
      expect(activeVersionRow.element(by.css('.fa .fa-caret-down')).isPresent()).toBeFalsy();

      expect(queues.advancedQueryFormField.isEnabled()).toBeFalsy();
      expect(queues.minPriorityInputField.isEnabled()).toBeFalsy();
      expect(queues.maxPriorityInputField.isEnabled()).toBeFalsy();
      expect(queues.priorityValueInputField.isEnabled()).toBeFalsy();
      expect(queues.priorityRateInputField.isEnabled()).toBeFalsy();
      expect(queues.priorityRateUnitInputField.isEnabled()).toBeFalsy();

      expect(queues.advancedQueryFormField.getAttribute('value')).not.toBeNull();
      expect(queues.minPriorityInputField.getAttribute('value')).not.toBeNull();
      expect(queues.maxPriorityInputField.getAttribute('value')).not.toBeNull();
      expect(queues.priorityValueInputField.getAttribute('value')).not.toBeNull();
      expect(queues.priorityRateInputField.getAttribute('value')).not.toBeNull();
      expect(queues.priorityRateUnitInputField.getAttribute('value')).not.toBeNull();

      // If the advanced query is not the default value, expect the basic query details to be displayed
      queues.advancedQueryFormField.getAttribute('value').then(function(advancedQuery) {
        if (advancedQuery == '{}') {
          expect(basicQueryDetailsAll.count()).toBe(0);
        } else {
          expect(basicQueryDetailsAll.count()).toBeGreaterThan(0);
        }
      });

      expect(queues.copyVersionBtn.isDisplayed()).toBeTruthy();
      expect(queues.copyVersionBtn.isEnabled()).toBeTruthy();
    });
  });

  it('should toggle showing version details when selected', function() {
    queues.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).count().then(function(versionCount) {
      var currentVersion;

      // Select each version, details are displayed
      for (var i = 0; i < versionCount; i++) {
        currentVersion = element(by.id("version-row-v" + i));

        // Open version details
        currentVersion.click();
        expect(element(by.id("view-version-v" + i)).isDisplayed()).toBeTruthy();
        expect(currentVersion.element(by.css('.fa .fa-caret-up')).isDisplayed()).toBeTruthy();
        expect(currentVersion.element(by.css('.fa .fa-caret-down')).isPresent()).toBeFalsy();

        // Close version details
        currentVersion.click();
        expect(element(by.id("view-version-v" + i)).isDisplayed()).toBeTruthy();
        expect(currentVersion.element(by.css('.fa .fa-caret-up')).isDisplayed()).toBeTruthy();
        expect(currentVersion.element(by.css('.fa .fa-caret-down')).isPresent()).toBeFalsy();
      }
    });
  });

  it('should toggle showing one version details at a time when selected', function() {
    queues.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).count().then(function(versionCount) {
      var currentVersion;

      // Only one version is displayed at a time
      // Select first version
      element(by.id("version-row-v1")).click();
      for (var i = 1; i < versionCount; i++) {
        currentVersion = element(by.id("version-row-v" + i));

        // Open version details
        currentVersion.click();
        expect(element(by.id("view-version-v" + i)).isDisplayed()).toBeTruthy();
        expect(currentVersion.element(by.css('.fa .fa-caret-up')).isDisplayed()).toBeTruthy();
        expect(currentVersion.element(by.css('.fa .fa-caret-down')).isPresent()).toBeFalsy();

        // Previous version is closed
        currentVersion.click();
        expect(element(by.id("view-version-v" + i - 1)).isDisplayed()).toBeTruthy();
        expect(element(by.id("version-row-v" + i - 1)).element(by.css('.fa .fa-caret-down')).isDisplayed()).toBeTruthy();
        expect(element(by.id("version-row-v" + i - 1)).element(by.css('.fa .fa-caret-up')).isPresent()).toBeFalsy();
      }
    });
  });

  xit('should display copy version panel when copy is selected', function() {
    queues.firstTableRow.click();
    queues.copyVersionBtn.click();

    expect(queues.newQueueVersionPanel.isDisplayed()).toBeTruthy();
    expect(queues.createVersionHeader.isDisplayed()).toBeTruthy();
    expect(queues.createVersionBtn.isDisplayed()).toBeTruthy();
    expect(queues.cancelVersionBtn.isDisplayed()).toBeTruthy();

    // All values are copied from selected version
    // TODO
    // ensure basic query details match
    // ensure advanced query matches
    // ensure priority details match

  });

  it('should increment versoin number when creating', function() {
    queues.firstTableRow.click();
    queues.copyVersionBtn.click();

    queues.activeVersionDropdown.all(by.css('option')).count().then(function(versionCount) {
      expect(queues.createVersionHeader.getText()).toBe('Creating New Queue version: v' + versionCount + 1);
    });
  });

  xit('should add new queue version', function() {
    queues.firstTableRow.click();
    queues.copyVersionBtn.click();

    queues.activeVersionDropdown.all(by.css('option')).count().then(function(originalVersionCount) {
      // TODO



      queues.createVersionBtn.click().then(function() {
        expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBeGreaterThan(originalVersionCount);
        expect(queues.activeVersionDropdown.all(by.css('option')).get(originalVersionCount).getText()).toBe('v' + originalVersionCount + 1);
        expect(queues.queueVersion.get(0).getText()).toContain('v' + originalVersionCount + 1);
      });
    });
  });

  it('should require advanced query when adding a new queue version', function() {
    queues.firstTableRow.click();
    queues.copyVersionBtn.click();

    queue.showAdvancedQueryLink.click();
    queue.advancedQueryFormField.clear();
    expect(queues.createVersionBtn.isEnabled()).toBeFalsy();

    queues.createVersionBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).GetText()).toBe('Field "Query" is required.');
  });

  it('should not require basic query details when adding a new queue version', function() {
    queues.firstTableRow.click();
    queues.copyVersionBtn.click();

    // Remove all query details
    queues.basicQueryDetailsAll.each(function(basicQueryDetail) {
      basicQueryDetail.element(by.css('a')).click();
    }).then(function() {
      queues.createVersionBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
        expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBeGreaterThan(originalVersionCount);
        expect(queues.activeVersionDropdown.all(by.css('option')).get(originalVersionCount).getText()).toBe('v' + originalVersionCount + 1);
        expect(queues.queueVersion.get(0).getText()).toContain('v' + originalVersionCount + 1);
      });
    });
  });
});

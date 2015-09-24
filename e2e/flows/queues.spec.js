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
    expect(queues.nameFormField.isDisplayed()).toBeFalsy();
    expect(queues.descriptionFormField.isDisplayed()).toBeFalsy();
    expect(shared.submitFormBtn.isDisplayed()).toBeFalsy();
  });

  it('should display queue details when selected from table', function() {
    queues.firstTableRow.click();

    // Verify queue name in table matches populated field
    expect(queues.firstTableRow.getText()).toContain(queues.nameFormField.getAttribute('value'));

    shared.tableElements.count().then(function(numQueues) {
      if (numQueues > 1) {
        queues.secondTableRow.click();
        expect(queues.secondTableRow.getText()).toContain(queues.nameFormField.getAttribute('value'));
      }
    });
  });

  it('should require name field when editing a Queue', function() {
    queues.firstTableRow.click();

    // Edit fields
    queues.nameFormField.clear();
    queues.descriptionFormField.clear();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    expect(shared.tableElements.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');
  });

  it('should allow the Queue fields to be updated', function() {
    queues.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).count().then(function(curQueueVersionCount) {
      randomQueue = Math.floor((Math.random() * 1000) + 1);

      // Edit fields
      queues.nameFormField.sendKeys('Edit');
      queues.descriptionFormField.sendKeys('Edit');
      var versionSelected = randomQueue % curQueueVersionCount;
      queues.activeVersionDropdown.all(by.css('option')).get(versionSelected).click();

      var editedName = queues.nameFormField.getAttribute('value');
      var editedDescription = queues.descriptionFormField.getAttribute('value');
      var editedActiveVersion = queues.activeVersionDropdown.getAttribute('value');
      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Changes persist
        browser.refresh();
        expect(queues.nameFormField.getAttribute('value')).toBe(editedName);
        expect(queues.descriptionFormField.getAttribute('value')).toBe(editedDescription);
        expect(queues.activeVersionDropdown.getAttribute('value')).toBe(editedActiveVersion);
      });
    });
  });

  it('should not require description field when editing a queue', function() {
    queues.firstTableRow.click();
    // Edit fields
    queues.descriptionFormField.sendKeys('Temp Description');
    queues.descriptionFormField.clear();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  it('should not accept spaces only as valid field input', function() {
    queueCount = shared.tableElements.count();
    queues.firstTableRow.click();

    queues.nameFormField.clear();
    queues.nameFormField.sendKeys(' ');
    queues.descriptionFormField.clear();
    queues.descriptionFormField.sendKeys(' ');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');
    expect(shared.tableElements.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should reset fields after editing and selecting Cancel', function() {
    queues.firstTableRow.click();

    queues.activeVersionDropdown.all(by.css('option')).count().then(function(curQueueVersionCount) {
      randomQueue = Math.floor((Math.random() * 1000) + 1);

      var originalName = queues.nameFormField.getAttribute('value');
      var originalDescription = queues.descriptionFormField.getAttribute('value');
      var originalActiveVersion = queues.activeVersionDropdown.getAttribute('value');

      // Edit fields
      queues.nameFormField.sendKeys('Edit');
      queues.descriptionFormField.sendKeys('Edit');
      var versionSelected = randomQueue % curQueueVersionCount;
      queues.activeVersionDropdown.all(by.css('option')).get(versionSelected).click();

      shared.cancelFormBtn.click();

      // Warning message is displayed
      var alertDialog = browser.switchTo().alert();
      expect(alertDialog.accept).toBeDefined();
      expect(alertDialog.dismiss).toBeDefined();
      alertDialog.accept();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(queues.nameFormField.getAttribute('value')).toBe(originalName);
      expect(queues.descriptionFormField.getAttribute('value')).toBe(originalDescription);
      expect(queues.activeVersionDropdown.getAttribute('value')).toBe(originalActiveVersion);
    });
  });

  it('should display all queue versions in Active Version dropdown', function() {
    queues.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).then(function(dropdownVersions) {
      for (var i = 1; i < dropdownVersions.length; ++i) {
        expect(queues.versionsTable.element(by.id('version-row-v' + (dropdownVersions.length - i))).getText()).toContain(queues.activeVersionDropdown.all(by.css('option')).get(i).getText());
      };
    });
  });

  it('should toggle showing version details with defaults and disabled fields', function() {
    queues.firstTableRow.click();
    queues.versionRowV1Plus.click();

    // Plus button changes to minus to close
    expect(queues.versionRowV1Plus.isPresent()).toBeFalsy();
    expect(queues.versionRowV1Minus.isDisplayed()).toBeTruthy();

    // Version details show values and defaults
    expect(queues.selectedVersionQuery.getAttribute('value')).not.toBeNull();
    expect(queues.selectedVersionMinPriority.getAttribute('value')).toBe('1');
    expect(queues.selectedVersionMaxPriority.getAttribute('value')).toBe('1000');
    expect(queues.selectedVersionRate.getAttribute('value')).toBe('10');
    expect(queues.selectedVersionRateUnit.getAttribute('value')).toBe('seconds');

    // Version details should be disabled
    expect(queues.selectedVersionQuery.getAttribute('disabled')).toBeTruthy();
    expect(queues.selectedVersionMinPriority.getAttribute('disabled')).toBeTruthy();
    expect(queues.selectedVersionMaxPriority.getAttribute('disabled')).toBeTruthy();
    expect(queues.selectedVersionRate.getAttribute('disabled')).toBeTruthy();
    expect(queues.selectedVersionRateUnit.getAttribute('disabled')).toBeTruthy();

    // Close and copy buttons displayed
    expect(queues.closeVersionBtn.isDisplayed()).toBeTruthy();
    expect(queues.copyVersionBtn.isDisplayed()).toBeTruthy();

    queues.versionRowV1Minus.click().then(function() {
      // Minus button changes to plus to open
      expect(queues.versionRowV1Minus.isPresent()).toBeFalsy();
      expect(queues.versionRowV1Plus.isDisplayed()).toBeTruthy();

      // Version details show values and defaults
      expect(queues.selectedVersionQuery.isDisplayed()).toBeFalsy();
      expect(queues.selectedVersionMinPriority.isDisplayed()).toBeFalsy();
      expect(queues.selectedVersionMaxPriority.isDisplayed()).toBeFalsy();
      expect(queues.selectedVersionRate.isDisplayed()).toBeFalsy();
      expect(queues.selectedVersionRateUnit.isDisplayed()).toBeFalsy();

      // Close and copy buttons are not displayed
      expect(queues.closeVersionBtn.isDisplayed()).toBeFalsy();
      expect(queues.copyVersionBtn.isDisplayed()).toBeFalsy();
    });
  });

  it('should close selected version details after selected close button', function() {
    queues.firstTableRow.click();
    queues.versionRowV1Plus.click();

    // Plus button changes to minus to close
    expect(queues.versionRowV1Plus.isPresent()).toBeFalsy();
    expect(queues.versionRowV1Minus.isDisplayed()).toBeTruthy();

    // Version details displayed
    expect(queues.selectedVersionQuery.isDisplayed()).toBeTruthy();
    expect(queues.selectedVersionMinPriority.isDisplayed()).toBeTruthy();
    expect(queues.selectedVersionMaxPriority.isDisplayed()).toBeTruthy();
    expect(queues.selectedVersionRate.isDisplayed()).toBeTruthy();
    expect(queues.selectedVersionRateUnit.isDisplayed()).toBeTruthy();

    // Close and copy buttons displayed
    expect(queues.closeVersionBtn.isDisplayed()).toBeTruthy();
    expect(queues.copyVersionBtn.isDisplayed()).toBeTruthy();

    queues.closeVersionBtn.click().then(function() {
      // Minus button changes to plus to open
      expect(queues.versionRowV1Minus.isPresent()).toBeFalsy();
      expect(queues.versionRowV1Plus.isDisplayed()).toBeTruthy();

      // Version details show values and defaults
      expect(queues.selectedVersionQuery.isDisplayed()).toBeFalsy();
      expect(queues.selectedVersionMinPriority.isDisplayed()).toBeFalsy();
      expect(queues.selectedVersionMaxPriority.isDisplayed()).toBeFalsy();
      expect(queues.selectedVersionRate.isDisplayed()).toBeFalsy();
      expect(queues.selectedVersionRateUnit.isDisplayed()).toBeFalsy();

      // Close and copy buttons are not displayed
      expect(queues.closeVersionBtn.isDisplayed()).toBeFalsy();
      expect(queues.copyVersionBtn.isDisplayed()).toBeFalsy();
    });
  });

  it('should copy version details when copy is selected', function() {
    queues.firstTableRow.click();

    queues.activeVersionDropdown.all(by.css('option')).count().then(function(dropdownVersions) {
      queues.versionRowV1Plus.click();
      queues.copyVersionBtn.click().then(function() {
        // Version details section closes
        expect(queues.versionRowV1Minus.isPresent()).toBeFalsy();
        expect(queues.versionRowV1Plus.isDisplayed()).toBeTruthy();
        expect(queues.selectedVersionQuery.isDisplayed()).toBeFalsy();
        expect(queues.selectedVersionMinPriority.isDisplayed()).toBeFalsy();
        expect(queues.selectedVersionMaxPriority.isDisplayed()).toBeFalsy();
        expect(queues.selectedVersionRate.isDisplayed()).toBeFalsy();
        expect(queues.selectedVersionRateUnit.isDisplayed()).toBeFalsy();
        expect(queues.closeVersionBtn.isDisplayed()).toBeFalsy();
        expect(queues.copyVersionBtn.isDisplayed()).toBeFalsy();

        // New version number should be 1 more than the current number of versions
        expect(queues.copyVersionNumberFormField.getAttribute('value')).toContain(dropdownVersions + 1);
        expect(queues.copyVersionNumberFormField.getAttribute('disabled')).toBeTruthy();

        // New version query field should be populated with copied query value
        queues.versionRowV1Plus.click();
        expect(queues.copyVersionQueryFormField.getAttribute('value')).toBe(queues.selectedVersionQuery.getAttribute('value'));

        // Copy create fields are displayed with copied values and defaults
        expect(queues.copyVersionMinPriorityFormField.getAttribute('value')).toBe('1');
        expect(queues.copyVersionMaxPriorityFormField.getAttribute('value')).toBe('1000');
        expect(queues.copyVersionRateFormField.getAttribute('value')).toBe('10');
        expect(queues.copyVersionRateUnitDropdown.getAttribute('value')).toBe('seconds');

        // Version defaults should be disabled
        expect(queues.copyVersionMinPriorityFormField.getAttribute('disabled')).toBeTruthy();
        expect(queues.copyVersionMaxPriorityFormField.getAttribute('disabled')).toBeTruthy();
        expect(queues.copyVersionRateFormField.getAttribute('disabled')).toBeTruthy();
        expect(queues.copyVersionRateUnitDropdown.getAttribute('disabled')).toBeTruthy();
      });
    });
  });

  it('should add new queue version', function() {
    queues.firstTableRow.click();

    queueVersionCount = queues.activeVersionDropdown.all(by.css('option')).count();
    randomQueue = Math.floor((Math.random() * 1000) + 1);
    queues.firstTableRow.click();
    queues.versionRowV1Plus.click();
    queues.copyVersionBtn.click();

    queues.copyVersionQueryFormField.sendKeys('{}');

    queues.createVersionBtn.click().then(function() {
      expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBeGreaterThan(queueVersionCount);
      queues.activeVersionDropdown.all(by.css('option')).then(function(dropdownVersions) {
        for (var i = 1; i < dropdownVersions.length; ++i) {
          expect(queues.versionsTable.element(by.id('version-row-v' + (dropdownVersions.length - i))).getText()).toContain(queues.activeVersionDropdown.all(by.css('option')).get(i).getText());
        };
      });
    });
  });

  it('should require query when adding a new queue version', function() {
    queues.firstTableRow.click();

    queueVersionCount = queues.activeVersionDropdown.all(by.css('option')).count();
    randomQueue = Math.floor((Math.random() * 1000) + 1);
    queues.firstTableRow.click();
    queues.versionRowV1Plus.click();
    queues.copyVersionBtn.click();

    queues.copyVersionQueryFormField.clear();
    queues.copyVersionQueryFormField.sendKeys('\t');

    queues.createVersionBtn.click();
    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Query\" is required.');

    expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBe(queueVersionCount);
  });

  it('should not accept spaces only as valid field input when creating queue version', function() {
    queues.firstTableRow.click();

    queueVersionCount = queues.activeVersionDropdown.all(by.css('option')).count();
    queues.firstTableRow.click();
    queues.versionRowV1Plus.click();
    queues.copyVersionBtn.click();

    queues.copyVersionQueryFormField.clear();
    queues.copyVersionQueryFormField.sendKeys(' \t');

    queues.createVersionBtn.click();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Query\" is required.');

    expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBe(queueVersionCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});

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
    browser.get(shared.queuesPageUrl);
    queueCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  xit('should include queue management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(queues.nameFormField.isDisplayed()).toBeTruthy();
    expect(queues.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(queues.activeFormToggle.isDisplayed()).toBeTruthy();
    expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();
  });

  xit('should display queue details when selected from table', function() {
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

  xit('should require name field when editing a Queue', function() {
    queues.firstTableRow.click();

    // Edit fields
    queues.nameFormField.clear();
    queues.descriptionFormField.clear();
    shared.submitFormBtn.click();

    expect(shared.tableElements.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');
  });

  xit('should allow the Queue fields to be updated', function() {
    queues.activeVersionDropdown.all(by.css('option')).count().then(function(curQueueVersionCount) {
      randomQueue = Math.floor((Math.random() * 1000) + 1);
      queues.firstTableRow.click();

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

  xit('should not require description field when editing a queue', function() {
    queues.firstTableRow.click();
    // Edit fields
    queues.descriptionFormField.clear();
    queues.nameFormField.click();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  xit('should not accept spaces only as valid field input', function() {
    queueCount = shared.tableElements.count();
    queues.firstTableRow.click();

    queues.nameFormField.clear();
    queues.nameFormField.sendKeys(' ');
    queues.descriptionFormField.clear();
    queues.descriptionFormField.sendKeys(' ');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');
    expect(shared.tableElements.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  xit('should reset fields after editing and selecting Cancel', function() {
    queues.activeVersionDropdown.all(by.css('option')).count().then(function(curQueueVersionCount) {
      randomQueue = Math.floor((Math.random() * 1000) + 1);
      queues.firstTableRow.click();

      var originalName = queues.nameFormField.getAttribute('value');
      var originalDescription = queues.descriptionFormField.getAttribute('value');
      var originalActiveVersion = queues.activeVersionDropdown.getAttribute('value');

      // Edit fields
      queues.nameFormField.sendKeys('Edit');
      queues.descriptionFormField.sendKeys('Edit');
      var versionSelected = randomQueue % curQueueVersionCount;
      queues.activeVersionDropdown.all(by.css('option')).get(versionSelected).click();

      shared.cancelFormBtn.click();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(queues.nameFormField.getAttribute('value')).toBe(originalName);
      expect(queues.descriptionFormField.getAttribute('value')).toBe(originalDescription);
      expect(queues.activeVersionDropdown.getAttribute('value')).toBe(originalActiveVersion);
    });
  });

  xit('should display all queue versions in Active Version dropdown', function() {
    queues.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).then(function(dropdownVersions) {
      for (var i = 1; i < dropdownVersions.length; ++i) {
        expect(queues.versionsTable.element(by.id('version-row-v' + (dropdownVersions.length - i))).getText()).toContain(queues.activeVersionDropdown.all(by.css('option')).get(i).getText());
      };
    });
  });

  xit('should add new queue version', function() {
    queueVersionCount = queues.activeVersionDropdown.all(by.css('option')).count();
    randomQueue = Math.floor((Math.random() * 1000) + 1);
    queues.firstTableRow.click();
    queues.versionRowV1Plus.click();
    queues.copyVersionBtn.click();

    queues.copyVersionQueryFormField.sendKeys('Query for queue version ' + randomQueue);

    queues.createVersionBtn.click().then(function() {
      expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBeGreaterThan(queueVersionCount);
      queues.activeVersionDropdown.all(by.css('option')).then(function(dropdownVersions) {
        for (var i = 1; i < dropdownVersions.length; ++i) {
          expect(queues.versionsTable.element(by.id('version-row-v' + (dropdownVersions.length - i))).getText()).toContain(queues.activeVersionDropdown.all(by.css('option')).get(i).getText());
        };
      });
    });
  });

  xit('should require query when adding a new queue version', function() {
    queueVersionCount = queues.activeVersionDropdown.all(by.css('option')).count();
    randomQueue = Math.floor((Math.random() * 1000) + 1);
    queues.firstTableRow.click();
    queues.versionRowV1Plus.click();
    queues.copyVersionBtn.click();

    queues.copyVersionQueryFormField.clear();

    queues.createVersionBtn.click();
    expect(queues.requiredErrors.get(2).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(2).getText()).toBe('Field \"Query\" is required.');

    expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBe(queueVersionCount);
  });

  xit('should not accept spaces only as valid field input when creating queue version', function() {
    queueVersionCount = queues.activeVersionDropdown.all(by.css('option')).count();
    queues.firstTableRow.click();
    queues.versionRowV1Plus.click();
    queues.copyVersionBtn.click();

    queues.copyVersionQueryFormField.clear();
    queues.copyVersionQueryFormField.sendKeys(' ');

    queues.createVersionBtn.click();

    expect(queues.requiredErrors.get(2).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(2).getText()).toBe('Field \"Query\" is required.');

    expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBe(queueVersionCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});

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

  it('should include queue management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(queues.nameFormField.isDisplayed()).toBeTruthy();
    expect(queues.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(queues.activeFormToggle.isDisplayed()).toBeTruthy();
    expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should display queue details when selected from table', function() {
    queues.firstTableRow.click();

    // Verify queue name in table matches populated field
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)')).getText()).toContain(queues.nameFormField.getAttribute('value'));

    shared.tableElements.count().then(function(numQueues) {
      if (numQueues > 1) {
        queues.secondTableRow.click();
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2) > a:nth-child(1)')).getText()).toContain(queues.nameFormField.getAttribute('value'));
      }
    });
  });

  it('should require name field when editing a Queue', function() {
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

  it('should allow the Queue fields to be updated', function() {
    queueVersionCount = queues.versionsTableElements.count().then(function(curQueueVersionCount) {
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

  it('should not require description field when editing a queue', function() {
    queues.firstTableRow.click();
    // Edit fields
    queues.descriptionFormField.clear();
    queues.nameFormField.click();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  it('should require name when adding a new queue version', function() {
    queueVersionCount = queues.versionsTableElements.count();
    randomQueue = Math.floor((Math.random() * 1000) + 1);
    queues.firstTableRow.click();

    queues.versionNameFormField.click();
    queues.versionDescriptionFormField.sendKeys('Description for queue version ' + randomQueue);
    queues.versionQueryFormField.sendKeys('Query for queue version ' + randomQueue);
    expect(queues.createVersionBtn.getAttribute('disabled')).toBeTruthy();

    queues.createVersionBtn.click();
    expect(queues.requiredErrors.get(2).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(2).getText()).toBe('Field \"Name\" is required.');

    expect(queues.versionsTableElements.count()).toBe(queueVersionCount);
  });

  it('should not require description when adding a new queue version', function() {
    queueVersionCount = queues.versionsTableElements.count();
    randomQueue = Math.floor((Math.random() * 1000) + 1);
    queues.firstTableRow.click();

    queues.versionDescriptionFormField.click();
    queues.versionNameFormField.sendKeys('Queue Version ' + randomQueue);

    queues.createVersionBtn.click().then(function() {
      expect(queues.versionNameFormField.getAttribute('value')).toBe('');
      expect(queues.versionsTableElements.count()).toBeGreaterThan(queueVersionCount);
    });
  });

  it('should require query when adding a new queue version', function() {
    queueVersionCount = queues.versionsTableElements.count();
    randomQueue = Math.floor((Math.random() * 1000) + 1);
    queues.firstTableRow.click();

    queues.versionQueryFormField.click();
    queues.versionNameFormField.sendKeys('Queue Version ' + randomQueue);
    queues.versionDescriptionFormField.sendKeys('Description for queue version ' + randomQueue);
    expect(queues.createVersionBtn.getAttribute('disabled')).toBeTruthy();

    queues.createVersionBtn.click();
    expect(queues.requiredErrors.get(3).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(3).getText()).toBe('Field \"Query\" is required.');

    expect(queues.versionsTableElements.count()).toBe(queueVersionCount);
  });

  it('should reset fields after editing and selecting Cancel', function() {
    queueVersionCount = queues.versionsTableElements.count().then(function(curQueueVersionCount) {
      randomQueue = Math.floor((Math.random() * 1000) + 1);
      queues.firstTableRow.click();

      var originalName = queues.nameFormField.getAttribute('value');
      var originalDescription = queues.descriptionFormField.getAttribute('value');
      var originalActiveVersion = queues.activeVersionDropdown.getAttribute('value');
      var originalType = queues.typeFormDropdown.getAttribute('value');

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
      expect(queues.typeFormDropdown.getAttribute('value')).toBe(originalType);
    });
  });

  it('should display all queue versions in Active Version dropdown', function() {
    queues.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).then(function(dropdownVersions) {
      for (var i = 1; i < dropdownVersions.length; ++i) {
        expect(queues.versionsTableElements.get(i - 1).getText()).toContain(queues.activeVersionDropdown.all(by.css('option')).get(i).getText());
      };
    });
  });

  it('should add new queue version', function() {
    queueVersionCount = queues.versionsTableElements.count();
    randomQueue = Math.floor((Math.random() * 1000) + 1);
    queues.firstTableRow.click();

    queues.versionNameFormField.sendKeys('Queue Version ' + randomQueue);
    queues.versionDescriptionFormField.sendKeys('Description for queue version ' + randomQueue);
    queues.versionQueryFormField.sendKeys('Query for queue version ' + randomQueue);

    queues.createVersionBtn.click().then(function() {
      expect(queues.versionNameFormField.getAttribute('value')).toBe('');
      expect(queues.versionDescriptionFormField.getAttribute('value')).toBe('');
      expect(queues.versionsTableElements.count()).toBeGreaterThan(queueVersionCount);
      queues.activeVersionDropdown.all(by.css('option')).then(function(dropdownVersions) {
        for (var i = 1; i < dropdownVersions.length; ++i) {
          expect(queues.versionsTableElements.get(i - 1).getText()).toContain(queues.activeVersionDropdown.all(by.css('option')).get(i).getText());
        };
      });
    });
  });

  it('should not accept spaces only as valid field input', function() {
    queueCount = shared.tableElements.count();
    queues.firstTableRow.click();

    queues.nameFormField.sendKeys(' ');
    queues.descriptionFormField.sendKeys(' ');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');
    expect(shared.tableElements.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not accept spaces only as valid field input when creating queue version', function() {
    queueVersionCount = queues.versionsTableElements.count();
    queues.firstTableRow.click();

    queues.versionNameFormField.sendKeys(' ');
    queues.versionQueryFormField.sendKeys(' ');
    queues.versionDescriptionFormField.sendKeys(' ');

    // Submit button is still disabled
    expect(queues.createVersionBtn.getAttribute('disabled')).toBeTruthy();
    queues.createVersionBtn.click();

    expect(queues.requiredErrors.get(2).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(2).getText()).toBe('Field \"Name\" is required.');
    expect(queues.requiredErrors.get(3).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(3).getText()).toBe('Field \"Query\" is required.');

    expect(queues.versionsTableElements.count()).toBe(queueVersionCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});

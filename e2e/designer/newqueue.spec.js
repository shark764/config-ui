'use strict';

describe('The create new queues view', function() {
  var loginPage = require('../login/login.po.js'),
    queues = require('./queues.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params,
    queueCount,
    randomQueue;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    browser.get(shared.queuesPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include supported queue fields only', function() {
    shared.createBtn.click();

    expect(queues.nameFormField.isDisplayed()).toBeTruthy();
    expect(queues.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should create a new queue and add to the queues lists', function() {
    randomQueue = Math.floor((Math.random() * 100) + 1);
    shared.createBtn.click();
    var queueAdded = false;

    // Complete queue form and submit
    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    queues.descriptionFormField.sendKeys('This is the queue description for queue ' + randomQueue);
    shared.submitFormBtn.click();

    // Confirm queue is displayed in queue table with correct details
    shared.tableElements.then(function(rows) {
      for (var i = 1; i <= rows.length; ++i) {
        // Check if queue name in table matches newly added queue
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
          if (value == 'Queue ' + randomQueue) {
            queueAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new queue was found in the queue table
      expect(queueAdded).toBeTruthy();
    });
  });

  it('should create a default version', function() {
    randomQueue = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    queues.descriptionFormField.sendKeys('This is a new queue description');

    shared.submitFormBtn.click().then(function() {
      expect(queues.requiredErrors.get(0).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Default v1 queue version added
      expect(queues.versionsTableElements.count()).toBe(1);
      expect(queues.versionsTableElements.get(0).v).toBe('1');
    });
  });

  it('should clear fields on cancel', function() {
    queueCount = shared.tableElements.count();
    randomQueue = Math.floor((Math.random() * 100) + 1);
    shared.createBtn.click();

    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    queues.descriptionFormField.sendKeys('This is the queue description for queue ' + randomQueue);
    shared.cancelFormBtn.click().then(function() {
      // Confirm fields are cleared and new queue is not added
      expect(queues.nameFormField.getAttribute('value')).toBe('');
      expect(queues.descriptionFormField.getAttribute('value')).toBe('');
      expect(shared.tableElements.count()).toBe(queueCount);
      expect(shared.successMessage.isPresent()).toBeFalsy();
    });
  });

  it('should require field inputs', function() {
    queueCount = shared.tableElements.count();
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(shared.tableElements.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should require name', function() {
    queueCount = shared.tableElements.count();
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    // Complete queue form and submit without queue name
    queues.nameFormField.click();
    queues.descriptionFormField.sendKeys('This is the queue description for queue ' + randomQueue);
    shared.submitFormBtn.click();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field "Name" is required.');
    expect(shared.tableElements.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not require description', function() {
    queueCount = shared.tableElements.count();
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    // Complete queue form and submit without queue description
    queues.descriptionFormField.click();
    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    shared.submitFormBtn.click().then(function() {
      expect(shared.tableElements.count()).toBeGreaterThan(queueCount);
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  it('should not accept spaces only as valid field input when creating a new queue', function() {
    queueCount = shared.tableElements.count();
    shared.createBtn.click();
    queues.nameFormField.sendKeys(' ');
    queues.descriptionFormField.sendKeys(' ');

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field "Name" is required.');
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(queueCount);
  });
});

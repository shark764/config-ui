'use strict';

describe('The create new queues view', function() {
  var loginPage = require('./login.po.js'),
    queues = require('./queues.po.js'),
    shared = require('./shared.po.js'),
    queueCount,
    randomQueue;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    browser.get(shared.queuesPageUrl);
    queueCount = queues.queueElements.count();
  });

  afterAll(function(){
    shared.tearDown();
  });

  it('should include supported queue fields only', function() {
    expect(queues.nameFormField.isDisplayed()).toBeTruthy();
    expect(queues.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(queues.submitQueueFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should successfully create a new queue and add to the queues lists', function() {
    // Add randomness to queue details
    randomQueue = Math.floor((Math.random() * 100) + 1);
    var queueAdded = false;

    // Complete queue form and submit
    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    queues.descriptionFormField.sendKeys('This is the queue description for queue ' + randomQueue);
    queues.submitQueueFormBtn.click();

    // Confirm queue is displayed in queue table with correct details
    queues.queueElements.then(function(rows) {
      for (var i = 1; i <= rows.length; ++i) {
        // Check if queue name in table matches newly added queue
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > a:nth-child(1)')).getText().then(function(value) {
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

  it('should require field inputs when creating a new queue', function() {
    queues.submitQueueFormBtn.click();

    expect(queues.queueElements.count()).toBe(queueCount);
  });

  it('should require name when creating a new queue', function() {
    randomQueue = Math.floor((Math.random() * 100) + 1);

    // Complete queue form and submit without queue name
    queues.descriptionFormField.sendKeys('This is the queue description for queue ' + randomQueue);
    queues.submitQueueFormBtn.click();

    expect(queues.queueElements.count()).toBe(queueCount);
  });

  it('should require description when creating a new queue', function() {
    randomQueue = Math.floor((Math.random() * 100) + 1);

    // Complete queue form and submit without queue description
    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    queues.submitQueueFormBtn.click();

    expect(queues.queueElements.count()).toBe(queueCount);
  });

  xit('should not require Active toggle change when creating a new Queue', function() {
    randomQueue = Math.floor((Math.random() * 100) + 1);
    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    queues.descriptionFormField.sendKeys('This is a new queue description');
    queues.submitQueueFormBtn.click();

    expect(queues.queueElements.count()).toBeGreaterThan(queueCount);
  });

  xit('should validate field input when creating a new queue', function() {
    // TODO
    queues.submitQueueFormBtn.click();

    expect(queues.queueElements.count()).toBe(queueCount);
  });

  it('should not accept spaces only as valid field input when creating a new queue', function() {
    // TODO
    queues.nameFormField.sendKeys(' ');
    queues.descriptionFormField.sendKeys(' ');
    queues.submitQueueFormBtn.click();

    expect(queues.queueElements.count()).toBe(queueCount);
  });

  it('should require unique queue name when creating a new queue', function() {
    if (queueCount > 0) {
      // Attempt to create a new Queue with the name of an existing Queue
      queues.queueElements.then(function(existingQueues) {
        queues.nameFormField.sendKeys(existingQueues.get(0).name);
        queues.descriptionFormField.sendKeys('This is the queue description for queue');
        queues.submitQueueFormBtn.click();

        // Verify queue is not created
        expect(queues.queueElements.count()).toBe(queueCount);
        // TODO Error message displayed
      });
    }
  });

});

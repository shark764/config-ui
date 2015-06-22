'use strict';

describe('The queues view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    queues = require('./queues.po.js'),
    params = browser.params,
    queueCount;

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
    // TODO
  });

  it('should display queue details when selected from table', function() {

    queues.firstTableRow.click();

    // Verify queue name in table matches populated field
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)')).getText()).toContain(nameFormField).getAttribute('value');

    queues.secondTableRow.click();

    // Verify queue name in table matches populated field
    expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2) > a:nth-child(1)')).getText()).toContain(nameFormField).getAttribute('value');

  });

  it('should require all fields when editing a Queue', function() {
    // Select first queue from table
    element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)")).click();

    // Edit fields
    queues.nameFormField.clear();
    queues.descriptionFormField.clear();
    queues.createQueueBtn.click();

    // TODO Verify no errors
  });

  it('should allow the queue name and description fields to be updated', function() {

    // Select first queue from table
    element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)")).click();

    // Edit fields
    queues.nameFormField.sendKeys('Edit');
    queues.descriptionFormField.sendKeys('Edit');
    queues.createQueueBtn.click();

    // TODO Verify no errors

  });

  it('should require name field when editing a Queue', function() {
    queues.descriptionFormField.sendKeys('This is a new queue description');
    queues.submitQueueFormBtn.click();

    expect(queues.queueElements.count()).toBe(queueCount);

    //TODO Verify error messages
  });

  it('should require description field when editing a queue', function() {
    queues.nameFormField.sendKeys('Queue');
    queues.submitQueueFormBtn.click();

    expect(queues.queueElements.count()).toBe(queueCount);

    //TODO Verify error messages
  });

  xit('should validate field input when editing a Queue', function() {
    // TODO
  });

  xit('should ensure updates to queues are persistant on page reload', function() {
    // TODO Edit queue, reload page, ensure changes are persistant
  });

});

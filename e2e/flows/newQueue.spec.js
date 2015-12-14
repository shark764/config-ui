'use strict';

describe('The create new queues view', function() {
  var loginPage = require('../login/login.po.js'),
    newQueue = require('./newQueue.po.js'),
    queues = require('./queues.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params,
    queueCount,
    randomQueue;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.queuesPageUrl);
    queueCount = shared.tableRows.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include supported queue fields only with default values', function() {
    shared.createBtn.click();

    expect(queues.nameFormField.isDisplayed()).toBeTruthy();
    expect(queues.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(queues.activeVersionDropdown.isDisplayed()).toBeTruthy();
    expect(queues.activeVersionDropdown.isEnabled()).toBeFalsy();
    expect(queues.activeVersionDropdown.getAttribute('value')).toBe('1');
    expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();

    expect(newQueue.showAdvancedQueryLink.isDisplayed()).toBeTruthy();
    expect(newQueue.advancedQueryFormField.isDisplayed()).toBeFalsy();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click().then(function() {
      // Query fields
      expect(newQueue.allGroupsTypeAhead.isDisplayed()).toBeTruthy();
      expect(newQueue.anyGroupsTypeAhead.isDisplayed()).toBeTruthy();
      expect(newQueue.allSkillsTypeAhead.isDisplayed()).toBeTruthy();
      expect(newQueue.anySkillsTypeAhead.isDisplayed()).toBeTruthy();

      expect(newQueue.allGroupsAdd.isDisplayed()).toBeTruthy();
      expect(newQueue.anyGroupsAdd.isDisplayed()).toBeTruthy();
      expect(newQueue.allSkillsAdd.isDisplayed()).toBeTruthy();
      expect(newQueue.anySkillsAdd.isDisplayed()).toBeTruthy();

      // Priority fields with defaults
      expect(newQueue.minPriorityInputField.isDisplayed()).toBeTruthy();
      expect(newQueue.maxPriorityInputField.isDisplayed()).toBeTruthy();
      expect(newQueue.priorityValueInputField.isDisplayed()).toBeTruthy();
      expect(newQueue.priorityRateInputField.isDisplayed()).toBeTruthy();
      expect(newQueue.priorityRateUnitField.isDisplayed()).toBeTruthy();

      expect(newQueue.minPriorityInputField.getAttribute('value')).toBe(queues.minPriorityDefault);
      expect(newQueue.maxPriorityInputField.getAttribute('value')).toBe(queues.maxPriorityDefault);
      expect(newQueue.priorityValueInputField.getAttribute('value')).toBe(queues.priorityValueDefault);
      expect(newQueue.priorityRateInputField.getAttribute('value')).toBe(queues.priorityRateDefault);
      expect(newQueue.priorityRateUnitField.getAttribute('value')).toBe(queues.priorityRateUnitDefault);
    });
  });

  it('should toggle between showing advanced and basic query fields', function() {
    shared.createBtn.click();
    expect(newQueue.showAdvancedQueryLink.isDisplayed()).toBeTruthy();
    expect(newQueue.showBasicQueryLink.isDisplayed()).toBeFalsy();

    // Advanced query field is not displayed
    expect(newQueue.advancedQueryFormField.isDisplayed()).toBeFalsy();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click().then(function() {
      // Basic Query fields are displayed
      expect(newQueue.allGroupsTypeAhead.isDisplayed()).toBeTruthy();
      expect(newQueue.anyGroupsTypeAhead.isDisplayed()).toBeTruthy();
      expect(newQueue.allSkillsTypeAhead.isDisplayed()).toBeTruthy();
      expect(newQueue.anySkillsTypeAhead.isDisplayed()).toBeTruthy();

      newQueue.showAdvancedQueryLink.click().then(function() {
        expect(newQueue.showAdvancedQueryLink.isDisplayed()).toBeFalsy();
        expect(newQueue.showBasicQueryLink.isDisplayed()).toBeTruthy();

        // Advanced query field is displayed
        expect(newQueue.advancedQueryFormField.isDisplayed()).toBeTruthy();
        expect(newQueue.advancedQueryFormField.getAttribute('value')).toBe('{:groups (and (and) (or)) :skills (and (and) (or))}');

        // Basic Query fields are not displayed
        expect(newQueue.allGroupsTypeAhead.isDisplayed()).toBeFalsy();
        expect(newQueue.anyGroupsTypeAhead.isDisplayed()).toBeFalsy();
        expect(newQueue.allSkillsTypeAhead.isDisplayed()).toBeFalsy();
        expect(newQueue.anySkillsTypeAhead.isDisplayed()).toBeFalsy();
      }).then(function() {
        newQueue.showBasicQueryLink.click().then(function() {
          expect(newQueue.showAdvancedQueryLink.isDisplayed()).toBeTruthy();
          expect(newQueue.showBasicQueryLink.isDisplayed()).toBeFalsy();

          // Advanced query field is not displayed
          expect(newQueue.advancedQueryFormField.isDisplayed()).toBeFalsy();

          // Basic Query fields are displayed
          expect(newQueue.allGroupsTypeAhead.isDisplayed()).toBeTruthy();
          expect(newQueue.anyGroupsTypeAhead.isDisplayed()).toBeTruthy();
          expect(newQueue.allSkillsTypeAhead.isDisplayed()).toBeTruthy();
          expect(newQueue.anySkillsTypeAhead.isDisplayed()).toBeTruthy();
        });
      });
    });
  });

  it('should create a new queue with default version and add to the queues lists', function() {
    randomQueue = Math.floor((Math.random() * 100) + 1);
    shared.createBtn.click();

    // Complete queue form and submit
    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    queues.descriptionFormField.sendKeys('This is the queue description for queue ' + randomQueue);

    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.tableRows.count()).toBeGreaterThan(queueCount);

      shared.searchField.sendKeys('Queue ' + randomQueue);
      expect(shared.tableRows.count()).toBeGreaterThan(0);

      // Default version created
      expect(queues.activeVersionDropdown.$('option:checked').getText()).toBe('v1');
      expect(queues.queueVersions.count()).toBe(1);
      expect(queues.queueVersions.get(0).getText()).toContain('v1');

      // Queue is enabled by default
      expect(shared.firstTableRow.getText()).toContain('Enabled');
      expect(queues.activeFormToggle.element(by.css('label.switch:nth-child(2) > input:nth-child(1)')).isSelected()).toBeTruthy();
    });
  });

  it('should close the panel on cancel', function() {
    randomQueue = Math.floor((Math.random() * 100) + 1);
    shared.createBtn.click();

    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    queues.descriptionFormField.sendKeys('This is the queue description for queue ' + randomQueue);

    shared.cancelFormBtn.click();

    shared.waitForAlert();
    shared.dismissChanges();
    expect(shared.detailsPanel.isDisplayed()).toBeFalsy();
  });

  it('should require field inputs', function() {
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    shared.submitFormBtn.click();
    expect(shared.tableRows.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should require name', function() {
    shared.createBtn.click();

    // Complete queue form and submit without queue name
    queues.nameFormField.click();
    queues.descriptionFormField.sendKeys('This is the queue description for queue ' + randomQueue);

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field "Name" is required.');
    expect(shared.tableRows.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  xit('should require unique name', function() {
    // TODO No error returned from bs-api
    shared.createBtn.click();

    // Complete queue form and submit with existing queue name
    shared.firstTableRow.element(by.css(queues.nameColumn)).getText().then(function(existingQueueName) {
      queues.nameFormField.sendKeys(existingQueueName);
      shared.submitFormBtn.click().then(function() {
        expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
        expect(queues.requiredErrors.get(0).getText()).toBe('resource with the same value already exists in the system');
        expect(shared.successMessage.isPresent()).toBeFalsy();

        queues.nameFormField.sendKeys('Update');
        expect(queues.requiredErrors.count()).toBe(0);
        expect(shared.submitFormBtn.isEnabled()).toBeTruthy();
      });
    });
  });

  it('should require advanced query input', function() {
    shared.createBtn.click();
    queues.nameFormField.sendKeys('New Queue');

    newQueue.showAdvancedQueryLink.click();
    newQueue.advancedQueryFormField.clear();
    newQueue.advancedQueryFormField.sendKeys('\t');

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field "Query" is required.');
    expect(shared.tableRows.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should validate query field', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    // Complete queue form and submit without valid query
    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    newQueue.showAdvancedQueryLink.click();
    newQueue.advancedQueryFormField.clear();
    newQueue.advancedQueryFormField.sendKeys('This is not a valid query\t');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click().then(function() {
      expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
      expect(queues.requiredErrors.get(0).getText()).toContain('Your query is invalid, please fix your query.');
      expect(shared.tableRows.count()).toBe(queueCount);
      expect(shared.successMessage.isPresent()).toBeFalsy();
    });
  });

  it('should display warning when advanced query changes cannot be converted to the basic query builder', function() {
    shared.createBtn.click();
    newQueue.showAdvancedQueryLink.click();
    newQueue.advancedQueryFormField.clear();
    newQueue.advancedQueryFormField.sendKeys('This is not a valid query');

    newQueue.showBasicQueryLink.click();

    shared.waitForAlert();
    shared.dismissChanges();

    // Basic query builder is displayed with no filter options
    expect(newQueue.allGroupsTypeAhead.isPresent()).toBeFalsy();
    expect(newQueue.anyGroupsTypeAhead.isPresent()).toBeFalsy();
    expect(newQueue.allSkillsTypeAhead.isPresent()).toBeFalsy();
    expect(newQueue.anySkillsTypeAhead.isPresent()).toBeFalsy();

    // Advanced query details are cleared
    newQueue.showAdvancedQueryLink.click();
    expect(newQueue.advancedQueryFormField.getAttribute('value')).toBe('{}');
  });

  it('should add filters to basic query builder when advanced query field is updated', function() {
    shared.createBtn.click();
    newQueue.showAdvancedQueryLink.click();
    newQueue.advancedQueryFormField.clear();
    newQueue.advancedQueryFormField.sendKeys('{:groups (and (and) (or)) :skills (and (and) (or))}');

    newQueue.showBasicQueryLink.click();

    // Basic query builder is displayed with filter options
    expect(newQueue.allGroupsTypeAhead.isDisplayed()).toBeTruthy();
    expect(newQueue.anyGroupsTypeAhead.isDisplayed()).toBeTruthy();
    expect(newQueue.allSkillsTypeAhead.isDisplayed()).toBeTruthy();
    expect(newQueue.anySkillsTypeAhead.isDisplayed()).toBeTruthy();
  });

  it('should not require description or query filters', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    // Complete queue form and submit without queue description
    queues.descriptionFormField.click();
    queues.nameFormField.sendKeys('Queue ' + randomQueue);

    shared.submitFormBtn.click().then(function() {
      expect(shared.tableRows.count()).toBeGreaterThan(queueCount);
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  it('should not accept spaces only as valid field input when creating a new queue', function() {
    shared.createBtn.click();
    queues.nameFormField.sendKeys(' ');
    queues.descriptionFormField.sendKeys(' ');
    newQueue.showAdvancedQueryLink.click();
    newQueue.advancedQueryFormField.clear();
    newQueue.advancedQueryFormField.sendKeys(' \t');

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field "Name" is required.');
    expect(queues.requiredErrors.get(1).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(1).getText()).toBe('Field "Query" is required.');

    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableRows.count()).toBe(queueCount);
  });

  it('should require priority values', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    newQueue.minPriorityInputField.clear();
    newQueue.maxPriorityInputField.clear();
    newQueue.priorityValueInputField.clear();
    newQueue.priorityRateInputField.clear();
    newQueue.priorityRateInputField.sendKeys('\t');

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click().then(function() {
      expect(queues.requiredErrors.get(0).getText()).toBe('Please enter a minimum priority');
      expect(queues.requiredErrors.get(1).getText()).toBe('Please enter a maximum priority');
      expect(queues.requiredErrors.get(2).getText()).toBe('Please enter a priority value');
      expect(queues.requiredErrors.get(3).getText()).toBe('Please enter a priority rate');

      expect(shared.tableRows.count()).toBe(queueCount);
      expect(shared.successMessage.isPresent()).toBeFalsy();
    });
  });

});

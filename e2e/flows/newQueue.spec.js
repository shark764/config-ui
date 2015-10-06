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
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.queuesPageUrl);
    queueCount = shared.tableElements.count();
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

    expect(queues.showAdvancedQueryLink.isDisplayed()).toBeTruthy();
    expect(queues.advancedQueryFormField.isDisplayed()).toBeFalsy();

    // Query fields
    expect(queues.allGroupsTypeAhead.isDisplayed()).toBeTruthy();
    expect(queues.anyGroupsTypeAhead.isDisplayed()).toBeTruthy();
    expect(queues.allSkillsTypeAhead.isDisplayed()).toBeTruthy();
    expect(queues.anySkillsTypeAhead.isDisplayed()).toBeTruthy();

    expect(queues.allGroupsAdd.isDisplayed()).toBeTruthy();
    expect(queues.anyGroupsAdd.isDisplayed()).toBeTruthy();
    expect(queues.allSkillsAdd.isDisplayed()).toBeTruthy();
    expect(queues.anySkillsAdd.isDisplayed()).toBeTruthy();

    // Priority fields with defaults
    expect(queues.minPriorityInputField.isDisplayed()).toBeTruthy();
    expect(queues.maxPriorityInputField.isDisplayed()).toBeTruthy();
    expect(queues.priorityValueInputField.isDisplayed()).toBeTruthy();
    expect(queues.priorityRateInputField.isDisplayed()).toBeTruthy();
    expect(queues.priorityRateUnitField.isDisplayed()).toBeTruthy();

    expect(queues.minPriorityInputField.getAttribute('value')).toBe(queues.minPriorityDefault);
    expect(queues.maxPriorityInputField.getAttribute('value')).toBe(queues.maxPriorityDefault);
    expect(queues.priorityValueInputField.getAttribute('value')).toBe(queues.priorityValueDefault);
    expect(queues.priorityRateInputField.getAttribute('value')).toBe(queues.priorityRateDefault);
    expect(queues.priorityRateUnitField.getAttribute('value')).toBe(queues.priorityRateUnitDefault);
  });

  it('should toggle between showing advanced and basic query fields', function() {
    shared.createBtn.click();
    expect(queues.showAdvancedQueryLink.isDisplayed()).toBeTruthy();
    expect(queues.showBasicQueryLink.isDisplayed()).toBeFalsy();

    // Advanced query field is not displayed
    expect(queues.advancedQueryFormField.isDisplayed()).toBeFalsy();

    // Basic Query fields are displayed
    expect(queues.allGroupsTypeAhead.isDisplayed()).toBeTruthy();
    expect(queues.anyGroupsTypeAhead.isDisplayed()).toBeTruthy();
    expect(queues.allSkillsTypeAhead.isDisplayed()).toBeTruthy();
    expect(queues.anySkillsTypeAhead.isDisplayed()).toBeTruthy();

    queues.showAdvancedQueryLink.click().then(function() {
      expect(queues.showAdvancedQueryLink.isDisplayed()).toBeFalsy();
      expect(queues.showBasicQueryLink.isDisplayed()).toBeTruthy();

      // Advanced query field is displayed
      expect(queues.advancedQueryFormField.isDisplayed()).toBeTruthy();
      expect(queues.advancedQueryFormField.getAttribute('value')).toBe('{}');

      // Basic Query fields are not displayed
      expect(queues.allGroupsTypeAhead.isDisplayed()).toBeTruthy();
      expect(queues.anyGroupsTypeAhead.isDisplayed()).toBeTruthy();
      expect(queues.allSkillsTypeAhead.isDisplayed()).toBeTruthy();
      expect(queues.anySkillsTypeAhead.isDisplayed()).toBeTruthy();
    }).then(function() {
      queues.showBasicQueryLink.click().then(function() {
        expect(queues.showAdvancedQueryLink.isDisplayed()).toBeTruthy();
        expect(queues.showBasicQueryLink.isDisplayed()).toBeFalsy();

        // Advanced query field is not displayed
        expect(queues.advancedQueryFormField.isDisplayed()).toBeFalsy();

        // Basic Query fields are displayed
        expect(queues.allGroupsTypeAhead.isDisplayed()).toBeTruthy();
        expect(queues.anyGroupsTypeAhead.isDisplayed()).toBeTruthy();
        expect(queues.allSkillsTypeAhead.isDisplayed()).toBeTruthy();
        expect(queues.anySkillsTypeAhead.isDisplayed()).toBeTruthy();
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
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(queueCount);

      shared.searchField.sendKeys('Queue ' + randomQueue);
      expect(shared.tableElements.count()).toBeGreaterThan(0);

      // Default version created
      expect(queues.activeVersionDropdown.$('option:checked').getText()).toBe('v1');
      expect(queues.queueVersions.count()).toBe(1);
      expect(queues.queueVersions.get(0).getText()).toContain('v1');
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
    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
  });

  it('should require field inputs', function() {
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    shared.submitFormBtn.click();
    expect(shared.tableElements.count()).toBe(queueCount);
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

    // TODO TITAN2-4097
    //expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    //expect(queues.requiredErrors.get(0).getText()).toBe('Field "Name" is required.');
    expect(shared.tableElements.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should require advanced query input', function() {
    shared.createBtn.click();
    queues.nameFormField.sendKeys('New Queue');

    queues.showAdvancedQueryLink.click();
    queues.advancedQueryFormField.clear();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // TODO TITAN2-4097
    //expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    //expect(queues.requiredErrors.get(0).getText()).toBe('Field "Query" is required.');
    expect(shared.tableElements.count()).toBe(queueCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  //TODO: bug, see TITAN2-3765
  xit('should validate query field', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);
    queues.showAdvancedQueryLink.click();

    // Complete queue form and submit without valid query
    queues.createVersionQueryFormField.click();
    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    queues.descriptionFormField.sendKeys('This is the queue description for queue ' + randomQueue);
    queues.advancedQueryFormField.clear();
    queues.advancedQueryFormField.sendKeys('This is not a valid query');

    shared.submitFormBtn.click().then(function() {
      expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
      expect(queues.requiredErrors.get(0).getText()).toContain('invalid query, reason: Value does not match schema: (not (map?');
      expect(shared.tableElements.count()).toBe(queueCount);
      expect(shared.successMessage.isPresent()).toBeFalsy();
    });
  });

  it('should not require description', function() {
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
    shared.createBtn.click();
    queues.nameFormField.sendKeys(' ');
    queues.descriptionFormField.sendKeys(' ');

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // TODO TITAN2-4097
    //expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    //expect(queues.requiredErrors.get(0).getText()).toBe('Field "Name" is required.');
    //expect(queues.requiredErrors.get(1).isDisplayed()).toBeTruthy();
    //expect(queues.requiredErrors.get(1).getText()).toBe('Field "Query" is required.');

    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(queueCount);
  });

  it('should require priority values', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    queues.minPriorityInputField.clear();
    queues.maxPriorityInputField.clear();
    queues.priorityValueInputField.clear();
    queues.priorityRateInputField.clear();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click().then(function() {
      // TODO TITAN2-4097
      //expect(queues.requiredErrors.get(0).getText()).toBe('Field "Min Priority" is required.');
      //expect(queues.requiredErrors.get(1).getText()).toBe('Field "Max Priority" is required.');
      //expect(queues.requiredErrors.get(2).getText()).toBe('Field "Priority Value" is required.');
      //expect(queues.requiredErrors.get(3).getText()).toBe('Field "Priority Rate" is required.');

      expect(shared.tableElements.count()).toBe(queueCount);
      expect(shared.successMessage.isPresent()).toBeFalsy();
    });
  });

  describe('basic query builder', function() {
    it('should display all tenant groups', function() {
      shared.createBtn.click();

      // Get list of Groups from 'All' query dropdown
      var groupNameList = [];
      queues.allGroupsTypeAhead.click();
      queues.allGroupsDropdownGroups.each(function(groupElement, index) {
        groupElement.getText().then(function(groupName) {
          groupNameList.push(groupName);
        });
      }).then(function() {
        // Verify groups from 'Any' query dropdown matches
        queues.allGroupsTypeAhead.sendKeys('\t'); // Switch to 'Any' dropdown
        queues.anyGroupsDropdownGroups.each(function(groupElement, index) {
          expect(groupNameList[index]).toBe(groupElement.getText());
        });

        // Verify all tenant groups are listed
        browser.get(shared.groupsPageUrl);
        expect(groupNameList.length).toBe(shaerd.tableElements.count());

        for (var i = 0; i < groupNameList.length; i++) {
          shared.searchField.clear();
          shared.searchField.sendKeys(groupNameList[i]);
          expect(shared.tableElements.count()).toBeGreaterThan(0);
        }
      });
    });

    it('should display all tenant skills', function() {
      shared.createBtn.click();

      // Get list of Skills from 'All' query dropdown
      var skillNameList = [];
      queues.allSkillsTypeAhead.click();
      queues.allSkillsDropdownSkills.each(function(skillElement, index) {
        skillElement.getText().then(function(skillName) {
          skillNameList.push(skillName);
        });
      }).then(function() {
        // Verify skills from 'Any' query dropdown matches
        queues.allSkillsTypeAhead.sendKeys('\t'); // Switch to 'Any' dropdown
        queues.anySkillsDropdownSkills.each(function(skillElement, index) {
          expect(skillNameList[index]).toBe(skillElement.getText());
        });

        // Verify all tenant skills are listed
        browser.get(shared.skillsPageUrl);
        expect(skillNameList.length).toBe(shaerd.tableElements.count());

        for (var i = 0; i < skillNameList.length; i++) {
          shared.searchField.clear();
          shared.searchField.sendKeys(skillNameList[i]);
          expect(shared.tableElements.count()).toBeGreaterThan(0);
        }
      });
    });

    it('should add groups and skills when selected', function() {
      shared.createBtn.click();

      // Select group from 'All' query dropdown
      queues.allGroupsTypeAhead.click();
      queues.allGroupsDropdownSkills.get(0).click();
      queues.allGroupsTypeAhead.getAttribute('value').then(function(selectedGroupName) {
        queues.allGroupsAdd.click();
        expect(queues.allGroupsSelected.count()).toBe(1);
        expect(queues.allGroupsSelected.get(0).getText()).toBe(selectedGroupName);
      });

      // Select Group from 'Any' query dropdown
      queues.anyGroupsTypeAhead.click();
      queues.anyGroupsDropdownSkills.get(0).click();
      queues.anyGroupsTypeAhead.getAttribute('value').then(function(selectedGroupName) {
        queues.anyGroupsAdd.click();
        expect(queues.anyGroupsSelected.count()).toBe(1);
        expect(queues.anyGroupsSelected.get(0).getText()).toBe(selectedGroupName);
      });

      // Select Skill from 'All' query dropdown
      queues.allSkillsTypeAhead.click();
      queues.allSkillsDropdownSkills.get(0).click();
      queues.allSkillsTypeAhead.getAttribute('value').then(function(selectedSkillName) {
        queues.allSkillsAdd.click();
        expect(queues.allSkillsSelected.count()).toBe(1);
        expect(queues.allSkillsSelected.get(0).getText()).toBe(selectedSkillName);
      });

      // Select Skill from 'Any' query dropdown
      queues.anySkillsTypeAhead.click();
      queues.anySkillsDropdownSkills.get(0).click();
      queues.anySkillsTypeAhead.getAttribute('value').then(function(selectedSkillName) {
        queues.anySkillsAdd.click();
        expect(queues.anySkillsSelected.count()).toBe(1);
        expect(queues.anySkillsSelected.get(0).getText()).toBe(selectedSkillName);
      });
    });

    it('should remove group from \'All\' and leave other selected groups/skills', function() {
      shared.createBtn.click();

      // Select group from 'All' query dropdown
      queues.allGroupsTypeAhead.click();
      queues.allGroupsDropdownSkills.get(0).click();
      queues.allGroupsAdd.click();
      expect(queues.allGroupsSelected.count()).toBe(1);

      // Select Group from 'Any' query dropdown
      queues.anyGroupsTypeAhead.click();
      queues.anyGroupsDropdownSkills.get(0).click();
      queues.anyGroupsAdd.click();
      expect(queues.anyGroupsSelected.count()).toBe(1);

      // Select Skill from 'All' query dropdown
      queues.allSkillsTypeAhead.click();
      queues.allSkillsDropdownSkills.get(0).click();
      queues.allSkillsAdd.click();
      expect(queues.allSkillsSelected.count()).toBe(1);

      // Select Skill from 'Any' query dropdown
      queues.anySkillsTypeAhead.click();
      queues.anySkillsDropdownSkills.get(0).click();
      queues.anySkillsAdd.click();
      expect(queues.anySkillsSelected.count()).toBe(1);

      // Remove group from 'All'
      queues.allGroupsSelected.get(0).element(by.css('a')).click().then(function() {
        // Only the 'All' group is removed
        expect(queues.allGroupsSelected.count()).toBe(0);
        expect(queues.anyGroupsSelected.count()).toBe(1);
        expect(queues.allSkillsSelected.count()).toBe(1);
        expect(queues.anySkillsSelected.count()).toBe(1);
      });
    });

    it('should remove group from \'Any\' and leave other selected groups/skills', function() {
      shared.createBtn.click();

      // Select group from 'All' query dropdown
      queues.allGroupsTypeAhead.click();
      queues.allGroupsDropdownSkills.get(0).click();
      queues.allGroupsAdd.click();
      expect(queues.allGroupsSelected.count()).toBe(1);

      // Select Group from 'Any' query dropdown
      queues.anyGroupsTypeAhead.click();
      queues.anyGroupsDropdownSkills.get(0).click();
      queues.anyGroupsAdd.click();
      expect(queues.anyGroupsSelected.count()).toBe(1);

      // Select Skill from 'All' query dropdown
      queues.allSkillsTypeAhead.click();
      queues.allSkillsDropdownSkills.get(0).click();
      queues.allSkillsAdd.click();
      expect(queues.allSkillsSelected.count()).toBe(1);

      // Select Skill from 'Any' query dropdown
      queues.anySkillsTypeAhead.click();
      queues.anySkillsDropdownSkills.get(0).click();
      queues.anySkillsAdd.click();
      expect(queues.anySkillsSelected.count()).toBe(1);

      // Remove group from 'Any'
      queues.anyGroupsSelected.get(0).element(by.css('a')).click().then(function() {
        // Only the 'Any' group is removed
        expect(queues.allGroupsSelected.count()).toBe(1);
        expect(queues.anyGroupsSelected.count()).toBe(0);
        expect(queues.allSkillsSelected.count()).toBe(1);
        expect(queues.anySkillsSelected.count()).toBe(1);
      });
    });

    it('should remove skill from \'All\' and leave other selected groups/skills', function() {
      shared.createBtn.click();

      // Select group from 'All' query dropdown
      queues.allGroupsTypeAhead.click();
      queues.allGroupsDropdownSkills.get(0).click();
      queues.allGroupsAdd.click();
      expect(queues.allGroupsSelected.count()).toBe(1);

      // Select Group from 'Any' query dropdown
      queues.anyGroupsTypeAhead.click();
      queues.anyGroupsDropdownSkills.get(0).click();
      queues.anyGroupsAdd.click();
      expect(queues.anyGroupsSelected.count()).toBe(1);

      // Select Skill from 'All' query dropdown
      queues.allSkillsTypeAhead.click();
      queues.allSkillsDropdownSkills.get(0).click();
      queues.allSkillsAdd.click();
      expect(queues.allSkillsSelected.count()).toBe(1);

      // Select Skill from 'Any' query dropdown
      queues.anySkillsTypeAhead.click();
      queues.anySkillsDropdownSkills.get(0).click();
      queues.anySkillsAdd.click();
      expect(queues.anySkillsSelected.count()).toBe(1);

      // Remove skill from 'All'
      queues.allSkillsSelected.get(0).element(by.css('a')).click().then(function() {
        // Only the 'All' skill is removed
        expect(queues.allGroupsSelected.count()).toBe(1);
        expect(queues.anyGroupsSelected.count()).toBe(1);
        expect(queues.allSkillsSelected.count()).toBe(0);
        expect(queues.anySkillsSelected.count()).toBe(1);
      });
    });

    it('should remove skill from \'Any\' and leave other selected groups/skills', function() {
      shared.createBtn.click();

      // Select group from 'All' query dropdown
      queues.allGroupsTypeAhead.click();
      queues.allGroupsDropdownSkills.get(0).click();
      queues.allGroupsAdd.click();
      expect(queues.allGroupsSelected.count()).toBe(1);

      // Select Group from 'Any' query dropdown
      queues.anyGroupsTypeAhead.click();
      queues.anyGroupsDropdownSkills.get(0).click();
      queues.anyGroupsAdd.click();
      expect(queues.anyGroupsSelected.count()).toBe(1);

      // Select Skill from 'All' query dropdown
      queues.allSkillsTypeAhead.click();
      queues.allSkillsDropdownSkills.get(0).click();
      queues.allSkillsAdd.click();
      expect(queues.allSkillsSelected.count()).toBe(1);

      // Select Skill from 'Any' query dropdown
      queues.anySkillsTypeAhead.click();
      queues.anySkillsDropdownSkills.get(0).click();
      queues.anySkillsAdd.click();
      expect(queues.anySkillsSelected.count()).toBe(1);

      // Remove skill from 'Any'
      queues.anySkillsSelected.get(0).element(by.css('a')).click().then(function() {
        // Only the 'Any' skill is removed
        expect(queues.allGroupsSelected.count()).toBe(1);
        expect(queues.anyGroupsSelected.count()).toBe(1);
        expect(queues.allSkillsSelected.count()).toBe(1);
        expect(queues.anySkillsSelected.count()).toBe(0);
      });
    });

  });

});

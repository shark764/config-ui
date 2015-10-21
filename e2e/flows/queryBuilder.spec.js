'use strict';

describe('The basic query builder', function() {
  var loginPage = require('../login/login.po.js'),
    queues = require('./queues.po.js'),
    newQueue = require('./newQueue.po.js'),
    newVersion = require('./newQueueVersion.po.js'),
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

  it('should display all tenant groups', function() {
    shared.createBtn.click();

    // Add Groups filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Get list of Groups from 'All' query dropdown
    var groupNameList = [];
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.each(function(groupElement, index) {
      groupElement.getText().then(function(groupName) {
        groupNameList.push(groupName);
      });
    }).then(function() {
      // Verify groups from 'Any' query dropdown matches
      newQueue.allGroupsTypeAhead.sendKeys('\t'); // Switch to 'Any' dropdown
      newQueue.anyGroupsDropdownGroups.each(function(groupElement, index) {
        expect(groupNameList[index]).toBe(groupElement.getText());
      });

      // Verify all tenant groups are listed
      browser.get(shared.groupsPageUrl);
      expect(groupNameList.length).toBe(shared.tableElements.count());

      for (var i = 0; i < groupNameList.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(groupNameList[i]);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    });
  });

  it('should display all tenant skills', function() {
    shared.createBtn.click();

    // Add Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Get list of Skills from 'All' query dropdown
    var skillNameList = [];
    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.each(function(skillElement, index) {
      skillElement.getText().then(function(skillName) {
        skillNameList.push(skillName);
      });
    }).then(function() {
      // Verify skills from 'Any' query dropdown matches
      newQueue.allSkillsTypeAhead.sendKeys('\t'); // Switch to 'Any' dropdown
      newQueue.anySkillsDropdownSkills.each(function(skillElement, index) {
        expect(skillNameList[index]).toBe(skillElement.getText());
      });

      // Verify all tenant skills are listed
      browser.get(shared.skillsPageUrl);
      expect(skillNameList.length).toBe(shared.tableElements.count());

      for (var i = 0; i < skillNameList.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(skillNameList[i]);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    });
  });

  it('should add groups and skills when selected', function() {
    shared.createBtn.click();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select group from 'All' query dropdown
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsTypeAhead.getAttribute('value').then(function(selectedGroupName) {
      newQueue.allGroupsAdd.click();
      expect(newQueue.allGroupsSelected.count()).toBe(1);
      expect(newQueue.allGroupsSelected.get(0).getText()).toBe(selectedGroupName);
    });

    // Select Group from 'Any' query dropdown
    newQueue.anyGroupsTypeAhead.click();
    newQueue.anyGroupsDropdownGroups.get(0).click();
    newQueue.anyGroupsTypeAhead.getAttribute('value').then(function(selectedGroupName) {
      newQueue.anyGroupsAdd.click();
      expect(newQueue.anyGroupsSelected.count()).toBe(1);
      expect(newQueue.anyGroupsSelected.get(0).getText()).toBe(selectedGroupName);
    });

    // Select Skill from 'All' query dropdown
    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsTypeAhead.getAttribute('value').then(function(selectedSkillName) {
      newQueue.allSkillsAdd.click();
      expect(newQueue.allSkillsSelected.count()).toBe(1);
      expect(newQueue.allSkillsSelected.get(0).getText()).toContain(selectedSkillName);
    });

    // Select Skill from 'Any' query dropdown
    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.get(0).click();
    newQueue.anySkillsTypeAhead.getAttribute('value').then(function(selectedSkillName) {
      newQueue.anySkillsAdd.click();
      expect(newQueue.anySkillsSelected.count()).toBe(1);
      expect(newQueue.anySkillsSelected.get(0).getText()).toContain(selectedSkillName);
    });
  });

  it('should remove group from \'All\' and leave other selected groups/skills', function() {
    shared.createBtn.click();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select group from 'All' query dropdown
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click();
    expect(newQueue.allGroupsSelected.count()).toBe(1);

    // Select Group from 'Any' query dropdown
    newQueue.anyGroupsTypeAhead.click();
    newQueue.anyGroupsDropdownGroups.get(0).click();
    newQueue.anyGroupsAdd.click();
    expect(newQueue.anyGroupsSelected.count()).toBe(1);

    // Select Skill from 'All' query dropdown
    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsAdd.click();
    expect(newQueue.allSkillsSelected.count()).toBe(1);

    // Select Skill from 'Any' query dropdown
    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.get(0).click();
    newQueue.anySkillsAdd.click();
    expect(newQueue.anySkillsSelected.count()).toBe(1);

    // Remove group from 'All'
    newQueue.allGroupsSelected.get(0).element(by.css('a')).click().then(function() {
      // Only the 'All' group is removed
      expect(newQueue.allGroupsSelected.count()).toBe(0);
      expect(newQueue.anyGroupsSelected.count()).toBe(1);
      expect(newQueue.allSkillsSelected.count()).toBe(1);
      expect(newQueue.anySkillsSelected.count()).toBe(1);
    });
  });

  it('should remove group from \'Any\' and leave other selected groups/skills', function() {
    shared.createBtn.click();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select group from 'All' query dropdown
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click();
    expect(newQueue.allGroupsSelected.count()).toBe(1);

    // Select Group from 'Any' query dropdown
    newQueue.anyGroupsTypeAhead.click();
    newQueue.anyGroupsDropdownGroups.get(0).click();
    newQueue.anyGroupsAdd.click();
    expect(newQueue.anyGroupsSelected.count()).toBe(1);

    // Select Skill from 'All' query dropdown
    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsAdd.click();
    expect(newQueue.allSkillsSelected.count()).toBe(1);

    // Select Skill from 'Any' query dropdown
    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.get(0).click();
    newQueue.anySkillsAdd.click();
    expect(newQueue.anySkillsSelected.count()).toBe(1);

    // Remove group from 'Any'
    newQueue.anyGroupsSelected.get(0).element(by.css('a')).click().then(function() {
      // Only the 'Any' group is removed
      expect(newQueue.allGroupsSelected.count()).toBe(1);
      expect(newQueue.anyGroupsSelected.count()).toBe(0);
      expect(newQueue.allSkillsSelected.count()).toBe(1);
      expect(newQueue.anySkillsSelected.count()).toBe(1);
    });
  });

  it('should remove skill from \'All\' and leave other selected groups/skills', function() {
    shared.createBtn.click();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select group from 'All' query dropdown
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click();
    expect(newQueue.allGroupsSelected.count()).toBe(1);

    // Select Group from 'Any' query dropdown
    newQueue.anyGroupsTypeAhead.click();
    newQueue.anyGroupsDropdownGroups.get(0).click();
    newQueue.anyGroupsAdd.click();
    expect(newQueue.anyGroupsSelected.count()).toBe(1);

    // Select Skill from 'All' query dropdown
    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsAdd.click();
    expect(newQueue.allSkillsSelected.count()).toBe(1);

    // Select Skill from 'Any' query dropdown
    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.get(0).click();
    newQueue.anySkillsAdd.click();
    expect(newQueue.anySkillsSelected.count()).toBe(1);

    // Remove skill from 'All'
    newQueue.allSkillsSelected.get(0).element(by.css('a')).click().then(function() {
      // Only the 'All' skill is removed
      expect(newQueue.allGroupsSelected.count()).toBe(1);
      expect(newQueue.anyGroupsSelected.count()).toBe(1);
      expect(newQueue.allSkillsSelected.count()).toBe(0);
      expect(newQueue.anySkillsSelected.count()).toBe(1);
    });
  });

  it('should remove skill from \'Any\' and leave other selected groups/skills', function() {
    shared.createBtn.click();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select group from 'All' query dropdown
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click();
    expect(newQueue.allGroupsSelected.count()).toBe(1);

    // Select Group from 'Any' query dropdown
    newQueue.anyGroupsTypeAhead.click();
    newQueue.anyGroupsDropdownGroups.get(0).click();
    newQueue.anyGroupsAdd.click();
    expect(newQueue.anyGroupsSelected.count()).toBe(1);

    // Select Skill from 'All' query dropdown
    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsAdd.click();
    expect(newQueue.allSkillsSelected.count()).toBe(1);

    // Select Skill from 'Any' query dropdown
    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.get(0).click();
    newQueue.anySkillsAdd.click();
    expect(newQueue.anySkillsSelected.count()).toBe(1);

    // Remove skill from 'Any'
    newQueue.anySkillsSelected.get(0).element(by.css('a')).click().then(function() {
      // Only the 'Any' skill is removed
      expect(newQueue.allGroupsSelected.count()).toBe(1);
      expect(newQueue.anyGroupsSelected.count()).toBe(1);
      expect(newQueue.allSkillsSelected.count()).toBe(1);
      expect(newQueue.anySkillsSelected.count()).toBe(0);
    });
  });

  it('should add all groups', function() {
    shared.createBtn.click();

    // Add Groups filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.count().then(function(groupCount) {
      for (var i = 0; i < groupCount; i++) {
        newQueue.allGroupsTypeAhead.click();
        newQueue.allGroupsDropdownGroups.get(0).click();
        newQueue.allGroupsAdd.click();
      }

      for (var j = 0; j < groupCount; j++) {
        newQueue.anyGroupsTypeAhead.click();
        newQueue.anyGroupsDropdownGroups.get(0).click();
        newQueue.anyGroupsAdd.click();
      }
      expect(newQueue.allGroupsSelected.count()).toBe(groupCount)
      expect(newQueue.anyGroupsSelected.count()).toBe(groupCount)
    });
  });

  it('should remove second group from All section', function() {
    var firstGroupName;

    shared.createBtn.click();

    // Add Groups filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select 2 groups from All section
    newQueue.allGroupsTypeAhead.click();
    firstGroupName = newQueue.allGroupsDropdownGroups.get(0).getText();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click();

    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click().then(function() {
      // Remove second group from each section
      newQueue.allGroupsSelected.get(1).element(by.css('a')).click().then(function() {
        // Second group is removed and first remains
        expect(newQueue.allGroupsSelected.count()).toBe(1);
        expect(newQueue.allGroupsSelected.get(0).getText()).toBe(firstGroupName);
      });
    });
  });

  it('should remove second group from Any section', function() {
    var firstGroupName;

    shared.createBtn.click();

    // Add Groups filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select 2 groups from Any section
    newQueue.anyGroupsTypeAhead.click();
    firstGroupName = newQueue.anyGroupsDropdownGroups.get(0).getText();
    newQueue.anyGroupsDropdownGroups.get(0).click();
    newQueue.anyGroupsAdd.click();

    newQueue.anyGroupsTypeAhead.click();
    newQueue.anyGroupsDropdownGroups.get(0).click();
    newQueue.anyGroupsAdd.click().then(function() {
      // Remove second group from each section
      newQueue.anyGroupsSelected.get(1).element(by.css('a')).click().then(function() {
        // Second group is removed and first remains
        expect(newQueue.anyGroupsSelected.count()).toBe(1);
        expect(newQueue.anyGroupsSelected.get(0).getText()).toBe(firstGroupName);
      });
    });
  });

  it('should remove second skill from All section', function() {
    var firstSkillName;

    shared.createBtn.click();

    // Add Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select 2 skills from All section
    newQueue.allSkillsTypeAhead.click();
    firstSkillName = newQueue.allSkillsDropdownSkills.get(0).getText();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsAdd.click();

    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsAdd.click().then(function() {
      // Remove second skill from each section
      newQueue.allSkillsSelected.get(1).element(by.css('a')).click().then(function() {
        // Second skill is removed and first remains
        expect(newQueue.allSkillsSelected.count()).toBe(1);
        expect(newQueue.allSkillsSelected.get(0).getText()).toBe(firstSkillName);
      });
    });
  });

  it('should remove second skill from Any section', function() {
    var firstSkillName;

    shared.createBtn.click();

    // Add Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select 2 skills from Any section
    newQueue.anySkillsTypeAhead.click();
    firstSkillName = newQueue.anySkillsDropdownSkills.get(0).getText();
    newQueue.anySkillsDropdownSkills.get(0).click();
    newQueue.anySkillsAdd.click();

    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.get(0).click();
    newQueue.anySkillsAdd.click().then(function() {
      // Remove second skill from each section
      newQueue.anySkillsSelected.get(1).element(by.css('a')).click().then(function() {
        // Second skill is removed and first remains
        expect(newQueue.anySkillsSelected.count()).toBe(1);
        expect(newQueue.anySkillsSelected.get(0).getText()).toBe(firstSkillName);
      });
    });
  });

  it('should add all skills', function() {
    shared.createBtn.click();

    // Add Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.count().then(function(skillCount) {
      for (var j = 0; j < skillCount; j++) {
        newQueue.anySkillsTypeAhead.click();
        newQueue.anySkillsDropdownSkills.get(0).click();
        newQueue.anySkillsAdd.click();
      }

      for (var i = 0; i < skillCount; i++) {
        newQueue.allSkillsTypeAhead.click();
        newQueue.allSkillsDropdownSkills.get(0).click();
        newQueue.allSkillsAdd.click();
      }

      expect(newQueue.allSkillsSelected.count()).toBe(skillCount);
      expect(newQueue.anySkillsSelected.count()).toBe(skillCount);
    });
  });

  it('should update advanced query when adding groups and skills', function() {
    shared.createBtn.click();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select group in All section
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click().then(function() {
      // Review Advanced Query
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toMatch(/\{:groups \(and \(and \{#uuid [^}]* true}\)\)}/);

      // Select Group in Any section
      newQueue.showBasicQueryLink.click();
      newQueue.anyGroupsTypeAhead.click();
      newQueue.anyGroupsDropdownGroups.get(0).click();
      newQueue.anyGroupsAdd.click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toMatch(/\{:groups \(and \(and \{#uuid [^}]* true}\) \(or \{#uuid [^}]* true\}\)\)}/);

      // Select Skill in All section
      newQueue.showBasicQueryLink.click();
      newQueue.allSkillsTypeAhead.click();
      newQueue.allSkillsDropdownSkills.get(0).click();
      newQueue.allSkillsAdd.click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toMatch(/\{:groups \(and \(and \{#uuid [^}]* true}\) \(or \{#uuid [^}]* true}\)\) :skills \(and \(and \{#uuid [^}]* \(.*\)}\)\)}/);

      // Select Skill in Any section
      newQueue.showBasicQueryLink.click();
      newQueue.anySkillsTypeAhead.click();
      newQueue.anySkillsDropdownSkills.get(0).click();
      newQueue.anySkillsAdd.click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toMatch(/\{:groups \(and \(and \{#uuid [^}]* true}\) \(or \{#uuid [^}]* true}\)\) :skills \(and \(and \{#uuid [^}]* \(.*\)}\) \(or \{#uuid [^}]* \(.*\)}\)\)}/);
    });
  });


  it('should update advanced query when altered', function() {
    shared.createBtn.click();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select group in All section
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click();

    // Select Group in Any section
    newQueue.anyGroupsTypeAhead.click();
    newQueue.anyGroupsDropdownGroups.get(0).click();
    newQueue.anyGroupsAdd.click();

    // Select Skill in All section
    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsAdd.click();

    // Select Skill in Any section
    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.get(0).click();
    newQueue.anySkillsAdd.click()

    // Remove Group in All section
    newQueue.allGroupsSelected.get(0).element(by.css('a')).click().then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toMatch(/\{:groups \(and \(or {#uuid [^}]* true}\)\) :skills \(and \(and \{#uuid [^}]* \(.*\)}\) \(or \{#uuid [^}]* \(.*\)}\)\)}/);

      // Remove Group in Any section
      newQueue.showBasicQueryLink.click();
      newQueue.anyGroupsSelected.get(0).element(by.css('a')).click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toMatch(/\{:skills \(and \(and \{#uuid [^}]* \(.*\)}\) \(or \{#uuid [^}]* \(.*\)}\)\)}/);

      // Remove Skill in All section
      newQueue.showBasicQueryLink.click();
      newQueue.allSkillsSelected.get(0).element(by.css('a')).click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toMatch(/\{:skills \(and \(or \{#uuid [^}]* \(.*\)}\)\)}/);

      // Remove Skill in Any section
      newQueue.showBasicQueryLink.click();
      newQueue.anySkillsSelected.get(0).element(by.css('a')).click();
    }).thenFinally(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toBe('{}');
    });
  });

  it('should be updated when advanced query is altered', function() {
    var updatedAdvancedQuery;
    shared.createBtn.click();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select group in All section
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click();

    // Select skill in All section
    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsAdd.click().then(function() {
      // One group selected in the 'All' section and none in the 'Any' section
      expect(newQueue.allGroupsSelected.count()).toBe(1);
      expect(newQueue.anyGroupsSelected.count()).toBe(0);

      // One skill selected in the 'All' section and none in the 'Any' section
      expect(newQueue.allSkillsSelected.count()).toBe(1);
      expect(newQueue.anySkillsSelected.count()).toBe(0);

      // Review Advanced Query
      newQueue.showAdvancedQueryLink.click();
      newQueue.advancedQueryFormField.getAttribute('value').then(function(advancedQuery) {
        // Change advanced query to have selections in the 'Any' section instead of 'All'
        // Replace 'and' with 'or'
        updatedAdvancedQuery = advancedQuery.replace(/\(and \{#/g, '(or {#');

        newQueue.advancedQueryFormField.clear();
        newQueue.advancedQueryFormField.sendKeys(updatedAdvancedQuery);
        newQueue.showBasicQueryLink.click().then(function() {
          // Basic Query builder is updated

          // One group selected in the 'Any' section and none in the 'All' section
          expect(newQueue.allGroupsSelected.count()).toBe(0);
          expect(newQueue.anyGroupsSelected.count()).toBe(1);
          // One skill selected in the 'Any' section and none in the 'All' section
          expect(newQueue.allSkillsSelected.count()).toBe(0);
          expect(newQueue.anySkillsSelected.count()).toBe(1);
        });
      });
    });
  });

  it('should be saved with new queue', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select group/skill in each section
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click();
    var allGroupName = newQueue.allGroupsSelected.get(0).getText();

    newQueue.anyGroupsTypeAhead.click();
    newQueue.anyGroupsDropdownGroups.get(0).click();
    newQueue.anyGroupsAdd.click();
    var anyGroupName = newQueue.anyGroupsSelected.get(0).getText();

    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsAdd.click();
    var allSkillName = newQueue.allSkillsSelected.get(0).getText();

    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.get(0).click();
    newQueue.anySkillsAdd.click();
    var anySkillName = newQueue.anySkillsSelected.get(0).getText();

    // Complete required queue fields
    queues.nameFormField.sendKeys('New Queue ' + randomQueue);
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.tableElements.count()).toBeGreaterThan(queueCount);

      // Wait for version table to show new version
      browser.driver.wait(function() {
        return queues.queueVersions.count().then(function(queueVersionCount) {
          return queueVersionCount == 1;
        });
      }, 5000).then(function() {
        // Verify all selected groups/skills are saved
        element(by.id("view-version-v1")).isDisplayed().then(function(versionDisplayed) {
          if (!versionDisplayed) {
            queues.queueVersions.get(0).click();
          }
        }).then(function() {
          expect(queues.basicQueryDetails.get(0).getText()).toContain('All of these groups:');
          expect(queues.basicQueryDetails.get(0).getText()).toContain('Any of these groups:');
          expect(queues.basicQueryDetails.get(0).getText()).toContain('All of these skills:');
          expect(queues.basicQueryDetails.get(0).getText()).toContain('Any of these skills:');
          expect(queues.basicQueryAllGroupDetails.get(0).getText()).toContain(allGroupName);
          expect(queues.basicQueryAnyGroupDetails.get(0).getText()).toContain(anyGroupName);
          expect(queues.basicQueryAllSkillDetails.get(0).getText()).toContain(allSkillName);
          expect(queues.basicQueryAnySkillDetails.get(0).getText()).toContain(anySkillName);
        });
      });
    });
  });

  it('should save advanced query with new queue', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    // Select group/skill in each section
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click();

    newQueue.anyGroupsTypeAhead.click();
    newQueue.anyGroupsDropdownGroups.get(0).click();
    newQueue.anyGroupsAdd.click();

    newQueue.allSkillsTypeAhead.click();
    newQueue.allSkillsDropdownSkills.get(0).click();
    newQueue.allSkillsAdd.click();

    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.get(0).click();
    newQueue.anySkillsAdd.click();

    newQueue.showAdvancedQueryLink.click();
    newQueue.advancedQueryFormField.getAttribute('value').then(function(advancedQuery) {

      // Complete required queue fields
      queues.nameFormField.sendKeys('New Queue ' + randomQueue);
      shared.submitFormBtn.click().then(function() {
        shared.waitForSuccess();
        expect(shared.tableElements.count()).toBeGreaterThan(queueCount);

        // Verify all selected groups/skills are saved
        expect(queues.advancedQueryFormField.get(0).getAttribute('value')).toBe(advancedQuery);
      });
    });
  });

  xit('should create queue without version when advanced query field is submited with an invalid query', function() {
    // TODO Update after TITAN2-3290
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    newQueue.showAdvancedQueryLink.click();
    newQueue.advancedQueryFormField.clear();
    newQueue.advancedQueryFormField.sendKeys('Not a valid query');

    // Complete required queue fields
    queues.nameFormField.sendKeys('New Queue ' + randomQueue);
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.waitForError();
      expect(shared.errorMessage.isDisplayed()).toBeTruthy();
      expect(shared.errorMessage.getText()).toContain("Sorry, the initial query for this queue was invalid. Please create a new query version.");

      expect(shared.tableElements.count()).toBeGreaterThan(queueCount);
      expect(queues.noVersionsMsg.isDisplayed()).toBeTruthy();

      // Add version and select as default
      queues.addNewVersionBtn.click();
      newVersion.createVersionBtn.click().then(function() {
        shared.waitForSuccess();
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        queues.activeVersionDropdown.all(by.css('option')).get(1).click();
        shared.submitFormBtn.click().then(function() {
          shared.waitForSuccess();
          expect(shared.successMessage.isDisplayed()).toBeTruthy();
        });
      });
    });
  });

});

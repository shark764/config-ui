'use strict';

describe('The basic query builder', function() {
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

  it('should add all groups', function() {
    shared.createBtn.click();

    queues.allGroupsTypeAhead.click();
    queues.allGroupsDropdownGroups.count().then(function(groupCount) {
      for (var i = 0; i < groupCount; i++) {
        queues.allGroupsDropdownSkills.get(0).click();
        queues.allGroupsTypeAhead.click();
      }

      for (var i = 0; i < groupCount; i++) {
        queues.anyGroupsDropdownGroups.get(0).click();
        queues.anyGroupsTypeAhead.click();
      }
      expect(queues.allGroupsSelected.count()).toBe(groupCount)
      expect(queues.anyGroupsSelected.count()).toBe(groupCount)
    });
  });

  it('should add all skills', function() {
    shared.createBtn.click();

    queues.allSkillsTypeAhead.click();
    queues.allSkillsDropdownSkills.count().then(function(skillCount) {
      for (var i = 0; i < skillCount; i++) {
        queues.allSkillsDropdownSkills.get(0).click();
        queues.allSkillsTypeAhead.click();
      }

      for (var i = 0; i < skillCount; i++) {
        queues.anySkillsDropdownSkills.get(0).click();
        queues.anySkillsTypeAhead.click();
      }
      expect(queues.allSkillsSelected.count()).toBe(skillCount)
      expect(queues.anySkillsSelected.count()).toBe(skillCount)
    });
  });

  it('should update advanced query when altered', function() {
    shared.createBtn.click();

    // Select group in All section
    queues.allGroupsTypeAhead.click();
    queues.allGroupsDropdownGroups.get(0).click();

    // Review Advanced Query
    queues.showAdvancedQueryLink.click();
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('{:groups (and (every #{');
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain('}) (some #{');

    // Select Group in Any section
    queues.showBasicQueryLink.click();
    queues.anyGroupsTypeAhead.click();
    queues.anyGroupsDropdownGroups.get(0).click();
    queues.showAdvancedQueryLink.click();
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('{:groups (and (every #{');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('}) (some #{');
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain(':skills (and (and {:');

    // Select Skill in All section
    queues.showBasicQueryLink.click();
    queues.allSkillsTypeAhead.click();
    queues.allSkillsDropdownSkills.get(0).click();
    queues.showAdvancedQueryLink.click();
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('{:groups (and (every #{');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('}) (some #{');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain(':skills (and (and {:');
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain('}) (some #{');

    // Select Skill in Any section
    queues.showBasicQueryLink.click();
    queues.anySkillsTypeAhead.click();
    queues.anySkillsDropdownSkills.get(0).click();
    queues.showAdvancedQueryLink.click();
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('{:groups (and (every #{');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('}) (some #{');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain(':skills (and (and {:');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('}) (or {:');

    // Remove Group in All section
    queues.showBasicQueryLink.click();
    queues.allGroupsSelected.get(0).element(by.css('a')).click();
    queues.showAdvancedQueryLink.click();
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain('every');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('{:groups (and (some #{');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain(':skills (and (and {:');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('}) (or {:');

    // Remove Group in Any section
    queues.showBasicQueryLink.click();
    queues.anyGroupsSelected.get(0).element(by.css('a')).click();
    queues.showAdvancedQueryLink.click();
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain('every');
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain('some');
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain('groups');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('{:skills (and (and {:');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('}) (or {:');

    // Remove Skill in All section
    queues.showBasicQueryLink.click();
    queues.allSkillsSelected.get(0).element(by.css('a')).click();
    queues.showAdvancedQueryLink.click();
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain('every');
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain('some');
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain('groups');
    expect(queues.advancedQueryFormField.getAttribute('value')).not.toContain('{:skills (and (and {:');
    expect(queues.advancedQueryFormField.getAttribute('value')).toContain('{:skills (and (or {:');

    // Remove Skill in Any section
    queues.showBasicQueryLink.click();
    queues.allSkillsSelected.get(0).element(by.css('a')).click();
    queues.showAdvancedQueryLink.click();
    expect(queues.advancedQueryFormField.getAttribute('value')).toBe('{}');
  });

  it('should be updated when advanced query is altered', function() {
    var updatedAdvancedQuery;
    shared.createBtn.click();

    // Select group in All section
    queues.allGroupsTypeAhead.click();
    queues.allGroupsDropdownGroups.get(0).click();

    // Select skill in All section
    queues.allSkillsTypeAhead.click();
    queues.allSkillsDropdownSkills.get(0).click();

    // One group selected in the 'All' section and none in the 'Any' section
    expect(queues.allGroupsSelected.count()).toBe(1);
    expect(queues.anyGroupsSelected.count()).toBe(0);

    // One skill selected in the 'All' section and none in the 'Any' section
    expect(queues.allSkillsSelected.count()).toBe(1);
    expect(queues.anySkillsSelected.count()).toBe(0);

    // Review Advanced Query
    queues.showAdvancedQueryLink.click();
    queues.advancedQueryFormField.getAttribute('value').then(function(advancedQuery) {
      // Change advanced query to have selections in the 'Any' section instead of 'All'
      // Replace 'every' with 'some'
      updatedAdvancedQuery = advancedQuery.replace('every', 'some');
      // Replace 'and' with 'or'
      updatedAdvancedQuery = updatedAdvancedQuery.replace('(and {:', '(or {:');

      queues.advancedQueryFormField.clear();
      queues.advancedQueryFormField.sendKeys(updatedAdvancedQuery);
      queues.showBasicQueryLink.click();

      // Basic Query builder is updated
      // One group selected in the 'Any' section and none in the 'All' section
      expect(queues.allGroupsDropdownGroups.count()).toBe(0);
      expect(queues.anyGroupsDropdownGroups.count()).toBe(1);
      // One skill selected in the 'Any' section and none in the 'All' section
      expect(queues.allSkillsSelected.count()).toBe(0);
      expect(queues.anySkillsSelected.count()).toBe(1);
    });
  });

  it('should be saved with new queue', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    // Select group/skill in each section
    queues.allGroupsTypeAhead.click();
    queues.allGroupsDropdownGroups.get(0).click();
    var allGroupName = allGroupsSelected.get(0).getText();

    queues.anyGroupsTypeAhead.click();
    queues.anyGroupsDropdownGroups.get(0).click();
    var anyGroupName = anyGroupsSelected.get(0).getText();

    queues.allSkillsTypeAhead.click();
    queues.allSkillsDropdownSkills.get(0).click();
    var allSkillName = allSkillsSelected.get(0).getText();

    queues.anySkillsTypeAhead.click();
    queues.anySkillsDropdownSkills.get(0).click();
    var anySkillName = anySkillsSelected.get(0).getText();

    // Complete required queue fields
    queues.nameFormField.sendKeys('New Queue ' + randomQueue);
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(queueCount);

      // Verify all selected groups/skills are saved
      expect(queues.basicQueryDetails.getText()).toBe('test');
      expect(queues.basicQueryDetails.getText()).toContain('All of these groups:');
      expect(queues.basicQueryDetails.getText()).toContain('Any of these groups:');
      expect(queues.basicQueryDetails.getText()).toContain('All of these skills:');
      expect(queues.basicQueryDetails.getText()).toContain('Any of these skills:');
      expect(queues.basicQueryDetails.getText()).toContain(allGroupName);
      expect(queues.basicQueryDetails.getText()).toContain(anyGroupName);
      expect(queues.basicQueryDetails.getText()).toContain(allSkillName);
      expect(queues.basicQueryDetails.getText()).toContain(anySkillName);
    });
  });

  it('should save advanced query with new queue', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

    // Select group/skill in each section
    queues.allGroupsTypeAhead.click();
    queues.allGroupsDropdownGroups.get(0).click();
    queues.anyGroupsTypeAhead.click();
    queues.anyGroupsDropdownGroups.get(0).click();
    queues.allSkillsTypeAhead.click();
    queues.allSkillsDropdownSkills.get(0).click();
    queues.anySkillsTypeAhead.click();
    queues.anySkillsDropdownSkills.get(0).click();

    queues.showAdvancedQueryLink.click();
    queues.advancedQueryFormField.getAttribute('value').then(function(advancedQuery) {

      // Complete required queue fields
      queues.nameFormField.sendKeys('New Queue ' + randomQueue);
      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
        expect(shared.tableElements.count()).toBeGreaterThan(queueCount);

        // Verify all selected groups/skills are saved
        expect(queues.advancedQueryFormField.getAttribute('value')).toBe(advancedQuery);
      });
    });
  });

  // verify skill proficiency selectors
  // saved skill proficiency
  // altered in advanced query

  // new version..?

});

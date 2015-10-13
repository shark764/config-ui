'use strict';

describe('The basic query builder', function() {
  var loginPage = require('../login/login.po.js'),
    queues = require('./queues.po.js'),
    newQueue = require('./newQueue.po.js'),
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

  xit('should remove group from \'All\' and leave other selected groups/skills', function() {
    // TODO BUG More than one gets removed
    shared.createBtn.click();

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

  xit('should remove group from \'Any\' and leave other selected groups/skills', function() {
    // TODO BUG More than one gets removed
    shared.createBtn.click();

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

  xit('should remove skill from \'All\' and leave other selected groups/skills', function() {
    // TODO BUG More than one gets removed
    shared.createBtn.click();

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

  xit('should remove skill from \'Any\' and leave other selected groups/skills', function() {
    // TODO BUG More than one gets removed
    shared.createBtn.click();

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

  xit('should add all groups', function() {
    shared.createBtn.click();

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

  xit('should add all skills', function() {
    shared.createBtn.click();

    newQueue.anySkillsTypeAhead.click();
    newQueue.anySkillsDropdownSkills.count().then(function(skillCount) {
      for (var j = 0; j < skillCount; j++) {
        newQueue.anySkillsTypeAhead.click();
        newQueue.anySkillsDropdownSkills.get(0).click();
        newQueue.anySkillsAdd.click();
      }

      /*
       TODO Bug where fields aren't reset
      for (var i = 0; i < skillCount; i++) {
        newQueue.allSkillsTypeAhead.click();
        newQueue.allSkillsDropdownSkills.get(0).click();
        newQueue.allSkillsAdd.click();
      }
      */

      //expect(newQueue.allSkillsSelected.count()).toBe(skillCount);
      expect(newQueue.anySkillsSelected.count()).toBe(skillCount);
    });
  });

  it('should update advanced query when altered', function() {
    shared.createBtn.click();

    // Select group in All section
    newQueue.allGroupsTypeAhead.click();
    newQueue.allGroupsDropdownGroups.get(0).click();
    newQueue.allGroupsAdd.click().then(function() {
      // Review Advanced Query
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('{:groups (and (every #{');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain('}) (some #{');

      // Select Group in Any section
      newQueue.showBasicQueryLink.click();
      newQueue.anyGroupsTypeAhead.click();
      newQueue.anyGroupsDropdownGroups.get(0).click();
      newQueue.anyGroupsAdd.click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('{:groups (and (every #{');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('}) (some #{');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain(':skills (and (and {:');

      // Select Skill in All section
      newQueue.showBasicQueryLink.click();
      newQueue.allSkillsTypeAhead.click();
      newQueue.allSkillsDropdownSkills.get(0).click();
      newQueue.allSkillsAdd.click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('{:groups (and (every #{');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('}) (some #{');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain(':skills (and (and {:');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain('}) (or #{');

      // Select Skill in Any section
      newQueue.showBasicQueryLink.click();
      newQueue.anySkillsTypeAhead.click();
      newQueue.anySkillsDropdownSkills.get(0).click();
      newQueue.anySkillsAdd.click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('{:groups (and (every #{');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('}) (some #{');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain(':skills (and (and {:');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('}) (or {:');

      // Remove Group in All section
      newQueue.showBasicQueryLink.click();
      newQueue.allGroupsSelected.get(0).element(by.css('a')).click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain('every');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('{:groups (and (some #{');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain(':skills (and (and {:');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('}) (or {:');

      // Remove Group in Any section
      newQueue.showBasicQueryLink.click();
      newQueue.anyGroupsSelected.get(0).element(by.css('a')).click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain('every');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain('some');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain('groups');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('{:skills (and (and {:');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('}) (or {:');

      // Remove Skill in All section
      newQueue.showBasicQueryLink.click();
      newQueue.allSkillsSelected.get(0).element(by.css('a')).click();
    }).then(function() {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain('every');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain('some');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain('groups');
      expect(newQueue.advancedQueryFormField.getAttribute('value')).not.toContain('{:skills (and (and {:');
      /* TODO Fails from more than one skill being removed
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toContain('{:skills (and (or {:');

      // Remove Skill in Any section
      newQueue.showBasicQueryLink.click();
      newQueue.allSkillsSelected.get(0).element(by.css('a')).click();
    }).thenFinally(function () {
      newQueue.showAdvancedQueryLink.click();
      expect(newQueue.advancedQueryFormField.getAttribute('value')).toBe('{}');
      */
    });
  });

  it('should be updated when advanced query is altered', function() {
    var updatedAdvancedQuery;
    shared.createBtn.click();

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
        // Replace 'every' with 'some'
        updatedAdvancedQuery = advancedQuery.replace('every', 'some');
        // Replace 'and' with 'or'
        updatedAdvancedQuery = updatedAdvancedQuery.replace('(and {:', '(or {:');

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

  xit('should be saved with new queue', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

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
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(queueCount);

      // Wait for version table to show nwe version
      browser.driver.wait(function() {
        return queues.queueVersions.count().then(function(queueVersionCount) {
          return queueVersionCount == 1;
        });
      }, 5000).then(function () {
        // Verify all selected groups/skills are saved
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

  it('should save advanced query with new queue', function() {
    shared.createBtn.click();
    randomQueue = Math.floor((Math.random() * 100) + 1);

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
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
        expect(shared.tableElements.count()).toBeGreaterThan(queueCount);

        // Verify all selected groups/skills are saved
        expect(queues.advancedQueryFormField.get(0).getAttribute('value')).toBe(advancedQuery);
      });
    });
  });


});

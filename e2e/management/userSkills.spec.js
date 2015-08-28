'use strict';

describe('The user skills component of User view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    skills = require('./skills.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.usersPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  xit('should add to the skill count for a user', function() {
    //Create a new user
    shared.createBtn.click();
    var randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserFirstName = 'First ' + randomUser;
    users.firstNameFormField.sendKeys(newUserFirstName);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.passwordFormField.sendKeys('password');

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Add a skill to the new user
      shared.searchField.sendKeys(newUserFirstName);
      shared.firstTableRow.click();
      users.addSkillSearch.click();
      users.skillDropdownItems.get(0).click();

      users.addSkillSearch.getAttribute('value').then(function(newUserSkill) {
        users.addSkillBtn.click();

        //Verify that the users skill count has increased and the new skill is displayed
        expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toBe('1');
        expect(users.userSkills.count()).toBe(1);
        expect(users.userSkills.get(0).getText()).toBe(newUserSkill);
      });
    });
  });

  it('should add skill with proficiency', function() {
    //Create a new skill
    browser.get(shared.skillsPageUrl);
    shared.createBtn.click();
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name ' + randomSkill;
    skills.nameFormField.sendKeys(newSkillName);
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Assign a user to it
      browser.get(shared.usersPageUrl);
      shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
      shared.firstTableRow.click();
      var selectedUserName = users.userNameDetailsHeader.getText();
      users.addSkillSearch.sendKeys(newSkillName);
      expect(users.skillProficiency.isDisplayed()).toBeTruthy();
      users.skillProficiency.sendKeys('50');
      users.addSkillBtn.click().then(function () {
        // Skill is added with proficiency
        var skillAdded = false;
        users.userSkillTableRows.each(function(currentUserSkill) {
          currentUserSkill.getText().then(function (currentSkill) {
            if (currentSkill.indexOf(newSkillName) > -1) {
              skillAdded = true;
              expect(currentSkill).toContain('50');
            }
          });
        }).thenFinally(function() {
          // Verify new skill was found
          expect(skillAdded).toBeTruthy();
        });
      });
    });
  });

  it('should add skill with default proficiency', function() {
    //Create a new skill
    browser.get(shared.skillsPageUrl);
    shared.createBtn.click();
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name ' + randomSkill;
    skills.nameFormField.sendKeys(newSkillName);
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Assign a user to it
      browser.get(shared.usersPageUrl);
      shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
      shared.firstTableRow.click();
      var selectedUserName = users.userNameDetailsHeader.getText();
      users.addSkillSearch.sendKeys(newSkillName);
      expect(users.skillProficiency.isDisplayed()).toBeTruthy();

      users.addSkillBtn.click().then(function () {
        // Skill is added with proficiency
        var skillAdded = false;
        users.userSkillTableRows.each(function(currentUserSkill) {
          currentUserSkill.getText().then(function (currentSkill) {
            if (currentSkill.indexOf(newSkillName) > -1) {
              skillAdded = true;
              expect(currentSkill).toContain('1');
            }
          });
        }).thenFinally(function() {
          // Verify new skill was found
          expect(skillAdded).toBeTruthy();
        });
      });
    });
  });

  it('should add skill without proficiency', function() {
    //Create a new skill
    browser.get(shared.skillsPageUrl);
    shared.createBtn.click();
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name ' + randomSkill;
    skills.nameFormField.sendKeys(newSkillName);
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Assign a user to it
      browser.get(shared.usersPageUrl);
      shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
      shared.firstTableRow.click();
      var selectedUserName = users.userNameDetailsHeader.getText();
      users.addSkillSearch.sendKeys(newSkillName);
      expect(users.skillProficiency.isPresent()).toBeFalsy();

      users.addSkillBtn.click().then(function () {
        // Skill is added with proficiency
        var skillAdded = false;
        users.userSkillTableRows.each(function(currentUserSkill) {
          currentUserSkill.getText().then(function (currentSkill) {
            if (currentSkill.indexOf(newSkillName) > -1) {
              skillAdded = true;
              expect(currentSkill).toContain('-');
            }
          });
        }).thenFinally(function() {
          // Verify new skill was found
          expect(skillAdded).toBeTruthy();
        });
      });
    });
  });

  it('should accept skill proficiency from 1-100', function() {
    //Create a new skill
    browser.get(shared.skillsPageUrl);
    shared.createBtn.click();
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name ' + randomSkill;
    skills.nameFormField.sendKeys(newSkillName);
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Assign a user to it
      browser.get(shared.usersPageUrl);
      shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
      shared.firstTableRow.click();
      var selectedUserName = users.userNameDetailsHeader.getText();
      users.addSkillSearch.sendKeys(newSkillName);
      expect(users.skillProficiency.isDisplayed()).toBeTruthy();

      // Decrement proficiency counter to Minimum
      users.proficiencyCounterDown.click();
      expect(users.skillProficiency.getAttribute('value')).toBe('0');
      expect(users.proficiencyCounterDown.getAttribute('class')).toContain('disabled');
      expect(users.proficiencyCounterUp.getAttribute('class')).not.toContain('disabled');

      // Increment proficiency counter
      users.proficiencyCounterUp.click();
      expect(users.skillProficiency.getAttribute('value')).toBe('1');
      expect(users.proficiencyCounterDown.getAttribute('class')).not.toContain('disabled');
      expect(users.proficiencyCounterUp.getAttribute('class')).not.toContain('disabled');

      // Increment proficiency counter to max
      users.skillProficiency.clear();
      users.skillProficiency.sendKeys('99');
      users.proficiencyCounterUp.click();
      expect(users.skillProficiency.getAttribute('value')).toBe('100');
      expect(users.proficiencyCounterDown.getAttribute('class')).not.toContain('disabled');
      expect(users.proficiencyCounterUp.getAttribute('class')).toContain('disabled');

      // Decrement proficiency counter
      users.proficiencyCounterDown.click();
      expect(users.skillProficiency.getAttribute('value')).toBe('99');
      expect(users.proficiencyCounterDown.getAttribute('class')).not.toContain('disabled');
      expect(users.proficiencyCounterUp.getAttribute('class')).not.toContain('disabled');
    });
  });

  it('should create new skill and add user', function() {
    shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
    shared.firstTableRow.click();
    var previousUserSkillCount = users.userSkills.count();

    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name from User Page ' + randomSkill;

    //Assign a user to a skill that doesn't exist
    var selectedUserName = users.userNameDetailsHeader.getText();
    users.addSkillSearch.sendKeys(newSkillName);
    users.addSkillBtn.click();

    expect(users.userSkills.count()).toBeGreaterThan(previousUserSkillCount);

    //View the skill page
    browser.get(shared.skillsPageUrl);
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click(); // skill exists

    expect(skills.nameHeader.getText()).toBe(newSkillName);
    expect(skills.proficiencySwitch.isSelected()).toBeFalsy();
  });

  it('should create new skill with proficiency and add user', function() {
    shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
    shared.firstTableRow.click();
    var previousUserSkillCount = users.userSkills.count();

    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name from User Page ' + randomSkill;

    //Assign a user to a skill that doesn't exist
    var selectedUserName = users.userNameDetailsHeader.getText();
    users.addSkillSearch.sendKeys(newSkillName);
    users.skillProficiency.sendKeys(50);
    users.addSkillBtn.click();

    expect(users.userSkills.count()).toBeGreaterThan(previousUserSkillCount);

    //View the skill page
    browser.get(shared.skillsPageUrl);
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click(); // skill exists

    expect(skills.nameHeader.getText()).toBe(newSkillName);
    expect(skills.proficiencySwitch.isSelected()).toBeTruthy();
  });

  it('should update skill count when removing a user skill', function() {
    shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
    shared.firstTableRow.click();

    //Add a skill to the user
    users.addSkillSearch.click();
    users.skillDropdownItems.get(0).click();
    users.addSkillSearch.getAttribute('value').then(function(newUserSkill) {
      users.addSkillBtn.click();

      // Remove all user Skills
      users.userSkillTableRows.count().then(function(userSkillCount) {
        for (var i = 0; i < userSkillCount; i++) {
          users.userSkillTableRows.get(0).element(by.css('i')).click();
        }
      }).then(function() {
        expect(users.userSkills.count()).toBe(0);
        expect(users.noUserSkillsMessage.isDisplayed()).toBeTruthy();
        expect(users.noUserSkillsMessage.getText()).toBe('This user has not been assigned any skills');
        // TODO
        //expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toEqual('0');
      });
    });
  });

  it('should update skill proficiency when re-adding existing skill', function() {
    shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
    shared.firstTableRow.click();
    var previousUserSkillCount = users.userSkills.count();

    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name from User Page ' + randomSkill;
    var skillAdded = 0;

    //Add skill that doesn't exist with proficiency
    users.addSkillSearch.sendKeys(newSkillName);
    users.skillProficiency.sendKeys(50);
    users.addSkillBtn.click().then(function () {
      // Skill is added with proficiency
      users.userSkillTableRows.each(function(currentUserSkill) {
        currentUserSkill.getText().then(function (currentSkill) {
          if (currentSkill.indexOf(newSkillName) > -1) {
            skillAdded = skillAdded + 1;
            expect(currentSkill).toContain('50');
          }
        });
      }).thenFinally(function() {
        // Verify new skill was found
        expect(skillAdded).toBe(1);
      });
    }).then(function () {
      skillAdded = 0;
      expect(users.userSkills.count()).toBeGreaterThan(previousUserSkillCount);

      previousUserSkillCount = users.userSkills.count();

      // Readd the same Skill with a different proficiency
      users.addSkillSearch.sendKeys(newSkillName);
      users.skillProficiency.sendKeys(25);
      users.addSkillBtn.click().then(function () {
        // Skill is updated with new proficiency
        users.userSkillTableRows.each(function(currentUserSkill) {
          currentUserSkill.getText().then(function (currentSkill) {
            if (currentSkill.indexOf(newSkillName) > -1) {
              skillAdded = skillAdded + 1;
              expect(currentSkill).toContain('25');
            }
          });
        }).thenFinally(function() {
          // Verify new skill was found
          expect(skillAdded).toBe(1); // Skill only found once
          expect(users.userSkills.count()).toBe(previousUserSkillCount);
        });
      });
    });
  });

  it('should include the correct number of Skill elements', function() {
    shared.firstTableRow.click();

    // Get list of Skills
    var totalSkills = 0;

    users.addSkillSearch.click();
    users.skillDropdownItems.count().then(function(skillListCount) {
      totalSkills = skillListCount;
    }).thenFinally(function() {
      browser.get(shared.skillsPageUrl);

      // Skill list on should contain the same number of skill records
      expect(shared.tableElements.count()).toBe(totalSkills);
    });
  });

  it('should list each existing Skill', function() {
    shared.firstTableRow.click();
    users.addSkillSearch.click();

    // Get list of Skills
    var skillNameList = [];
    users.skillDropdownItems.each(function(skillElement, index) {
      skillElement.getText().then(function(skillName) {
        skillNameList.push(skillName);
      });
    }).then(function() {
      browser.get(shared.skillsPageUrl);

      // Skill list on Users page should contain each of the same Skill records
      for (var i = 0; i < skillNameList.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(skillNameList[i]);
        expect(shared.tableElements.get(0).getText()).toContain(skillNameList[i]);
      }
    });
  });

  it('should search list of all existing Skills by Skill name', function() {
    browser.get(shared.skillsPageUrl);

    // Get list of skills from Skill page
    var skillNameList = [];
    shared.tableElements.each(function(skillElement, index) {
      skillElement.getText().then(function(skillName) {
        skillNameList.push(skillName);
      });
    }).then(function() {
      browser.get(shared.usersPageUrl);
      shared.firstTableRow.click();

      // Remove all user Skills
      users.userSkills.each(function(currentUserSkill) {
        currentUserSkill.element(by.css('i')).click();
      });

      users.addSkillSearch.click();
      expect(users.skillDropdownItems.count()).toBe(skillNameList.length);

      // Search Skills for each skill element
      for (var i = 0; i < skillNameList.length; i++) {
        expect(skillNameList[i]).toContain(users.skillDropdownItems.get(i).getText());
      }
    });
  });
});
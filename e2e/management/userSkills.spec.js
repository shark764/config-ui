'use strict';

describe('The user skills component of User view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    skills = require('./skills.po.js'),
    params = browser.params,
    newSkillName;

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
  // TODO User group count TITAN2-4533

  xit('should add to the skill count for a user', function() {
    //Create a new user
    shared.createBtn.click();
    var randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserFirstName = 'First ' + randomUser;

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys(newUserFirstName);
    users.lastNameFormField.sendKeys('Last ' + randomUser);

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Add a skill to the new user
      shared.searchField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
      shared.firstTableRow.click();
      users.addSkillSearch.click();
      users.skillDropdownItems.get(0).click();

      users.addSkillSearch.getAttribute('value').then(function(newUserSkill) {
        users.addSkillBtn.click();

        //Verify that the users skill count has increased and the new skill is displayed
        expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toBe('1');
        expect(users.userSkills.count()).toBe(1);
        expect(users.userSkills.get(0).getText()).toContain(newUserSkill);
      });
    });
  });

  xit('should add skill with proficiency', function() {
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
      shared.firstTableRow.click();

      users.addSkillSearch.sendKeys(newSkillName);
      expect(users.skillProficiency.isDisplayed()).toBeTruthy();
      users.skillProficiency.sendKeys('50');

      var skillAdded = false;
      users.addSkillBtn.click().then(function() {
        // Skill is added with proficiency
        users.userSkillTableRows.each(function(currentUserSkill) {
          currentUserSkill.getText().then(function(currentSkill) {
            if (currentSkill.indexOf(newSkillName) > -1) {
              skillAdded = true;
              expect(currentUserSkill.element(by.model(users.editSkillProficiency)).getAttribute('value')).toBe('50');
            }
          });
        }).thenFinally(function() {
          // Verify new skill was found
          expect(skillAdded).toBeTruthy();
        });
      });
    });
  });

  xit('should add skill with default proficiency', function() {
    //Create a new skill
    browser.get(shared.skillsPageUrl);
    shared.createBtn.click();
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name ' + randomSkill;
    skills.nameFormField.sendKeys(newSkillName);
    skills.proficiencyFormCheckbox.click().then(function() {
      shared.submitFormBtn.click().then(function() {
        shared.waitForSuccess();
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        //Assign a user to it
        browser.get(shared.usersPageUrl);
        shared.firstTableRow.click();
        users.addSkillSearch.sendKeys(newSkillName);
        expect(users.skillProficiency.isDisplayed()).toBeTruthy();

        var skillAdded = false;
        users.addSkillBtn.click().then(function() {
          // Skill is added with proficiency
          users.userSkillTableRows.each(function(currentUserSkill) {
            currentUserSkill.getText().then(function(currentSkill) {
              if (currentSkill.indexOf(newSkillName) > -1) {
                skillAdded = true;
                expect(currentUserSkill.element(by.model(users.editSkillProficiency)).getAttribute('value')).toBe('1');
              }
            });
          }).thenFinally(function() {
            // Verify new skill was found
            expect(skillAdded).toBeTruthy();
          });
        });
      });
    });
  });

  xit('should add skill without proficiency', function() {
    //Create a new skill
    browser.get(shared.skillsPageUrl);
    shared.createBtn.click();
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name ' + randomSkill;
    skills.nameFormField.sendKeys(newSkillName);
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Assign a user to it
      browser.get(shared.usersPageUrl);
      shared.firstTableRow.click();
      users.addSkillSearch.sendKeys(newSkillName + '\t');

      var skillAdded = false;
      users.addSkillBtn.click().then(function() {
        // Skill is added with proficiency
        users.userSkillTableRows.each(function(currentUserSkill) {
          currentUserSkill.getText().then(function(currentSkill) {
            if (currentSkill.indexOf(newSkillName) > -1) {
              skillAdded = true;
              expect(currentUserSkill.element(by.model(users.editSkillProficiency)).isDisplayed()).toBeFalsy();
            }
          });
        }).thenFinally(function() {
          // Verify new skill was found
          expect(skillAdded).toBeTruthy();
        });
      });
    });
  });

  xit('should validate skill proficiency based on minimum', function() {
    //Create a new skill
    browser.get(shared.skillsPageUrl);
    shared.createBtn.click();
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    newSkillName = 'Skill Name ' + randomSkill;
    skills.nameFormField.sendKeys(newSkillName);
    skills.proficiencyFormCheckbox.click().then(function() {
      shared.submitFormBtn.click().then(function() {
        shared.waitForSuccess();
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        //Assign a user to it
        browser.get(shared.usersPageUrl);
        shared.firstTableRow.click();
        var selectedUserName = users.userNameDetailsHeader.getText();
        users.addSkillSearch.sendKeys(newSkillName);
        expect(users.skillProficiency.isDisplayed()).toBeTruthy();

        // Set proficiency below Minimum
        users.skillProficiency.clear();
        users.skillProficiency.sendKeys(0);
        expect(users.skillProficiency.get(0).getAttribute('value')).toBe('1');
        expect(users.proficiencyCounterDown.getAttribute('class')).toContain('disabled');
        expect(users.proficiencyCounterUp.getAttribute('class')).not.toContain('disabled');

        // Decrement proficiency counter to Minimum
        users.proficiencyCounterDown.click();
        expect(users.skillProficiency.get(0).getAttribute('value')).toBe('1');
        expect(users.proficiencyCounterDown.getAttribute('class')).toContain('disabled');
        expect(users.proficiencyCounterUp.getAttribute('class')).not.toContain('disabled');

        // Increment proficiency counter
        users.proficiencyCounterUp.click();
        expect(users.skillProficiency.get(0).getAttribute('value')).toBe('2');
        expect(users.proficiencyCounterDown.getAttribute('class')).not.toContain('disabled');
        expect(users.proficiencyCounterUp.getAttribute('class')).not.toContain('disabled');
      });
    });
  });

  xit('should validate skill proficiency based on maximum', function() {
    // Uses skill from previous test
    // Assign a user to it
    browser.get(shared.usersPageUrl);
    shared.secondTableRow.click();
    var selectedUserName = users.userNameDetailsHeader.getText();
    users.addSkillSearch.sendKeys(newSkillName);
    expect(users.skillProficiency.isDisplayed()).toBeTruthy();

    // Increment proficiency counter to max
    users.skillProficiency.clear();
    users.skillProficiency.sendKeys('99');
    users.proficiencyCounterUp.click();
    expect(users.skillProficiency.get(0).getAttribute('value')).toBe('100');
    expect(users.proficiencyCounterDown.getAttribute('class')).not.toContain('disabled');
    expect(users.proficiencyCounterUp.getAttribute('class')).toContain('disabled');

    // Decrement proficiency counter
    users.proficiencyCounterDown.click();
    expect(users.skillProficiency.get(0).getAttribute('value')).toBe('99');
    expect(users.proficiencyCounterDown.getAttribute('class')).not.toContain('disabled');
    expect(users.proficiencyCounterUp.getAttribute('class')).not.toContain('disabled');

    // Set proficiency above max
    users.skillProficiency.clear();
    users.skillProficiency.sendKeys('101');
    users.proficiencyCounterUp.click();
    expect(users.skillProficiency.get(0).getAttribute('value')).toBe('100');
    expect(users.proficiencyCounterDown.getAttribute('class')).not.toContain('disabled');
    expect(users.proficiencyCounterUp.getAttribute('class')).toContain('disabled');
  });

  xit('should create new skill and add to user', function() {
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

  xit('should create new skill and add to user after pressing Enter key', function() {
    shared.firstTableRow.click();
    var previousUserSkillCount = users.userSkills.count();

    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name from User Page ' + randomSkill;

    //Assign a user to a skill that doesn't exist
    var selectedUserName = users.userNameDetailsHeader.getText();
    users.addSkillSearch.sendKeys(newSkillName);

    // Send Enter key instead of pressing Add button
    users.addSkillSearch.sendKeys(protractor.Key.ENTER);

    expect(users.userSkills.count()).toBeGreaterThan(previousUserSkillCount);

    //View the skill page
    browser.get(shared.skillsPageUrl);
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click(); // skill exists

    expect(skills.nameHeader.getText()).toBe(newSkillName);
    expect(skills.proficiencySwitch.isSelected()).toBeFalsy();
  });

  xit('should create new skill with proficiency and add to user', function() {
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

  xit('should update skill count when removing a user skill', function() {
    shared.firstTableRow.click();

    //Add a skill to the user
    users.addSkillSearch.click();
    users.skillDropdownItems.get(0).click();
    users.addSkillSearch.getAttribute('value').then(function(newUserSkill) {
      users.addSkillBtn.click();

      // Remove all user Skills
      users.userSkillTableRows.count().then(function(userSkillCount) {
        for (var i = 1; i <= userSkillCount; i++) {
          users.userSkillTableRows.get(userSkillCount - i).element(by.css('i')).click();
          shared.waitForSuccess();
          shared.closeMessageBtn.click();
        }
      }).then(function() {
        expect(users.userSkills.count()).toBe(0);
        expect(users.noUserSkillsMessage.isDisplayed()).toBeTruthy();
        expect(users.noUserSkillsMessage.getText()).toBe('This user has not been assigned any skills');
        expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toEqual('0');
      });
    });
  });

  xit('should allow the user to be added to each skill once', function() {
    // Create a new user
    shared.createBtn.click();
    var randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserName = 'First ' + randomUser + ' Last ' + randomUser;

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.platformRoleFormDropdownOptions.get(1).click();
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();

    users.firstNameFormField.sendKeys('First ' + randomUser);
    users.lastNameFormField.sendKeys('Last ' + randomUser);

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      shared.searchField.sendKeys('titantest' + randomUser + '@mailinator.com');
      users.addSkillSearch.click();

      users.skillDropdownItems.count().then(function(skillCount) {
        // In turn, add each skill to the current user
        for (var i = 0; i < skillCount; i++) {
          users.skillDropdownItems.get(0).click(); // Skills are removed from the dropdown as they are added to the user
          users.addSkillBtn.click();
          users.addSkillSearch.click();
        }
      }).then(function() {
        users.addSkillSearch.click();
        users.userSkills.count().then(function(userSkillCount) {
          expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toBe(userSkillCount.toString())

          // No more existing skills to add to user
          users.addSkillSearch.click();
          expect(users.skillDropdownItems.count()).toBe(0);
        });
      });
    });
  });

  xit('should include the correct number of Skill elements', function() {
    shared.firstTableRow.click();

    // Get list of Skills
    var totalSkills = 0;

    // Get skills not assigned to the current user
    users.addSkillSearch.click();
    users.skillDropdownItems.count().then(function(skillListCount) {
      totalSkills = skillListCount;
    }).then(function() {
      users.userSkills.count().then(function(userSkillsCount) {
        totalSkills = totalSkills + userSkillsCount;
      });
    }).thenFinally(function() {
      browser.get(shared.skillsPageUrl);

      // Skill list on should contain the same number of skill records
      expect(shared.tableElements.count()).toBe(totalSkills);
    });
  });

  xit('should list each existing Skill not assigned to the user', function() {
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
      expect(shared.tableElements.count()).toBe(skillNameList.length);
    });
  });

  xit('should list each existing Skill assigned to the user', function() {
    shared.firstTableRow.click();

    // Get list of Skills
    var skillNameList = [];
    users.userSkills.each(function(skillElement, index) {
      skillElement.getText().then(function(skillName) {
        skillNameList.push(skillName);
      });
    }).then(function() {
      browser.get(shared.skillsPageUrl);

      // Skill list on Users page should contain each of the same Skill records
      for (var i = 0; i < skillNameList.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(skillNameList[i]);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    });
  });

  xit('should search list of all existing Skills by Skill name', function() {
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

      shared.firstTableRow.element(by.css(users.skillsColumn)).getText().then(function(userSkillCountColumn) {
        if (userSkillCountColumn != '0') {
          browser.driver.wait(function() {
            return users.userSkills.count().then(function(userSkillCount) {
              return userSkillCount;
            });
          }, 5000);
        }
      }).then(function() {
        // Remove all user Skills
        users.userSkills.count().then(function(userSkillCount) {
          for (var i = 1; i <= userSkillCount; i++) {
            users.userSkillTableRows.get(userSkillCount - i).element(by.css('i')).click();
            shared.waitForSuccess();
          }
        }).then(function() {
          users.addSkillSearch.click();
          expect(users.skillDropdownItems.count()).toBe(skillNameList.length);
        });
      });
    });
  });

  xit('should update skill count when adding and removing a user skill', function() {
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    shared.firstTableRow.click();

    shared.firstTableRow.element(by.css(users.skillsColumn)).getText().then(function(userSkillCount) {
      // Add a skill to the user
      users.addSkillSearch.click();
      users.addSkillSearch.sendKeys('New Skill ' + randomSkill);
      users.addSkillBtn.click();
      expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toEqual(parseInt(userSkillCount) + 1 + '');

      // Remove a user Skill
      users.userSkillTableRows.get(0).element(by.css('i')).click();
      expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toEqual(userSkillCount);
    });
  });

  xit('should edit skill proficiency', function() {
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    shared.firstTableRow.click();
    users.addSkillSearch.sendKeys('New Skill ' + randomSkill);
    users.addSkill.click();

    users.userSkillTableRows.each(function(currentUserSkill) {
      currentUserSkill.getText().then(function(currentSkill) {
        if (currentSkill.indexOf('New Skill ' + randomSkill) > -1) {
          // Verify skill proficiency validation
          expect(currentUserSkill.element(by.model(users.editSkillProficiency)).isDisplayed()).toBeTruthy();
          expect(currentUserSkill.element(by.model(users.editSkillProficiency)).getAttribute('value')).toBe('1');
          expect(users.editProficiencySave.isDisplayed()).toBeFalsy();
          expect(users.editProficiencyCancel.isDisplayed()).toBeFalsy();

          currentUserSkill.element(by.model(users.editSkillProficiency)).click();
          expect(currentUserSkill.element(by.css(users.editCounterUp)).isDisplayed()).toBeTruthy();
          expect(currentUserSkill.element(by.css(users.editCounterDown)).isDisplayed()).toBeTruthy();

          // Increment proficiency counter to max
          currentUserSkill.element(by.model(users.editSkillProficiency)).clear();
          expect(users.editProficiencySave.isDisplayed()).toBeTruthy();
          expect(users.editProficiencyCancel.isDisplayed()).toBeTruthy();

          currentUserSkill.element(by.model(users.editSkillProficiency)).sendKeys('55');
          users.editProficiencySave.click();

          expect(shared.successMessage.isDisplayed()).toBeTruthy();
          expect(currentUserSkill.element(by.model(users.editSkillProficiency)).getAttribute('value')).toBe('55');
        }
      });
    });
  });

  xit('should valid skill proficiency when editing', function() {
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    shared.firstTableRow.click();
    users.addSkillSearch.sendKeys('New Skill ' + randomSkill);
    users.addSkill.click();

    users.userSkillTableRows.each(function(currentUserSkill) {
      currentUserSkill.getText().then(function(currentSkill) {
        if (currentSkill.indexOf('New Skill ' + randomSkill) > -1) {
          // Verify skill proficiency validation
          currentUserSkill.element(by.model(users.editSkillProficiency)).click();

          // Set proficiency below Minimum
          currentUserSkill.element(by.model(users.editSkillProficiency)).clear();
          expect(users.editProficiencySave.isEnabled()).toBeFalsy();
          expect(users.editProficiencyCancel.isEnabled()).toBeTruthy();

          currentUserSkill.element(by.model(users.editSkillProficiency)).sendKeys(0);
          expect(users.editProficiencySave.isEnabled()).toBeFalsy();

          // Decrement proficiency counter to Minimum
          currentUserSkill.element(by.model(users.editSkillProficiency)).clear();
          currentUserSkill.element(by.model(users.editSkillProficiency)).sendKeys(1);
          currentUserSkill.element(by.css(users.editCounterDown)).click();
          expect(users.skillProficiency.getAttribute('value')).toBe('1');
          expect(users.editProficiencySave.isEnabled()).toBeTruthy();

          // Increment proficiency counter
          currentUserSkill.element(by.css(users.editCounterUp)).click();
          expect(currentUserSkill.element(by.model(users.editSkillProficiency)).getAttribute('value')).toBe('2');
          expect(users.editProficiencySave.isEnabled()).toBeTruthy();

          // Increment proficiency counter to max
          currentUserSkill.element(by.model(users.editSkillProficiency)).clear();
          currentUserSkill.element(by.model(users.editSkillProficiency)).sendKeys('99');
          expect(users.editProficiencySave.isEnabled()).toBeTruthy();

          currentUserSkill.element(by.css(users.editCounterUp)).click();
          expect(currentUserSkill.element(by.model(users.editSkillProficiency)).getAttribute('value')).toBe('100');
          expect(users.editProficiencySave.isEnabled()).toBeTruthy();

          // Decrement proficiency counter
          currentUserSkill.element(by.css(users.editCounterDown)).click();
          expect(currentUserSkill.element(by.model(users.editSkillProficiency)).getAttribute('value')).toBe('99');
          expect(users.editProficiencySave.isEnabled()).toBeTruthy();

          // Set proficiency above max
          currentUserSkill.element(by.model(users.editSkillProficiency)).clear();
          currentUserSkill.element(by.model(users.editSkillProficiency)).sendKeys('101');
          expect(users.editProficiencySave.isEnabled()).toBeFalsy();

          currentUserSkill.element(by.css(users.editCounterDown)).click();
          currentUserSkill.element(by.css(users.editCounterUp)).click();
          expect(currentUserSkill.element(by.model(users.editSkillProficiency)).getAttribute('value')).toBe('100');
          expect(users.editProficiencySave.isEnabled()).toBeTruthy();
        }
      });
    });
  });

  xit('should autocomplete skill dropdown when arrow buttons are selected', function() {
    //Create a new user
    shared.createBtn.click();
    var randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserFirstName = 'First ' + randomUser;

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys(newUserFirstName);
    users.lastNameFormField.sendKeys('Last ' + randomUser);

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Add a skill to the new user
      users.addSkillSearch.click();
      browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform().then(function() {
        // Expect first skill to be highlighted
        expect(users.skillDropdownItems.get(0).getAttribute('class')).toContain('highlight');
        expect(users.skillDropdownItems.get(1).getAttribute('class')).not.toContain('highlight');

        browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform().then(function() {
          // Expect second skill to be highlighted
          expect(users.skillDropdownItems.get(0).getAttribute('class')).not.toContain('highlight');
          expect(users.skillDropdownItems.get(1).getAttribute('class')).toContain('highlight');

          browser.driver.actions().sendKeys(protractor.Key.ARROW_UP).perform().then(function() {
            // Expect first skill to be highlighted again
            expect(users.skillDropdownItems.get(0).getAttribute('class')).toContain('highlight');
            expect(users.skillDropdownItems.get(1).getAttribute('class')).not.toContain('highlight');

            users.skillDropdownItems.get(0).getText().then(function(firstSkillName) {
              users.addSkillSearch.sendKeys('\n');

              // Expect first skill to be selected
              expect(users.userSkills.get(0).getText()).toContain(firstSkillName);
            });
          });
        });
      });
    });
  });

});

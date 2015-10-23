'use strict';

describe('The users view bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    shared = require('../shared.po.js'),
    skills = require('./skills.po.js'),
    columns = require('../tableControls/columns.po.js'),
    users = require('./users.po.js'),
    params = browser.params,
    userCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.usersPageUrl);
    userCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });


  it('should allow updates to supported bulk action fields', function() {
    shared.actionsBtn.click();
    expect(bulkActions.bulkActionDivs.count()).toBe(3);

    // Enable Users
    expect(bulkActions.userSelectEnable.isDisplayed()).toBeTruthy();
    expect(bulkActions.enableToggle.isDisplayed()).toBeTruthy();

    // Change Skills
    expect(bulkActions.selectChangeSkills.isDisplayed()).toBeTruthy();
    expect(bulkActions.addNewSkillBtn.isDisplayed()).toBeTruthy();
    expect(bulkActions.firstSkillDiv.isDisplayed()).toBeTruthy();
    expect(bulkActions.addSkillDropdownFields.get(0).isDisplayed()).toBeTruthy();
    expect(bulkActions.selectSkillsInputFields.get(0).isDisplayed()).toBeTruthy();
    expect(bulkActions.removeSkillBtns.get(0).isDisplayed()).toBeTruthy();
    expect(bulkActions.addSkillDropdownFields.count()).toBe(1);
    expect(bulkActions.selectSkillsInputFields.count()).toBe(1);
    expect(bulkActions.removeSkillBtns.count()).toBe(1);

    // Change Groups
    expect(bulkActions.selectChangeGroups.isDisplayed()).toBeTruthy();
    expect(bulkActions.addNewGroupBtn.isDisplayed()).toBeTruthy();
    expect(bulkActions.firstGroupDiv.isDisplayed()).toBeTruthy();
    expect(bulkActions.addGroupDropdownFields.get(0).isDisplayed()).toBeTruthy();
    expect(bulkActions.selectGroupsInputFields.get(0).isDisplayed()).toBeTruthy();
    expect(bulkActions.removeGroupBtns.get(0).isDisplayed()).toBeTruthy();
    expect(bulkActions.addGroupDropdownFields.count()).toBe(1);
    expect(bulkActions.selectGroupsInputFields.count()).toBe(1);
    expect(bulkActions.removeGroupBtns.count()).toBe(1);
  });

  it('should have disabled bulk action fields by default', function() {
    shared.actionsBtn.click();

    // User's bulk actions fields are disabled by default
    expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

    // Skill fields disabled
    expect(bulkActions.addNewSkillBtn.getAttribute('disabled')).toBeTruthy();
    expect(bulkActions.addSkillDropdownFields.get(0).getAttribute('disabled')).toBeTruthy();
    expect(bulkActions.selectSkillsInputFields.get(0).getAttribute('disabled')).toBeTruthy();
    expect(bulkActions.removeSkillBtns.get(0).getAttribute('disabled')).toBeTruthy();

    // Group fields disabled
    expect(bulkActions.addNewGroupBtn.getAttribute('disabled')).toBeTruthy();
    expect(bulkActions.addGroupDropdownFields.get(0).getAttribute('disabled')).toBeTruthy();
    expect(bulkActions.selectGroupsInputFields.get(0).getAttribute('disabled')).toBeTruthy();
    expect(bulkActions.removeGroupBtns.get(0).getAttribute('disabled')).toBeTruthy();

    // Unable to add more Skills or Groups when disabled
    bulkActions.addNewSkillBtn.click();
    bulkActions.addNewGroupBtn.click();
    expect(bulkActions.addSkillDropdownFields.count()).toBe(1);
    expect(bulkActions.addGroupDropdownFields.count()).toBe(1);
  });

  it('should not allow updates to current user status', function() {
    shared.searchField.sendKeys(params.login.user);
    bulkActions.selectAllTableHeader.click();

    shared.actionsBtn.click();
    bulkActions.userSelectEnable.click();

    bulkActions.submitFormBtn.click();

    shared.waitForConfirm();
    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeFalsy();
      expect(shared.errorMessage.isDisplayed()).toBeTruthy();
      expect(shared.errorMessage.getText()).toContain('You cannot disable your own account.');

      // Form not reset
      expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
      expect(bulkActions.enableToggle.getAttribute('disabled')).toBeFalsy();
    });
  });

  it('should allow selected user\'s status to be set to disabled', function() {
    // Only display users with Tenant Status == Accepted
    // Add Tenant Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDownInputs.get(8).isSelected().then(function(tenantStatusSelected) {
      if (!tenantStatusSelected) {
        shared.tableColumnsDropDownOptions.get(8).click();
        expect(shared.tableColumnsDropDownInputs.get(8).isSelected()).toBeTruthy();
      }
    }).then(function() {
      shared.tableColumnsDropDown.click().then(function() {

        // Select Accepted from Tenant Status drop down
        users.tenantStatusTableDropDownLabel.click();
        users.dropdownTenantStatuses.get(3).click();

        shared.tableElements.count().then(function(acceptedUserCount) {
          if (acceptedUserCount > 1) { // Ignore current user
            shared.actionsBtn.click();

            // Select all users, except current user
            shared.tableElements.each(function(userElement, elementIndex) {
              userElement.getText().then(function(userText) {
                if (userText.indexOf(params.login.user) == -1) {
                  bulkActions.selectItemTableCells.get(elementIndex).click();
                }
              });
            });

            bulkActions.userSelectEnable.click();

            expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
            bulkActions.submitFormBtn.click();

            shared.waitForConfirm();
            expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
            bulkActions.confirmOK.click().then(function() {

              // TODO Bug TITAN2-4416 where unsaved changes message is displayed
              shared.waitForAlert();
              shared.dismissChanges();

              shared.waitForSuccess();
              expect(shared.successMessage.isDisplayed()).toBeTruthy();

              // Form reset
              expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
              expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

              // Only current user remains with Tenant Status == Accepted
              shared.tableElements.count().then(function(enabledTotal) {
                expect(enabledTotal).toBe(1);
              });

              // All users are set to disabled
              // Select Disabled from Tenant Status drop down
              bulkActions.tenantStatusColumnDropDownLabel.click();
              bulkActions.tenantStatuses.get(3).click();
              bulkActions.tenantStatuses.get(0).click();
              bulkActions.tenantStatusColumnDropDownLabel.click();
              shared.tableElements.count().then(function(disabledTotal) {
                expect(disabledTotal).not.toBeLessThan(acceptedUserCount - 1); // Should be at least equal to the number reset - current user
              });
            });
          }
        });
      });
    });
  });

  it('should allow selected user\'s status to be set to enabled', function() {
    // Only display users with Tenant Status == Disabled
    // Add Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDownInputs.get(8).isSelected().then(function(tenantStatusSelected) {
      if (!tenantStatusSelected) {
        shared.tableColumnsDropDownOptions.get(8).click();
        expect(shared.tableColumnsDropDownInputs.get(8).isSelected()).toBeTruthy();
      }
    }).then(function() {
      shared.tableColumnsDropDown.click().then(function() {

        // Select Disabled from Tenant Status drop down
        users.tenantStatusTableDropDownLabel.click();
        users.dropdownTenantStatuses.get(0).click();

        shared.tableElements.count().then(function(disabledUserCount) {
          if (disabledUserCount > 0) {
            shared.actionsBtn.click();

            // Select all users, except current user
            shared.tableElements.each(function(userElement, elementIndex) {
              userElement.getText().then(function(userText) {
                if (userText.indexOf(params.login.user) == -1) {
                  bulkActions.selectItemTableCells.get(elementIndex).click();
                }
              });
            });

            bulkActions.userSelectEnable.click().then(function() {
              bulkActions.enableToggleSwitch.click();

              bulkActions.submitFormBtn.click();

              shared.waitForConfirm();
              expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
              bulkActions.confirmOK.click().then(function() {

                // TODO Bug TITAN2-4416 where unsaved changes message is displayed
                shared.waitForAlert();
                shared.dismissChanges();

                shared.waitForSuccess();
                expect(shared.successMessage.isDisplayed()).toBeTruthy();

                // Form reset
                expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
                expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

                // No users are disabled
                expect(shared.tableElements.count()).toBe(0);

                // Select Accepted from Tenant Status drop down
                bulkActions.tenantStatusColumnDropDownLabel.click();
                bulkActions.tenantStatuses.get(0).click();
                bulkActions.tenantStatuses.get(3).click();
                bulkActions.tenantStatusColumnDropDownLabel.click();
                shared.tableElements.count().then(function(enabledTotal) {
                  expect(enabledTotal).not.toBeLessThan(disabledUserCount); // Should be at least the number reset
                });
              });
            });
          }
        });
      });
    });
  });

  it('should allow selected user\'s skills to be added', function() {
    shared.actionsBtn.click();

    // Select first three users; ASSUMPTION three exist
    bulkActions.selectItemTableCells.get(0).click();
    bulkActions.selectItemTableCells.get(1).click();
    bulkActions.selectItemTableCells.get(2).click();

    // Add skill
    bulkActions.selectChangeSkills.click();

    expect(bulkActions.addNewSkillBtn.isEnabled()).toBeTruthy();
    expect(bulkActions.addSkillDropdownFields.get(0).isEnabled()).toBeTruthy();
    expect(bulkActions.selectSkillsInputFields.get(0).isEnabled()).toBeTruthy();
    expect(bulkActions.removeSkillBtns.get(0).isEnabled()).toBeTruthy();

    expect(bulkActions.addSkillDropdownFields.get(0).$('option:checked').getText()).toBe('Add Skill');

    // Select skill to add to users
    bulkActions.selectSkillsInputFields.get(0).click();
    browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    bulkActions.selectSkillsInputFields.get(0).sendKeys('\t');

    bulkActions.selectSkillsInputFields.get(0).$('option:checked').getText().then(function(addedSkillName) {
      bulkActions.submitFormBtn.click();
      shared.waitForConfirm();
      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        shared.waitForSuccess();
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Verify skill is added to each user
        var skillAdded;
        for (var i = 0; i < 3; i++) {
          skillAdded = false;
          shared.tableElements.get(i).click();
          // Wait for skills to be populated
          browser.driver.wait(function() {
            return users.userSkills.count().then(function(userSkillCount) {
              return userSkillCount;
            });
          }, 5000);
          users.userSkills.each(function(userSkillElement) {
            userSkillElement.getText().then(function(userSkillText) {
              if (userSkillText.indexOf(addedSkillName) > -1) {
                skillAdded = true;
              }
            });
          }).then(function() {
            expect(skillAdded).toBeTruthy();
          });
        }
      });
    });
  });

  xit('should allow selected user\'s skills to be removed', function() {
    // NOTE depends on previous test: users must have the same skill added
    shared.actionsBtn.click();

    // Select first three users; ASSUMPTION three exist
    bulkActions.selectItemTableCells.get(0).click();
    bulkActions.selectItemTableCells.get(1).click();
    bulkActions.selectItemTableCells.get(2).click();

    // Remove skill
    bulkActions.selectChangeSkills.click();
    bulkActions.addSkillDropdownFields.get(0).all(by.css('option')).get(3).click();
    expect(bulkActions.addSkillDropdownFields.get(0).$('option:checked').getText()).toBe('Remove Skill');

    // Select skill to add to users
    bulkActions.selectSkillsInputFields.get(0).click();
    browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    bulkActions.selectSkillsInputFields.get(0).sendKeys('\t');

    bulkActions.selectSkillsInputFields.get(0).$('option:checked').getText().then(function(removedSkillName) {
      bulkActions.submitFormBtn.click();
      shared.waitForConfirm();
      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        shared.waitForSuccess().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Verify skill is removed from each user
          for (var i = 0; i < 3; i++) {
            shared.tableElements.get(i).click();
            users.userSkills.each(function(userSkillElement) {
              expect(userSkillElement.getText()).not.toContain(removedSkillName);
            });
          }
        });
      });
    });
  });

  xit('should allow multiple skills to be added to the selected users', function() {
    // TODO Times out when there are several skills
    shared.actionsBtn.click();

    // Select first three users; ASSUMPTION three exist
    bulkActions.selectItemTableCells.get(0).click();
    bulkActions.selectItemTableCells.get(1).click();
    bulkActions.selectItemTableCells.get(2).click();

    bulkActions.selectChangeSkills.click();

    // Remove all Skills
    bulkActions.selectSkillsInputFields.get(0).click();
    bulkActions.selectSkillsInputFields.get(0).all(by.css('option')).count().then(function(skillCount) {
      bulkActions.removeSkillBtns.get(0).click().then(function() {
        for (var i = 0; i < (skillCount - 1); i++) {
          // Add skill bulk action
          bulkActions.addNewSkillBtn.click();

          // Add skill
          expect(bulkActions.addSkillDropdownFields.get(i).$('option:checked').getText()).toBe('Add Skill');

          // Select skill to add to users
          bulkActions.selectSkillsInputFields.get(i).click();
          bulkActions.selectSkillsInputFields.get(i).all(by.css('option')).get(i + 1).click();
        }
      }).then(function() {
        bulkActions.submitFormBtn.click();

        shared.waitForConfirm();
        expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
        bulkActions.confirmOK.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Verify skills are added to each user
          for (var i = 0; i < 3; i++) {
            shared.tableElements.get(i).click();
            // Wait for skills to be populated
            browser.driver.wait(function() {
              return users.userSkills.count().then(function(userSkillCount) {
                return userSkillCount;
              });
            }, 5000);
            expect(users.userSkills.count()).toBe(skillCount - 1);
          }
        });
      });
    });
  });

  xit('should allow multiple skills to be removed for the selected users', function() {
    shared.actionsBtn.click();

    // Select first three users; ASSUMPTION three exist
    bulkActions.selectItemTableCells.get(0).click();
    bulkActions.selectItemTableCells.get(1).click();
    bulkActions.selectItemTableCells.get(2).click();

    bulkActions.selectChangeSkills.click();

    // Remove all Skills
    bulkActions.selectSkillsInputFields.get(0).click();
    bulkActions.selectSkillsInputFields.get(0).all(by.css('option')).count().then(function(skillCount) {
      bulkActions.removeSkillBtns.get(0).click();
      for (var i = 0; i < (skillCount - 1); i++) {
        // Add skill bulk action
        bulkActions.addNewSkillBtn.click();

        // Remove skill
        bulkActions.addSkillDropdownFields.get(i).all(by.css('option')).get(3).click();
        expect(bulkActions.addSkillDropdownFields.get(i).$('option:checked').getText()).toBe('Remove Skill');

        // Select skill to add to users
        bulkActions.selectSkillsInputFields.get(i).click();
        bulkActions.selectSkillsInputFields.get(i).all(by.css('option')).get(i + 1).click();
      }
    }).then(function() {
      bulkActions.submitFormBtn.click();

      shared.waitForConfirm();
      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Verify skills are removed for each user
        for (var i = 0; i < 3; i++) {
          shared.tableElements.get(i).click();
          expect(users.noUserSkillsMessage.isDisplayed()).toBeTruthy();
        }
      });
    });
  });

  it('should not add a new skill when updating', function() {
    // Create new skill to ensure the skill isn't already added to a user
    browser.get(shared.skillsPageUrl);
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Update Skill Name ' + randomSkill;
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    }).then(function() {
      browser.get(shared.usersPageUrl);
      shared.actionsBtn.click();

      // Select first three users; ASSUMPTION three exist
      bulkActions.selectItemTableCells.get(0).click();
      bulkActions.selectItemTableCells.get(1).click();
      bulkActions.selectItemTableCells.get(2).click();

      bulkActions.selectChangeSkills.click();

      // Select 'Update Skill' and select newly added skill
      bulkActions.addSkillDropdownFields.get(0).all(by.css('option')).get(2).click();
      expect(bulkActions.addSkillDropdownFields.get(0).$('option:checked').getText()).toBe('Update Skill');

      // Select skill to 'update' for users
      bulkActions.selectSkillsInputFields.get(0).sendKeys(newSkillName + '\t');
      expect(bulkActions.submitFormBtn.isEnabled()).toBeFalsy();
    });
  });

  xit('should update proficiency when updating a skill for existing users with the skill', function() {
    // TODO Enable after Titan2-4351 is in stageing
    // Create new skill to ensure the skill isn't already added to a user
    browser.get(shared.skillsPageUrl);
    var randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Update Proficiency Skill Name ' + randomSkill;
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    }).then(function() {
      browser.get(shared.usersPageUrl);
      shared.actionsBtn.click();
      bulkActions.selectItemTableCells.get(0).click();
      bulkActions.selectChangeSkills.click();

      // Add newly created skill
      expect(bulkActions.addSkillDropdownFields.get(0).$('option:checked').getText()).toBe('Add Skill');

      // Select skill to 'update' for users
      bulkActions.selectSkillsInputFields.get(0).sendKeys(newSkillName + '\t');

      bulkActions.submitFormBtn.click();
      shared.waitForConfirm();
      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Verify skill is added to user with default proficiency
        shared.firstTableRow.click();
        var skillAdded = false
          // Wait for skills to be populated
        browser.driver.wait(function() {
          return users.userSkills.count().then(function(userSkillCount) {
            return userSkillCount;
          });
        }, 5000);
        users.userSkills.each(function(userSkillElement, skillIndex) {
          userSkillElement.getText().then(function(userSkillText) {
            if (userSkillText.indexOf(newSkillName) > -1) {
              skillAdded = true;
              expect(users.editSkillProficiencyTds.get(skillIndex).getAttribute('value')).toBe('1');
            }
          });
        }).then(function() {
          expect(skillAdded).toBeTruthy();
        });
      });
    }).then(function() {
      // Update proficiency
      shared.actionsBtn.click().then(function() {
        bulkActions.selectChangeSkills.click();

        // Update newly added skill proficiency
        bulkActions.addSkillDropdownFields.get(0).all(by.css('option')).get(2).click();
        expect(bulkActions.addSkillDropdownFields.get(0).$('option:checked').getText()).toBe('Update Skill');

        // Select skill to 'update' for users
        bulkActions.selectSkillsInputFields.get(0).sendKeys(newSkillName + '\t');
        bulkActions.skillProficiencyFields.get(0).click();
        bulkActions.skillProficiencyFields.get(0).element(by.css('input')).sendKeys('55\t');

        bulkActions.submitFormBtn.click();
        shared.waitForConfirm();
        expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
        bulkActions.confirmOK.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Verify skill is added to user with default proficiency
          shared.firstTableRow.click();
          // Wait for skills to be populated
          browser.driver.wait(function() {
            return users.userSkills.count().then(function(userSkillCount) {
              return userSkillCount;
            });
          }, 5000);
          var skillUpdated = false
          users.userSkills.each(function(userSkillElement, skillIndex) {
            userSkillElement.getText().then(function(userSkillText) {
              if (userSkillText.indexOf(newSkillName) > -1) {
                skillUpdated = true;
                expect(users.editSkillProficiencyTds.get(skillIndex).getAttribute('value')).toBe('55');
              }
            });
          }).then(function() {
            expect(skillUpdated).toBeTruthy();
          });
        });
      });
    });
  });

  xit('should allow selected user\'s groups to be added', function() {
    // TODO BUG TITAN2-4491
    shared.actionsBtn.click();

    // Select first three users; ASSUMPTION three exist
    bulkActions.selectItemTableCells.get(0).click();
    bulkActions.selectItemTableCells.get(1).click();
    bulkActions.selectItemTableCells.get(2).click();

    // Add group
    bulkActions.selectChangeGroups.click();

    expect(bulkActions.addNewGroupBtn.isEnabled()).toBeTruthy();
    expect(bulkActions.addGroupDropdownFields.get(0).isEnabled()).toBeTruthy();
    expect(bulkActions.selectGroupsInputFields.get(0).isEnabled()).toBeTruthy();
    expect(bulkActions.removeGroupBtns.get(0).isEnabled()).toBeTruthy();

    expect(bulkActions.addGroupDropdownFields.get(0).$('option:checked').getText()).toBe('Add Group');

    // Select group to add to users
    bulkActions.selectGroupsInputFields.get(0).click();
    browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    bulkActions.selectGroupsInputFields.get(0).sendKeys('\t');

    bulkActions.selectGroupsInputFields.get(0).$('option:checked').getText().then(function(addedGroupName) {
      bulkActions.submitFormBtn.click();
      shared.waitForConfirm();
      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Verify group is added to each user
        var groupAdded;
        for (var i = 0; i < 3; i++) {
          groupAdded = false;
          shared.tableElements.get(i).click();
          users.userGroups.each(function(userGroupElement) {
            userGroupElement.getText().then(function(userGroupText) {
              if (userGroupText.indexOf(addedGroupName) > -1) {
                groupAdded = true;
              }
            });
          }).then(function() {
            expect(groupAdded).toBeTruthy();
          });
        }
      });
    });
  });

  xit('should allow selected user\'s groups to be removed', function() {
    // NOTE depends on previous test: users must have the same group added
    shared.actionsBtn.click();

    // Select first three users; ASSUMPTION three exist
    bulkActions.selectItemTableCells.get(0).click();
    bulkActions.selectItemTableCells.get(1).click();
    bulkActions.selectItemTableCells.get(2).click();

    // Remove group
    bulkActions.selectChangeGroups.click();
    bulkActions.addGroupDropdownFields.get(0).all(by.css('option')).get(1).click();
    expect(bulkActions.addGroupDropdownFields.get(0).$('option:checked').getText()).toBe('Remove Group');

    // Select group to add to users
    bulkActions.selectGroupsInputFields.get(0).click();
    browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    bulkActions.selectGroupsInputFields.get(0).sendKeys('\t');

    bulkActions.selectGroupsInputFields.get(0).$('option:checked').getText().then(function(removedGroupName) {
      bulkActions.submitFormBtn.click();
      shared.waitForConfirm();
      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Verify group is removed from each user
        for (var i = 0; i < 3; i++) {
          shared.tableElements.get(i).click();
          users.userGroups.each(function(userGroupElement) {
            expect(userGroupElement.getText()).not.toContain(removedGroupName);
          });
        }
      });
    });
  });

  xit('should allow multiple groups to be added to the selected users', function() {
    // TODO BUG TITAN2-4491
    shared.actionsBtn.click();

    // Select first three users; ASSUMPTION three exist
    bulkActions.selectItemTableCells.get(0).click();
    bulkActions.selectItemTableCells.get(1).click();
    bulkActions.selectItemTableCells.get(2).click();

    bulkActions.selectChangeGroups.click();

    bulkActions.selectGroupsInputFields.get(0).click();
    bulkActions.selectGroupsInputFields.get(0).all(by.css('option')).count().then(function(groupCount) {
      bulkActions.removeGroupBtns.get(0).click().then(function() {
        for (var i = 0; i < (groupCount - 1); i++) {
          // Add group bulk action
          bulkActions.addNewGroupBtn.click();

          // Add group
          expect(bulkActions.addGroupDropdownFields.get(i).$('option:checked').getText()).toBe('Add Group');

          // Select group to add to users
          bulkActions.selectGroupsInputFields.get(i).click();
          bulkActions.selectGroupsInputFields.get(i).all(by.css('option')).get(i + 1).click();
        }
      }).then(function() {
        bulkActions.submitFormBtn.click();
        shared.waitForConfirm();
        expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
        bulkActions.confirmOK.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Verify groups are added to each user
          for (var i = 0; i < 3; i++) {
            shared.tableElements.get(i).click();
            expect(users.userGroups.count()).toBe(groupCount - 1);
          }
        });
      });
    });
  });

  xit('should allow multiple groups to be removed for the selected users', function() {
    shared.actionsBtn.click();

    // Select first three users; ASSUMPTION three exist
    bulkActions.selectItemTableCells.get(0).click();
    bulkActions.selectItemTableCells.get(1).click();
    bulkActions.selectItemTableCells.get(2).click();

    bulkActions.selectChangeGroups.click();

    // Remove all Groups
    bulkActions.selectGroupsInputFields.get(0).click();
    bulkActions.selectGroupsInputFields.get(0).all(by.css('option')).count().then(function(groupCount) {
      bulkActions.removeGroupBtns.get(0).click();
      for (var i = 0; i < (groupCount - 1); i++) {
        // Add group bulk action
        bulkActions.addNewGroupBtn.click();

        // Remove group
        bulkActions.addGroupDropdownFields.get(i).all(by.css('option')).get(1).click();
        expect(bulkActions.addGroupDropdownFields.get(i).$('option:checked').getText()).toBe('Remove Group');

        // Select group to add to users
        bulkActions.selectGroupsInputFields.get(i).click();
        bulkActions.selectGroupsInputFields.get(i).all(by.css('option')).get(i + 1).click();
      }
    }).then(function() {
      bulkActions.submitFormBtn.click();
      shared.waitForConfirm();
      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Verify groups are removed for each user
        for (var i = 0; i < 3; i++) {
          shared.tableElements.get(i).click();
          expect(users.noUserGroupsMessage.isDisplayed()).toBeTruthy();
        }
      });
    });
  });

  it('should show message when all Groups or Skills have been removed', function() {
    shared.actionsBtn.click();

    // Enable Skills and Groups bulk actions
    bulkActions.selectChangeSkills.click();
    bulkActions.selectChangeGroups.click();

    // Remove all Skills and Groups bulk actions rows
    bulkActions.removeSkillBtns.get(0).click();
    bulkActions.removeGroupBtns.get(0).click();

    // All Skills and Groups fields are removed
    expect(bulkActions.addNewSkillBtn.isDisplayed()).toBeTruthy();

    expect(bulkActions.addNewGroupBtn.isDisplayed()).toBeTruthy();

    // Messages displayed
    expect(bulkActions.noSkillsMessage.isDisplayed()).toBeTruthy();
    expect(bulkActions.noGroupsMessage.isDisplayed()).toBeTruthy();

    expect(bulkActions.noSkillsMessage.getText()).toBe('Click the plus button above to add a skill change.');
    expect(bulkActions.noGroupsMessage.getText()).toBe('Click the plus button above to add a group change.');

    // Messages removed after adding a Skill/Group again
    bulkActions.addNewSkillBtn.click();
    bulkActions.addNewGroupBtn.click();

    // Messages removed
    expect(bulkActions.noSkillsMessage.isDisplayed()).toBeFalsy();
    expect(bulkActions.noGroupsMessage.isDisplayed()).toBeFalsy();
  });

  it('should not display number of affected users below Skills and Groups', function() {
    shared.actionsBtn.click();

    // Enable Skills and Groups bulk actions
    bulkActions.selectChangeSkills.click();
    bulkActions.selectChangeGroups.click();

    // Skill fields enabled
    expect(bulkActions.addNewSkillBtn.getAttribute('disabled')).toBeFalsy();
    expect(bulkActions.addSkillDropdownFields.get(0).getAttribute('disabled')).toBeFalsy();
    expect(bulkActions.selectSkillsInputFields.get(0).getAttribute('disabled')).toBeFalsy();
    expect(bulkActions.removeSkillBtns.get(0).getAttribute('disabled')).toBeFalsy();

    // Group fields enabled
    expect(bulkActions.addNewGroupBtn.getAttribute('disabled')).toBeFalsy();
    expect(bulkActions.addGroupDropdownFields.get(0).getAttribute('disabled')).toBeFalsy();
    expect(bulkActions.selectGroupsInputFields.get(0).getAttribute('disabled')).toBeFalsy();
    expect(bulkActions.removeGroupBtns.get(0).getAttribute('disabled')).toBeFalsy();

    // Affected Users messages not displayed
    expect(bulkActions.skillsAffectedUsers.isPresent()).toBeFalsy();
    expect(bulkActions.groupsAffectedUsers.isPresent()).toBeFalsy();
  });

  it('should display the correct number of selected users and message in the Confirm modal', function() {
    // Select items
    shared.tableElements.count().then(function(tableCount) {
      shared.tableElements.count().then(function(tableCount) {
        var numSelected = 0;
        for (var i = 0; i < tableCount; i++) {
          if ((i % 2) > 0) {
            // Select some but not all items
            bulkActions.selectItemTableCells.get(i).click();
            numSelected++;
          }
        }
        // Expect selected number of items to be displayed in the confirm modal
        shared.actionsBtn.click();
        bulkActions.userSelectEnable.click();

        bulkActions.submitFormBtn.click();

        // Confirmation modal displayed with the same number of users selected
        shared.waitForConfirm();
        expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
        expect(bulkActions.confirmOK.isDisplayed()).toBeTruthy();
        expect(bulkActions.confirmCancel.isDisplayed()).toBeTruthy();

        expect(bulkActions.confirmHeader.isDisplayed()).toBeTruthy();
        expect(bulkActions.confirmHeader.getText()).toBe('Confirm bulk edit');

        expect(bulkActions.confirmMessage.isDisplayed()).toBeTruthy();
        expect(bulkActions.confirmMessage.getText()).toBe('You are about to make your specified changes to the ' + numSelected + ' users selected. Do you want to continue?');
      });
    });
  });
});

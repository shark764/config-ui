'use strict';

describe('The skills view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    skills = require('./skills.po.js'),
    users = require('./users.po.js'),
    params = browser.params,
    skillCount,
    randomSkill,
    newSkillName,
    addedMember;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.skillsPageUrl);
    skillCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should successfully create new Skill', function() {
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    var skillAdded = false;
    newSkillName = 'Skill Name ' + randomSkill;
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    skills.descriptionFormField.sendKeys('Skill Description');
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(skillCount);

      expect(skills.skillMembersLoading.isDisplayed()).toBeFalsy();
      expect(skills.skillMembersEmpty.isDisplayed()).toBeTruthy();
      expect(skills.skillMembersEmpty.getText()).toEqual('There are no users with this skill.');

      // Confirm skill is displayed in skill list
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if skill name in table matches newly added skill
          element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
            if (value == newSkillName) {
              skillAdded = true;
            }
          });
        }
      }).thenFinally(function() {
        // Verify new skill was found in the skill table
        expect(skillAdded).toBeTruthy();
      });
    });
  });

  it('should include skill page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsPanel.isDisplayed()).toBeFalsy(); //Hide side panel by default
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Skill Management');
  });

  it('should include valid Skill fields when creating a new Skill', function() {
    shared.createBtn.click();
    expect(skills.creatingSkillHeader.isDisplayed()).toBeTruthy();
    expect(skills.nameFormField.isDisplayed()).toBeTruthy();
    expect(skills.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(skills.proficiencyFormCheckbox.isDisplayed()).toBeTruthy();

    // Members fields not displayed
    expect(skills.addMemberArea.isDisplayed()).toBeFalsy();
  });

  it('should require field input when creating a new Skill', function() {
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Skill is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(skillCount);
  });

  it('should require name when creating a new Skill', function() {
    shared.createBtn.click();

    // Edit fields
    skills.descriptionFormField.sendKeys('Skill Description');
    skills.proficiencyFormCheckbox.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Skill is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(skillCount);

    // Touch name input field
    skills.nameFormField.click();
    skills.descriptionFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(skills.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(skills.nameRequiredError.get(0).getText()).toBe('Please enter a name');

    // New Skill is not saved
    expect(shared.tableElements.count()).toBe(skillCount);
  });

  it('should successfully create new Skill without description', function() {
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys('Skill Name ' + randomSkill);
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click();

    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(skillCount);
  });

  it('should successfully create new Skill without proficiency', function() {
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys('Skill Name ' + randomSkill);
    skills.descriptionFormField.sendKeys('Skill Description');
    shared.submitFormBtn.click();

    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(skillCount);
  });

  it('should clear fields on Cancel', function() {
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys('Skill Name');
    skills.descriptionFormField.sendKeys('Skill Description');
    skills.proficiencyFormCheckbox.click();
    shared.cancelFormBtn.click();

    // Warning message is displayed
    shared.waitForAlert();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // New skill is not created
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(skillCount);

    // Form fields are cleared and reset to default
    expect(skills.nameFormField.getAttribute('value')).toBe('');
    expect(skills.descriptionFormField.getAttribute('value')).toBe('');
    expect(skills.proficiencySwitch.isSelected()).toBeFalsy;
  });

  it('should display skill details when selected from table', function() {
    shared.firstTableRow.click();

    // Verify skill details in table matches populated field
    expect(skills.nameHeader.getText()).toContain(shared.firstTableRow.element(by.css(skills.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(skills.nameColumn)).getText()).toBe(skills.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(skills.descriptionColumn)).getText()).toBe(skills.descriptionFormField.getAttribute('value'));
    expect(skills.detailsMemberCount.getText()).toContain(shared.firstTableRow.element(by.css(skills.membersColumn)).getText());
    shared.firstTableRow.element(by.css(skills.proficiencyColumn)).getText().then(function(skillProficiency) {
      if (skillProficiency == 'Yes') {
        expect(skills.proficiencySwitch.isSelected()).toBeTruthy();
      } else if (skillProficiency == 'No') {
        expect(skills.proficiencySwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });

    // Change selected and ensure details are updated
    shared.secondTableRow.click();
    expect(skills.nameHeader.getText()).toContain(shared.secondTableRow.element(by.css(skills.nameColumn)).getText());
    expect(shared.secondTableRow.element(by.css(skills.nameColumn)).getText()).toBe(skills.nameFormField.getAttribute('value'));
    expect(shared.secondTableRow.element(by.css(skills.descriptionColumn)).getText()).toBe(skills.descriptionFormField.getAttribute('value'));
    expect(skills.detailsMemberCount.getText()).toContain(shared.secondTableRow.element(by.css(skills.membersColumn)).getText());
    shared.secondTableRow.element(by.css(skills.proficiencyColumn)).getText().then(function(skillProficiency) {
      if (skillProficiency == 'Yes') {
        expect(skills.proficiencySwitch.isSelected()).toBeTruthy();
      } else if (skillProficiency == 'No') {
        expect(skills.proficiencySwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
  });

  it('should include valid Skill fields when editing an existing Skill', function() {
    shared.firstTableRow.click();
    expect(skills.nameFormField.isDisplayed()).toBeTruthy();
    expect(skills.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(skills.proficiencyFormCheckbox.isDisplayed()).toBeTruthy();
    expect(skills.activeFormToggle.isDisplayed()).toBeTruthy();
    expect(skills.detailsMemberCount.isDisplayed()).toBeTruthy();

    // Manage member fields
    expect(skills.addMemberArea.isDisplayed()).toBeTruthy();
    expect(skills.addMemberField.isDisplayed()).toBeTruthy();
    expect(skills.addMemberField.isDisplayed()).toBeTruthy();
  });

  it('should reset Skill fields after editing and selecting Cancel', function() {
    // Select first queue from table
    shared.firstTableRow.click();

    var originalName = skills.nameFormField.getAttribute('value');
    var originalDescription = skills.descriptionFormField.getAttribute('value');
    var originalProficiency = skills.proficiencySwitch.isSelected();

    // Edit fields
    skills.nameFormField.sendKeys('Edit');
    skills.descriptionFormField.sendKeys('Edit');

    shared.cancelFormBtn.click();

    // Warning message is displayed
    shared.waitForAlert();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(skillCount);

    // Fields reset to original values
    expect(skills.nameFormField.getAttribute('value')).toBe(originalName);
    expect(skills.descriptionFormField.getAttribute('value')).toBe(originalDescription);
    expect(skills.proficiencySwitch.isSelected()).toBe(originalProficiency);
  });

  it('should allow the Skill fields to be updated', function() {
    shared.firstTableRow.click();

    // Edit fields
    skills.nameFormField.sendKeys('Edit');
    skills.descriptionFormField.sendKeys('Edit');

    var editedName = skills.nameFormField.getAttribute('value');
    var editedDescription = skills.descriptionFormField.getAttribute('value');
    var editedProficiency = skills.proficiencySwitch.isSelected();
    shared.submitFormBtn.click();

    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).toBe(skillCount);

    // Changes persist
    browser.refresh();
    expect(skills.nameFormField.getAttribute('value')).toBe(editedName);
    expect(skills.descriptionFormField.getAttribute('value')).toBe(editedDescription);
    expect(skills.proficiencySwitch.isSelected()).toBe(editedProficiency);
  });

  it('should allow the Skill to be updated to have proficiency', function() {
    // Create new skill without proficiency
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    newSkillName = 'Skill Name ' + randomSkill;
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    skills.descriptionFormField.sendKeys('Skill Description');

    shared.submitFormBtn.click().then(function() {
      expect(skills.proficiencySwitch.isSelected()).toBeFalsy();

      // Edit skill to have proficiency
      skills.proficiencyFormCheckbox.click();
      shared.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    }).then(function() {
      // Changes persist
      browser.refresh();
      shared.searchField.sendKeys(newSkillName);
      shared.firstTableRow.click();
      expect(skills.proficiencySwitch.isSelected()).toBeTruthy();
    });
  });

  it('should not allow the Skill proficiency to be removed', function() {
    // Create new skill with proficiency
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    newSkillName = 'Skill Name ' + randomSkill;
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    skills.descriptionFormField.sendKeys('Skill Description');
    skills.proficiencyFormCheckbox.click();

    shared.submitFormBtn.click().then(function() {
      expect(skills.proficiencySwitch.getAttribute('value')).toBe('on');

      // Unable to edit skill to remove proficiency
      expect(skills.proficiencyFormCheckbox.getAttribute('disabled')).toBeTruthy();
    });
  });

  it('should require name field when editing a Skill', function() {
    // Select first skill from table
    shared.firstTableRow.click();

    // Edit fields
    skills.nameFormField.clear();
    skills.descriptionFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(skills.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(skills.nameRequiredError.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not require description field when editing a Skill', function() {
    shared.firstTableRow.click();

    // Edit fields
    skills.descriptionFormField.sendKeys('not required');
    skills.descriptionFormField.clear();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeTruthy();
    });
  });

  it('should link to the user details view in the members list', function() {
    var skillWithMembersRow;

    // Order by skill member count, descending
    skills.headerRow.element(by.css('th:nth-child(4)')).click();
    skills.headerRow.element(by.css('th:nth-child(4)')).click();

    shared.firstTableRow.element(by.css(skills.membersColumn)).getText().then(function(value) {
      if (parseInt(value) > 0) {
        shared.firstTableRow.click();

        //Save the member's name
        var memberName = skills.skillMembersRows.get(0).getText();

        //Follow the link
        skills.skillMembersRows.get(0).element(by.css('a')).click().then(function() {
          expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
          expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
          expect(memberName).toContain(users.userNameDetailsHeader.getText());
        });
      }
    });
  });

  it('should list all users in Add Member dropdown', function() {
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    newSkillName = 'Skill Name ' + randomSkill; // Save name for subsequent tests
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      expect(skills.addMemberField.isDisplayed()).toBeTruthy();
      expect(skills.addMemberProficiency.isPresent()).toBeFalsy(); // Without proficiency

      expect(skills.skillMembersLoading.isDisplayed()).toBeFalsy();
      expect(skills.skillMembersEmpty.isDisplayed()).toBeTruthy();
      expect(skills.skillMembersEmpty.getText()).toEqual('There are no users with this skill.');

      skills.addMemberField.click();
      skills.addMemberDropdownOptions.count().then(function(availableUserCount) {
        browser.get(shared.usersPageUrl);
        expect(shared.tableElements.count()).toBe(availableUserCount);
      });
    });
  });

  it('should add member to skill and increment member count', function() {
    // NOTE Uses new skill from previous test to ensure member count is 0
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click();

    expect(skills.addMemberField.isDisplayed()).toBeTruthy();
    expect(skills.skillMembersEmpty.getText()).toEqual('There are no users with this skill.');

    skills.addMemberField.click();
    skills.addMemberDropdownOptions.get(0).getText().then(function(addedMemberName) {
      addedMember = addedMemberName;
      skills.addMemberDropdownOptions.get(0).click();
      skills.addMemberBtn.click().then(function() {
        expect(skills.skillMembersEmpty.isDisplayed()).toBeFalsy();

        expect(skills.skillMembersRows.count()).toBe(1);
        expect(skills.skillMembersRows.get(0).getText()).toBe(addedMemberName);
        expect(skills.detailsMemberCount.getText()).toContain('1');
        expect(shared.firstTableRow.element(by.css(skills.membersColumn)).getText()).toBe('1');

        // Changes persist
        browser.refresh();
        shared.searchField.sendKeys(newSkillName);
        shared.firstTableRow.click();

        expect(skills.skillMembersRows.count()).toBe(1);
        expect(skills.skillMembersRows.get(0).getText()).toBe(addedMemberName);
        expect(skills.detailsMemberCount.getText()).toContain('1');
        expect(shared.firstTableRow.element(by.css(skills.membersColumn)).getText()).toBe('1');
      });
    });
  });

  it('should update user after adding as a member', function() {
    // NOTE Uses new skill and user from previous test
    browser.get(shared.usersPageUrl);
    shared.searchField.sendKeys(newSkillName + '\t'); // Search for user based on new skill
    expect(shared.tableElements.count()).toBe(1);
    expect(shared.firstTableRow.getText()).toContain(addedMember);
  });

  it('should clear add member field after adding', function() {
    // NOTE Uses new skill from previous test to ensure member count is 0
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click();

    skills.addMemberField.click();
    skills.addMemberDropdownOptions.get(0).getText();
    skills.addMemberDropdownOptions.get(0).click();
    skills.addMemberBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
      expect(skills.addMemberField.getAttribute('value')).toBeNull();
      expect(skills.addMemberProficiency.isPresent()).toBeFalsy(); // Without proficiency
    });
  });

  it('should update user dropdown after adding and removing members', function() {
    // NOTE Uses new skill from previous test
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click();

    skills.addMemberField.click();
    skills.addMemberDropdownOptions.count().then(function(originalAvailableUserCount) {
      // Add user as a member
      skills.addMemberDropdownOptions.get(0).click();
      skills.addMemberBtn.click().then(function() {
        shared.waitForSuccess();
        shared.successMessage.click();

        expect(skills.skillMembersRows.count()).toBe(3);
        expect(skills.detailsMemberCount.getText()).toContain('3');

        // User is removed from dropdown
        skills.addMemberField.click();
        expect(skills.addMemberDropdownOptions.count()).toBe(originalAvailableUserCount - 1);
        // Remove member
        skills.skillMembersRows.get(0).element(by.css('.remove')).click().then(function() {
          shared.waitForSuccess();
          shared.successMessage.click();

          expect(skills.skillMembersRows.count()).toBe(2);
          expect(skills.detailsMemberCount.getText()).toContain('2');

          // User is added from dropdown
          skills.addMemberField.click();
          expect(skills.addMemberDropdownOptions.count()).toBe(originalAvailableUserCount);
        });
      });
    });
  });

  it('should allow all members to be removed', function() {
    // NOTE Uses new skill from previous test
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click();

    // Remove member
    skills.skillMembersRows.get(0).element(by.css('.remove')).click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      expect(skills.skillMembersRows.count()).toBe(1);
      expect(skills.detailsMemberCount.getText()).toContain('1');

      skills.skillMembersRows.get(0).element(by.css('.remove')).click().then(function() {
        shared.waitForSuccess();
        shared.successMessage.click();

        expect(skills.detailsMemberCount.getText()).toContain('0');
        expect(skills.skillMembersEmpty.isDisplayed()).toBeTruthy();
      });
    });
  });

  it('should display proficiency fields for adding new members', function() {
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    newSkillName = 'Skill Name ' + randomSkill; // Save name for subsequent tests
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      expect(skills.addMemberField.isDisplayed()).toBeTruthy();
      expect(skills.addMemberProficiency.isDisplayed()).toBeTruthy();

      expect(skills.skillMembersLoading.isDisplayed()).toBeFalsy();
      expect(skills.skillMembersEmpty.isDisplayed()).toBeTruthy();
      expect(skills.skillMembersEmpty.getText()).toEqual('There are no users with this skill.');
    });
  });

  it('should add member to skill with default proficiency', function() {
    // NOTE Uses new skill from previous test to ensure member count is 0
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click();

    expect(skills.addMemberField.isDisplayed()).toBeTruthy();
    expect(skills.addMemberProficiency.isDisplayed()).toBeTruthy();
    expect(skills.addMemberProficiency.getAttribute('value')).toBe('1');

    skills.addMemberField.click();
    skills.addMemberDropdownOptions.get(0).getText().then(function(addedMemberName) {
      addedMember = addedMemberName;
      skills.addMemberDropdownOptions.get(0).click();
      skills.addMemberBtn.click().then(function() {
        expect(skills.skillMembersEmpty.isDisplayed()).toBeFalsy();

        expect(skills.skillMembersRows.count()).toBe(1);
        expect(skills.skillMembersRows.get(0).getText()).toContain(addedMemberName);
        expect(skills.skillMembersRows.get(0).getText()).toContain('1');
        expect(skills.detailsMemberCount.getText()).toContain('1');
        expect(shared.firstTableRow.element(by.css(skills.membersColumn)).getText()).toBe('1');

        // Changes persist
        browser.refresh();
        shared.searchField.sendKeys(newSkillName);
        shared.firstTableRow.click();

        expect(skills.skillMembersRows.count()).toBe(1);
        expect(skills.skillMembersRows.get(0).getText()).toContain(addedMemberName);
        expect(skills.skillMembersRows.get(0).getText()).toContain('1');
        expect(shared.firstTableRow.element(by.css(skills.membersColumn)).getText()).toBe('1');
      });
    });
  });

  it('should reset add member fields after adding with default proficiency', function() {
    // NOTE Uses new skill from previous test
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click();

    skills.addMemberField.click();
    skills.addMemberDropdownOptions.get(0).getText();
    skills.addMemberDropdownOptions.get(0).click();
    skills.addMemberBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
      expect(skills.addMemberField.getAttribute('value')).toBeNull();
      expect(skills.addMemberProficiency.getAttribute('value')).toBe('1');
    });
  });

  it('should allow all members to be removed with proficiency', function() {
    // NOTE Uses new skill from previous test
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click();

    // Remove member
    skills.skillMembersRows.get(0).element(by.css('.remove')).click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      expect(skills.skillMembersRows.count()).toBe(1);
      expect(skills.detailsMemberCount.getText()).toContain('1');

      skills.skillMembersRows.get(0).element(by.css('.remove')).click().then(function() {
        shared.waitForSuccess();
        shared.successMessage.click();

        expect(skills.detailsMemberCount.getText()).toContain('0');
        expect(skills.skillMembersEmpty.isDisplayed()).toBeTruthy();
      });
    });
  });

  it('should add member to skill with input proficiency', function() {
    // NOTE Uses new skill from previous test
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click();

    expect(skills.addMemberField.isDisplayed()).toBeTruthy();
    expect(skills.addMemberProficiency.isDisplayed()).toBeTruthy();
    expect(skills.addMemberProficiency.getAttribute('value')).toBe('1');

    skills.addMemberField.click();
    skills.addMemberDropdownOptions.get(0).getText().then(function(addedMemberName) {
      skills.addMemberDropdownOptions.get(0).click();
      skills.addMemberProficiency.clear();
      skills.addMemberProficiency.sendKeys('50');

      skills.addMemberBtn.click().then(function() {
        expect(skills.skillMembersRows.count()).toBe(1);
        expect(skills.skillMembersRows.get(0).getText()).toContain(addedMemberName);
        expect(skills.skillMembersRows.get(0).getText()).toContain('50');
        expect(skills.detailsMemberCount.getText()).toContain('1');
        expect(shared.firstTableRow.element(by.css(skills.membersColumn)).getText()).toBe('1');
      });
    });
  });

  it('should reset add member field after adding with input proficiency', function() {
    // NOTE Uses new skill from previous test
    shared.searchField.sendKeys(newSkillName);
    shared.firstTableRow.click();

    skills.addMemberField.click();
    skills.addMemberDropdownOptions.get(0).click();
    skills.addMemberProficiency.clear();
    skills.addMemberProficiency.sendKeys('25');

    skills.addMemberBtn.click().then(function() {
      shared.waitForSuccess();
      expect(skills.addMemberField.getAttribute('value')).toBeNull();
      expect(skills.addMemberProficiency.getAttribute('value')).toBe('1');
    });
  });
});

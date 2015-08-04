'use strict';

describe('The skills view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    skills = require('./skills.po.js'),
    params = browser.params,
    skillCount,
    randomSkill;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.skillsPageUrl);
    skillCount = skills.skillElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should successfully create new Skill', function() {
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    var skillAdded = false;
    var newSkillName = 'Skill Name ' + randomSkill;
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    skills.descriptionFormField.sendKeys('Skill Description');
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click();

    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(skills.skillElements.count()).toBeGreaterThan(skillCount);

    // Confirm skill is displayed in skill list
    skills.skillElements.then(function(rows) {
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

  it('should include skill page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeFalsy(); //Hide side panel by default
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
  });

  it('should require field input when creating a new Skill', function() {
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Skill is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(skills.skillElements.count()).toBe(skillCount);
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
    expect(skills.skillElements.count()).toBe(skillCount);

    // Touch name input field
    skills.nameFormField.click();
    skills.descriptionFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(skills.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(skills.nameRequiredError.get(0).getText()).toBe('Please enter a name');

    // New Skill is not saved
    expect(skills.skillElements.count()).toBe(skillCount);
  });

  it('should successfully create new Skill without description', function() {
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys('Skill Name ' + randomSkill);
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click();

    expect(skills.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(skills.skillElements.count()).toBeGreaterThan(skillCount);
  });

  it('should successfully create new Skill without proficiency', function() {
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys('Skill Name ' + randomSkill);
    skills.descriptionFormField.sendKeys('Skill Description');
    shared.submitFormBtn.click();

    expect(skills.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(skills.skillElements.count()).toBeGreaterThan(skillCount);
  });

  it('should clear fields on Cancel', function() {
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys('Skill Name');
    skills.descriptionFormField.sendKeys('Skill Description');
    skills.proficiencyFormCheckbox.click();
    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // New skill is not created
    expect(skills.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(skills.skillElements.count()).toBe(skillCount);

    // Form fields are cleared and reset to default
    expect(skills.nameFormField.getAttribute('value')).toBe('');
    expect(skills.descriptionFormField.getAttribute('value')).toBe('');
    expect(skills.proficiencySwitch.isSelected()).toBeFalsy;
  });

  it('should display skill details when selected from table', function() {
    // Select first queue from table
    shared.firstTableRow.click();

    // Verify skill details in table matches populated field
    expect(skills.nameHeader.getText()).toContain(shared.firstTableRow.element(by.css(skills.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(skills.nameColumn)).getText()).toBe(skills.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(skills.descriptionColumn)).getText()).toBe(skills.descriptionFormField.getAttribute('value'));
    shared.firstTableRow.element(by.css(skills.proficiencyColumn)).getText().then(function (skillProficiency) {
      if(skillProficiency == 'Yes'){
        expect(skills.proficiencySwitch.isSelected()).toBeTruthy();
      } else if (skillProficiency == 'No'){
        expect(skills.proficiencySwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });

    // Change selected queue and ensure details are updated
    shared.secondTableRow.click();
    expect(skills.nameHeader.getText()).toContain(shared.secondTableRow.element(by.css(skills.nameColumn)).getText());
    expect(shared.secondTableRow.element(by.css(skills.nameColumn)).getText()).toBe(skills.nameFormField.getAttribute('value'));
    expect(shared.secondTableRow.element(by.css(skills.descriptionColumn)).getText()).toBe(skills.descriptionFormField.getAttribute('value'));
    shared.secondTableRow.element(by.css(skills.proficiencyColumn)).getText().then(function (skillProficiency) {
      if(skillProficiency == 'Yes'){
        expect(skills.proficiencySwitch.isSelected()).toBeTruthy();
      } else if (skillProficiency == 'No'){
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
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(skills.skillElements.count()).toBe(skillCount);

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
    expect(skills.skillElements.count()).toBe(skillCount);

    // Changes persist
    browser.refresh();
    expect(skills.nameFormField.getAttribute('value')).toBe(editedName);
    expect(skills.descriptionFormField.getAttribute('value')).toBe(editedDescription);
    expect(skills.proficiencySwitch.isSelected()).toBe(editedProficiency);
  });

  it('should allow the Skill to be update to have proficiency', function() {
    // Create new skill without proficiency
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name ' + randomSkill;
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    skills.descriptionFormField.sendKeys('Skill Description');

    shared.submitFormBtn.click().then(function () {
      expect(skills.proficiencySwitch.isSelected()).toBeFalsy();

      // Edit skill to have proficiency
      skills.proficiencyFormCheckbox.click();
      shared.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      expect(skills.proficiencySwitch.isSelected()).toBeTruthy();
    });
  });

  it('should not allow the Skill proficiency to be removed', function() {
    // Create new skill with proficiency
    randomSkill = Math.floor((Math.random() * 1000) + 1);
    var newSkillName = 'Skill Name ' + randomSkill;
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    skills.descriptionFormField.sendKeys('Skill Description');
    skills.proficiencyFormCheckbox.click();

    shared.submitFormBtn.click().then(function () {
      expect(skills.proficiencySwitch.isSelected()).toBeTruthy();

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
    skills.descriptionFormField.clear();
    shared.submitFormBtn.click().then(function () {
      expect(shared.successMessage.isPresent()).toBeTruthy();
    });
  });
});

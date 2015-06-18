'use strict';

describe('The skills view', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    skills = require('./skills.po.js'),
    skillCount,
    randomSkill;

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  beforeEach(function() {
    browser.get(shared.skillsPageUrl);
    skillCount = skills.skillElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include skill page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeTruthy();
    expect(shared.actionBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Skills Management');
  });

  it('should include valid Skill fields when creating a new Skill', function() {
    shared.createBtn.click();
    expect(skills.creatingSkillHeader.isDisplayed()).toBeTruthy();
    expect(skills.nameFormField.isDisplayed()).toBeTruthy();
    expect(skills.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(skills.proficiencyFormCheckbox.isDisplayed()).toBeTruthy();
  });

  it('should successfully create new Skill', function() {
    randomSkill = Math.floor((Math.random() * 100) + 1);
    var skillAdded = false;
    var newSkillName = 'Skill Name ' + randomSkill;
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys(newSkillName);
    skills.descriptionFormField.sendKeys('Skill Description');
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click();

    expect(skills.nameRequiredError.isDisplayed()).toBeFalsy();
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

  it('should require field input when creating a new Skill', function() {
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Submit without field input
    shared.submitFormBtn.click();

    // New Skill is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(skills.skillElements.count()).toBe(skillCount);
  });

  it('should require name when creating a new Skill', function() {
    shared.createBtn.click();

    // Edit fields
    skills.descriptionFormField.sendKeys('Skill Description');
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Skill is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(skills.skillElements.count()).toBe(skillCount);

    // Touch name input field
    skills.nameFormField.click();
    skills.descriptionFormField.click();
    shared.submitFormBtn.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(skills.nameRequiredError.isDisplayed()).toBeTruthy();
    expect(skills.nameRequiredError.getText()).toBe('Please enter a name');

    // New Skill is not saved
    expect(skills.skillElements.count()).toBe(skillCount);
  });

  it('should successfully create new Skill without description', function() {
    randomSkill = Math.floor((Math.random() * 100) + 1);
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys('Skill Name ' + randomSkill);
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click();

    expect(skills.nameRequiredError.isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(skills.skillElements.count()).toBeGreaterThan(skillCount);
  });

  it('should successfully create new Skill without proficiency', function() {
    randomSkill = Math.floor((Math.random() * 100) + 1);
    shared.createBtn.click();

    // Edit fields
    skills.nameFormField.sendKeys('Skill Name ' + randomSkill);
    skills.descriptionFormField.sendKeys('Skill Description');
    shared.submitFormBtn.click();

    expect(skills.nameRequiredError.isDisplayed()).toBeFalsy();
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

    // New skill is not created
    expect(skills.nameRequiredError.isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(skills.skillElements.count()).toBe(skillCount);

    // Form fields are cleared and reset to default
    expect(skills.nameFormField.getAttribute('value')).toBe('');
    expect(skills.descriptionFormField.getAttribute('value')).toBe('');
    expect(skills.proficiencyFormCheckbox.isSelected()).toBeFalsy;
  });

  it('should display skill details when selected from table', function() {
    // Select first queue from table
    skills.firstTableRow.click();

    // Verify skill details in table matches populated field
    expect(skills.nameHeader.getText()).toContain(skills.firstTableRow.element(by.css(skills.nameColumn)).getText());
    expect(skills.firstTableRow.element(by.css(skills.nameColumn)).getText()).toBe(skills.nameFormField.getAttribute('value'));
    expect(skills.firstTableRow.element(by.css(skills.descriptionColumn)).getText()).toBe(skills.descriptionFormField.getAttribute('value'));
    expect(skills.firstTableRow.element(by.css(skills.proficiencyColumn)).getText()).toContain(skills.proficiencyFormCheckbox.isSelected());

    // Change selected queue and ensure details are updated
    skills.secondTableRow.click();
    expect(skills.nameHeader.getText()).toContain(skills.secondTableRow.element(by.css(skills.nameColumn)).getText());
    expect(skills.secondTableRow.element(by.css(skills.nameColumn)).getText()).toBe(skills.nameFormField.getAttribute('value'));
    expect(skills.secondTableRow.element(by.css(skills.descriptionColumn)).getText()).toBe(skills.descriptionFormField.getAttribute('value'));
    expect(skills.secondTableRow.element(by.css(skills.proficiencyColumn)).getText()).toContain(skills.proficiencyFormCheckbox.isSelected());
  });

  it('should include valid Skill fields when editing an existing Skill', function() {
    skills.firstTableRow.click();
    expect(skills.creatingSkillHeader.isPresent()).toBeFalsy();
    expect(skills.nameFormField.isDisplayed()).toBeTruthy();
    expect(skills.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(skills.proficiencyFormCheckbox.isDisplayed()).toBeTruthy();
  });

  it('should reset Skill fields after editing and selecting Cancel', function() {
    // Select first queue from table
    skills.firstTableRow.click();

    var originalName = skills.nameFormField.getAttribute('value');
    var originalDescription = skills.descriptionFormField.getAttribute('value');
    var originalProficiency = skills.proficiencyFormCheckbox.isSelected();

    // Edit fields
    skills.nameFormField.sendKeys('Edit');
    skills.descriptionFormField.sendKeys('Edit');
    skills.proficiencyFormCheckbox.click();

    shared.cancelFormBtn.click();

    expect(skills.nameRequiredError.isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(skills.skillElements.count()).toBe(skillCount);

    // Fields reset to original values
    expect(skills.nameFormField.getAttribute('value')).toBe(originalName);
    expect(skills.descriptionFormField.getAttribute('value')).toBe(originalDescription);
    expect(skills.proficiencyFormCheckbox.isSelected()).toBe(originalProficiency);
  });

  it('should allow the Skill fields to be updated', function() {
    // Select first queue from table
    skills.firstTableRow.click();

    // Edit fields
    skills.nameFormField.sendKeys('Edit');
    skills.descriptionFormField.sendKeys('Edit');
    skills.proficiencyFormCheckbox.click();

    var editedName = skills.nameFormField.getAttribute('value');
    var editedDescription = skills.descriptionFormField.getAttribute('value');
    var editedProficiency = skills.descriptionFormField.isSelected();
    shared.submitFormBtn.click();

    expect(skills.nameRequiredError.isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(skills.skillElements.count()).toBe(skillCount);

    // Changes persist
    browser.refresh();
    expect(skills.nameFormField.getAttribute('value')).toBe(editedName);
    expect(skills.descriptionFormField.getAttribute('value')).toBe(editedDescription);
    expect(skills.proficiencyFormCheckbox.isSelected()).toBe(editedProficiency);
  });

  it('should require name field when editing a Skill', function() {
    // Select first queue from table
    skills.firstTableRow.click();

    // Edit fields
    skills.nameFormField.clear();
    skills.descriptionFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    expect(skills.nameRequiredError.isDisplayed()).toBeTruthy();
    expect(skills.nameRequiredError.getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not require description field when editing a Skill', function() {
    // Select first queue from table
    skills.firstTableRow.click();

    // Edit fields
    skills.descriptionFormField.clear();

    expect(shared.successMessage.isPresent()).toBeTruthy();
  });
});

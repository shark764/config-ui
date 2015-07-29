'use strict';

describe('The skills view bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    shared = require('../shared.po.js'),
    skills = require('./skills.po.js'),
    params = browser.params,
    skillCount;

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

  it('should allow updates to supported bulk action fields', function() {
    shared.actionsBtn.click();
    expect(bulkActions.bulkActionDivs.count()).toBe(2);

    // Enable Skills
    expect(bulkActions.selectEnable.isDisplayed()).toBeTruthy();
    expect(bulkActions.enableToggle.isDisplayed()).toBeTruthy();

    // Add Proficiency
    expect(bulkActions.selectProficiency.isDisplayed()).toBeTruthy();
    expect(bulkActions.proficiencyDropdownField.isDisplayed()).toBeTruthy();
  });

  it('should allow all selected skill\'s status to be Disabled', function() {
    // Update All bulk actions
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Form reset
      expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

      // All skills are set to disabled
      // Select Disabled from Status drop down
      bulkActions.statusTableDropDown.click();
      bulkActions.statuses.get(0).click();
      shared.tableElements.count().then(function(disabledTotal) {
        expect(disabledTotal).toBe(skillCount);
      });

      // Select Enabled from Status drop down
      bulkActions.statuses.get(0).click();
      bulkActions.statuses.get(1).click();
      shared.tableElements.count().then(function(enabledTotal) {
        expect(enabledTotal).toBe(0);
      });
    });
  });

  it('should allow all selected skill\'s status to be Enabled', function() {
    // Update All bulk actions
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.enableToggleClick.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Form reset
      expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

      // All skills are set to enabled
      // Select Disabled from Status drop down
      bulkActions.statusTableDropDown.click();
      bulkActions.statuses.get(0).click();
      shared.tableElements.count().then(function(disabledTotal) {
        expect(disabledTotal).toBe(0);
      });

      // Select Enabled from Status drop down
      bulkActions.statuses.get(0).click();
      bulkActions.statuses.get(1).click();
      shared.tableElements.count().then(function(enabledTotal) {
        expect(enabledTotal).toBe(skillCount);
      });
    });
  });

  it('should ignore disabled fields on update', function() {
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.enableToggle.click();
    bulkActions.selectProficiency.click();

    // Disable Enable toggle
    bulkActions.selectEnable.click();
    expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

    // Disable Proficiency
    bulkActions.selectProficiency.click();
    expect(bulkActions.proficiencyDropdownField.getAttribute('disabled')).toBeTruthy();

    // No bulk actions to perform
    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isPresent()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should allow multiple fields to be updated at once for the selected skills', function() {
    shared.actionsBtn.click();

    // Select one skill
    bulkActions.selectItemTableCells.get(0).click();

    bulkActions.selectEnable.click();
    bulkActions.selectProficiency.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // First table row is updated
      expect(shared.firstTableRow.getText()).toContain('Yes');
      expect(shared.firstTableRow.getText()).toContain('Disabled');
    });
  });

  it('should allow selected skill\'s proficiency to be set to True only', function() {
    shared.actionsBtn.click();

    // Select one skill
    bulkActions.selectItemTableCells.get(0).click();

    bulkActions.selectProficiency.click();
    expect(bulkActions.proficiencyDropdownField.getAttribute('disabled')).toBeFalsy();

    // Proficiency dropdown has only True option
    bulkActions.proficiencyDropdownField.click();
    expect(bulkActions.proficiencyDropdownOptions.count()).toBe(1);
    expect(bulkActions.proficiencyDropdownOptions.get(0).getText()).toBe('True');

    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // First table row Proficiency is true
      expect(shared.firstTableRow.getText()).toContain('Yes');
    });
  });

  it('should allow all selected skill\'s proficiency to be set to True only', function() {
    shared.actionsBtn.click();

    // Select all skills
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectProficiency.click();
    expect(bulkActions.proficiencyDropdownField.getAttribute('disabled')).toBeFalsy();

    // Proficiency dropdown has only True option
    bulkActions.proficiencyDropdownField.click();
    expect(bulkActions.proficiencyDropdownOptions.count()).toBe(1);
    expect(bulkActions.proficiencyDropdownOptions.get(0).getText()).toBe('True');

    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // All table rows Proficiency are true
      shared.tableElements.each(function (skill) {
          expect(skill.getText()).toContain('Yes');
      });
    });
  });

  it('should only affect selected skills', function() {
    shared.tableElements.then(function(originalSkills) {
      // Select odd skills and leave even skills unselected
      for (var i = 0; i < originalSkills.length; i++) {
        if (i % 2 > 0) {
          bulkActions.selectItemTableCells.get(i).click();
        }
      }
      shared.actionsBtn.click();
      bulkActions.selectAllTableHeader.click();

      // Disable selected Skills
      bulkActions.selectEnable.click();

      bulkActions.submitFormBtn.click();

      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Form reset
        expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
        expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

        // Only selected skills are updated
        for (var i = 0; i < originalSkills.length; i++) {
          if (i % 2 > 0) {
            // Skill was updated to Disabled
            expect(shared.tableElements.get(i).getText()).toContain('Disabled');
          } else {
            // Skill status remains unchanged
            expect(shared.tableElements.get(i).getText()).toBe(originalSkills[i].getText());
          }
        }
      });
    });
  });
});

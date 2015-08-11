'use strict';

describe('The users view bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    shared = require('../shared.po.js'),
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


  xit('should allow updates to supported bulk action fields', function() {
    // Enable Users

    // Reset Password

    // Change Skills

    // Change Groups
  });

  it('should have disabled bulk action fields by default', function() {
    shared.actionsBtn.click();

    // User's bulk actions fields are disabled by default
    expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();
    expect(bulkActions.resetPasswordInputField.getAttribute('disabled')).toBeTruthy();

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

  it('should not allow updates to current user', function() {
    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
    bulkActions.selectAllTableHeader.click();

    shared.actionsBtn.click();
    bulkActions.userSelectEnable.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

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

  xit('should allow selected user\'s status to be updated', function() {});
  xit('should allow selected user\'s password to be reset', function() {});
  xit('should allow selected user\'s skills to be updated', function() {});
  xit('should allow multiple skills to be updates for the selected users', function() {});
  xit('should update proficiency when adding a skill for existing users with the skill', function() {});

  xit('should allow selected user\'s groups to be updated', function() {});
  xit('should allow multiple groups to be updates for the selected users', function() {});
  xit('should do nothing when adding a group for existing users with the group', function() {});

  xit('should allow multiple fields to be updated at once for the selected users', function() {});
  xit('should allow all fields to be updated at once for the selected users', function() {});
  xit('should ignore disabled fields on update', function() {});

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

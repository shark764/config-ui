'use strict';

describe('The status update', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  describe('on the Users Management page', function() {
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
      browser.get(shared.usersPageUrl);

      // Don't show pending users
      shared.tableColumnsDropDown.click();
      shared.tableColumnsDropDownInputs.get(7).isSelected().then(function(statusSelected) {
        if (!statusSelected) {
          shared.tableColumnsDropDownOptions.get(7).click();
          expect(shared.tableColumnsDropDownInputs.get(7).isSelected()).toBeTruthy();
        }
      }).then(function() {
        shared.tableColumnsDropDown.click();
        users.statusTableDropDownLabel.click();
        users.dropdownStatuses.get(2).click();
      });
    });

    it('should should display confirmation modal', function() {
      shared.firstTableRow.getText().then(function(firstTableText) {
        if (firstTableText.indexOf(params.login.user) == -1) { // Not logged in user
          shared.firstTableRow.click();
        } else {
          shared.secondTableRow.click();
        }
      }).then(function() {
        // Select Status toggle
        users.activeFormToggle.click();

        // Confirm modal is displayed
        shared.waitForConfirm();

        expect(shared.confirmModal.isDisplayed()).toBeTruthy();
        expect(['This will disable this user and prevent them from logging in. Do you want to continue?', 'This will enable this user and allow them to log in. Do you want to continue?']).toContain(shared.confirmModalMsg.getText());
        expect(shared.confirmModalCancelBtn.isDisplayed()).toBeTruthy();
        expect(shared.confirmModalOkBtn.isDisplayed()).toBeTruthy();
      });
    });

    it('should not update status after dismissing Confirm modal', function() {
      shared.firstTableRow.getText().then(function(firstTableText) {
        if (firstTableText.indexOf(params.login.user) == -1) { // Not logged in user
          shared.firstTableRow.click();
        } else {
          shared.secondTableRow.click();
        }
      }).then(function() {
        // Select Status toggle
        var originalStatus = users.activeToggleInput.isSelected();
        users.activeFormToggle.click();

        // Confirm modal is displayed
        shared.waitForConfirm();
        shared.confirmModalCancelBtn.click();

        // Confirm modal is closed, Submit button is not enabled
        expect(shared.successMessage.isPresent()).toBeFalsy();
        expect(shared.confirmModal.isPresent()).toBeFalsy();
        expect(users.submitFormBtn.isEnabled()).toBeFalsy();
        expect(users.activeToggleInput.isSelected()).toBe(originalStatus);
      });
    });

    it('should update status after accepting Confirm modal', function() {
      shared.firstTableRow.getText().then(function(firstTableText) {
        if (firstTableText.indexOf(params.login.user) == -1) { // Not logged in user
          shared.firstTableRow.click();
        } else {
          shared.secondTableRow.click();
        }
      }).then(function() {
        // Select Status toggle
        var originalStatus = users.activeToggleInput.isSelected();
        users.activeFormToggle.click();

        // Confirm modal is displayed
        shared.waitForConfirm();
        shared.confirmModalOkBtn.click().then(function() {
          shared.waitForSuccess();

          // Confirm modal is closed, Submit button is not enabled
          expect(shared.confirmModal.isPresent()).toBeFalsy();
          expect(users.submitFormBtn.isEnabled()).toBeFalsy();
          expect(users.activeToggleInput.isSelected()).not.toBe(originalStatus);
        });
      });
    });
  });

  describe('on the Skills Management page', function() {
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
      browser.get(shared.skillsPageUrl);
    });

    it('should should display confirmation modal', function() {
      shared.firstTableRow.click();

      // Select Status toggle
      shared.activeFormToggle.click();

      // Confirm modal is displayed
      shared.waitForConfirm();

      expect(shared.confirmModal.isDisplayed()).toBeTruthy();
      expect(['This will enable this skill. Do you want to continue?', 'This will disable this skill. Do you want to continue?']).toContain(shared.confirmModalMsg.getText());
      expect(shared.confirmModalCancelBtn.isDisplayed()).toBeTruthy();
      expect(shared.confirmModalOkBtn.isDisplayed()).toBeTruthy();
    });

    it('should not update status after dismissing Confirm modal', function() {
      shared.firstTableRow.click();

      // Select Status toggle
      var originalStatus = shared.activeToggleInput.isSelected();
      shared.activeFormToggle.click();

      // Confirm modal is displayed
      shared.waitForConfirm();
      shared.confirmModalCancelBtn.click();


      // Confirm modal is closed, Submit button is not enabled
      expect(shared.successMessage.isPresent()).toBeFalsy();
      expect(shared.confirmModal.isPresent()).toBeFalsy();
      expect(shared.submitFormBtn.isEnabled()).toBeFalsy();
      expect(shared.activeToggleInput.isSelected()).toBe(originalStatus);
    });

    it('should update status after accepting Confirm modal', function() {
      shared.firstTableRow.click();

      // Select Status toggle
      var originalStatus = shared.activeToggleInput.isSelected();
      shared.activeFormToggle.click();

      // Confirm modal is displayed
      shared.waitForConfirm();
      shared.confirmModalOkBtn.click().then(function() {
        shared.waitForSuccess();

        // Confirm modal is closed, Submit button is not enabled
        expect(shared.confirmModal.isPresent()).toBeFalsy();
        expect(shared.submitFormBtn.isEnabled()).toBeFalsy();
        expect(shared.activeToggleInput.isSelected()).not.toBe(originalStatus);
      });
    });
  });

  describe('on the Groups Management page', function() {
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
      browser.get(shared.groupsPageUrl);
    });

    it('should should display confirmation modal', function() {
      shared.firstTableRow.getText().then(function(firstTableText) {
        if (firstTableText.indexOf('everyone') == -1) {
          shared.firstTableRow.click();
        } else {
          shared.secondTableRow.click();
        }
      }).then(function() {
        // Select Status toggle
        shared.activeFormToggle.click();

        // Confirm modal is displayed
        shared.waitForConfirm();

        expect(shared.confirmModal.isDisplayed()).toBeTruthy();
        expect(['This will disable this group. Do you want to continue?', 'This will enable this group. Do you want to continue?']).toContain(shared.confirmModalMsg.getText());
        expect(shared.confirmModalCancelBtn.isDisplayed()).toBeTruthy();
        expect(shared.confirmModalOkBtn.isDisplayed()).toBeTruthy();
      });
    });

    it('should not update status after dismissing Confirm modal', function() {
      shared.firstTableRow.getText().then(function(firstTableText) {
        if (firstTableText.indexOf('everyone') == -1) {
          shared.firstTableRow.click();
        } else {
          shared.secondTableRow.click();
        }
      }).then(function() {
        // Select Status toggle
        var originalStatus = shared.activeToggleInput.isSelected();
        shared.activeFormToggle.click();

        // Confirm modal is displayed
        shared.waitForConfirm();
        shared.confirmModalCancelBtn.click();


        // Confirm modal is closed, Submit button is not enabled
        expect(shared.successMessage.isPresent()).toBeFalsy();
        expect(shared.confirmModal.isPresent()).toBeFalsy();
        expect(shared.submitFormBtn.isEnabled()).toBeFalsy();
        expect(shared.activeToggleInput.isSelected()).toBe(originalStatus);
      });
    });

    it('should update status after accepting Confirm modal', function() {
      shared.firstTableRow.getText().then(function(firstTableText) {
        if (firstTableText.indexOf('everyone') == -1) {
          shared.firstTableRow.click();
        } else {
          shared.secondTableRow.click();
        }
      }).then(function() {
        // Select Status toggle
        var originalStatus = shared.activeToggleInput.isSelected();
        shared.activeFormToggle.click();

        // Confirm modal is displayed
        shared.waitForConfirm();
        shared.confirmModalOkBtn.click().then(function() {
          shared.waitForSuccess();

          // Confirm modal is closed, Submit button is not enabled
          expect(shared.confirmModal.isPresent()).toBeFalsy();
          expect(shared.submitFormBtn.isEnabled()).toBeFalsy();
          expect(shared.activeToggleInput.isSelected()).not.toBe(originalStatus);
        });
      });
    });
  });
});

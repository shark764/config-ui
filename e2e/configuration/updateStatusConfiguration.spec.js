'use strict';

describe('The status update', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  describe('on the Tenants Management page', function() {
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
      browser.get(shared.tenantsPageUrl);
    });

    it('should should display confirmation modal', function() {
      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstRowName) {
        if (firstRowName.indexOf('Platform') == -1) { // Not platform tenant
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
        expect(['This will disable this tenant. Do you want to continue?', 'This will enable this tenant. Do you want to continue?']).toContain(shared.confirmModalMsg.getText());
        expect(shared.confirmModalCancelBtn.isDisplayed()).toBeTruthy();
        expect(shared.confirmModalOkBtn.isDisplayed()).toBeTruthy();
      });
    });

    it('should not update status after dismissing Confirm modal', function() {
      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstRowName) {
        if (firstRowName.indexOf('Platform') == -1) { // Not platform tenant
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
      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstRowName) {
        if (firstRowName.indexOf('Platform') == -1) { // Not platform tenant
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

  describe('on the Integration Management page', function() {
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
      browser.get(shared.integrationsPageUrl);
    });

    it('should should display confirmation modal', function() {
      shared.firstTableRow.click();

      // Select Status toggle
      shared.activeFormToggle.click();

      // Confirm modal is displayed
      shared.waitForConfirm();

      expect(shared.confirmModal.isDisplayed()).toBeTruthy();
      expect(['This will enable this integration. Do you want to continue?', 'This will disable this integration. Do you want to continue?']).toContain(shared.confirmModalMsg.getText());
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

  describe('on the Lists page', function() {
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
      browser.get(shared.listsPageUrl);
    });

    it('should should display confirmation modal', function() {
      shared.firstTableRow.click();

      // Select Status toggle
      shared.activeFormToggle.click();

      // Confirm modal is displayed
      shared.waitForConfirm();

      expect(shared.confirmModal.isDisplayed()).toBeTruthy();
      expect(['Are you sure you want to disable this list?', 'Are you sure you want to enable this list?']).toContain(shared.confirmModalMsg.getText());
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

  describe('on the Business Hours Management page', function() {
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
      browser.get(shared.businessHoursPageUrl);
    });

    it('should should display confirmation modal', function() {
      shared.firstTableRow.click();

      // Select Status toggle
      shared.activeFormToggle.click();

      // Confirm modal is displayed
      shared.waitForConfirm();

      expect(shared.confirmModal.isDisplayed()).toBeTruthy();
      expect(['This will disable these business hours. Do you want to continue?', 'This will enable these business hours. Do you want to continue?']).toContain(shared.confirmModalMsg.getText());
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
});

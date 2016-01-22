'use strict';

describe('The status update', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    columns = require('../tableControls/columns.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  describe('on the Flows Management page', function() {
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
      browser.get(shared.flowsPageUrl);

      // Sort flows by Active Version
      columns.columnFourHeader.click();
    });

    it('should should display confirmation modal', function() {
      shared.firstTableRow.click();

      // Select Status toggle
      shared.activeFormToggle.click();

      // Confirm modal is displayed
      shared.waitForConfirm();

      expect(shared.confirmModal.isDisplayed()).toBeTruthy();
      expect(['This will disable this flow. Do you want to continue?', 'This will enable this flow. Do you want to continue?']).toContain(shared.confirmModalMsg.getText());
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
      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstRowVersion) {
        if (firstRowVersion) { // Flow has an active version
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
        }
      });
    });
  });

  describe('on the Queue Management page', function() {
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
      browser.get(shared.queuesPageUrl);
    });

    it('should should display confirmation modal', function() {
      shared.firstTableRow.click();

      // Select Status toggle
      shared.activeFormToggle.click();

      // Confirm modal is displayed
      shared.waitForConfirm();

      expect(shared.confirmModal.isDisplayed()).toBeTruthy();
      expect(['This will enable this queue. Do you want to continue?', 'This will disable this queue. Do you want to continue?']).toContain(shared.confirmModalMsg.getText());
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

  describe('on the Dispatch Mapping Management page', function() {
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
      browser.get(shared.dispatchMappingsPageUrl);
    });

    it('should should display confirmation modal', function() {
      shared.firstTableRow.click();

      // Select Status toggle
      shared.activeFormToggle.click();

      // Confirm modal is displayed
      shared.waitForConfirm();

      expect(shared.confirmModal.isDisplayed()).toBeTruthy();
      expect(['This will disable this dispatch mapping. Do you want to continue?', 'This will enable this dispatch mapping. Do you want to continue?']).toContain(shared.confirmModalMsg.getText());
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

'use strict';

describe('The queues view bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    shared = require('../shared.po.js'),
    queues = require('./queues.po.js'),
    params = browser.params,
    queueCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);

    // Create new queue
    browser.get(shared.queuesPageUrl);
    var randomQueue = Math.floor((Math.random() * 100) + 1);
    shared.createBtn.click();
    queues.nameFormField.sendKeys('Queue ' + randomQueue);
    shared.submitFormBtn.click();
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.queuesPageUrl);
    queueCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });


  it('should allow updates to supported bulk action fields', function() {
    shared.actionsBtn.click();
    expect(bulkActions.bulkActionDivs.count()).toBe(1);

    // Enable Queues
    expect(bulkActions.selectEnable.isDisplayed()).toBeTruthy();
    expect(bulkActions.enableDropdown.isDisplayed()).toBeTruthy();
  });

  it('should allow all selected queue\'s status to be Disabled', function() {
    shared.actionsBtn.click();

    shared.tableElements.count().then(function(queueCount) {
      for (var i = 0; i < queueCount && i < 5; i++) { // Reduce test length
        bulkActions.selectItemTableCells.get(i).click();
      }

      bulkActions.selectEnable.click();
      bulkActions.disableDropdownOption.click();

      expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
      bulkActions.submitFormBtn.click();

      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        shared.waitForSuccess();
        shared.successMessage.click();

        // All queues are set to disabled
        // Leave Disabled selected from Status drop down
        bulkActions.statusColumnDropDownLabel.click();
        bulkActions.statuses.get(1).click();
        shared.tableElements.count().then(function(disabledTotal) {
          expect(disabledTotal).not.toBeLessThan(Math.min(5, queueCount));
        });

        // Select Enabled from Status drop down
        bulkActions.statuses.get(0).click();
        bulkActions.statuses.get(1).click();
        shared.tableElements.count().then(function(enabledTotal) {
          expect(enabledTotal).not.toBeGreaterThan(queueCount - 5);
        });
      });
    });
  });

  it('should allow all selected queue\'s status to be Enabled', function() {    
    shared.actionsBtn.click();

    shared.tableElements.count().then(function(queueCount) {
      for (var i = 0; i < queueCount && i < 5; i++) { // Reduce test length
        bulkActions.selectItemTableCells.get(i).click();
      }

      bulkActions.selectEnable.click();
      bulkActions.enableDropdownOption.click();

      expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
      bulkActions.submitFormBtn.click();

      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        shared.waitForSuccess();
        shared.successMessage.click();

        // All queues are set to disabled
        // Leave Disabled selected from Status drop down
        bulkActions.statusColumnDropDownLabel.click();
        bulkActions.statuses.get(1).click();
        shared.tableElements.count().then(function(disabledTotal) {
          expect(disabledTotal).not.toBeGreaterThan(queueCount - 5);
        });

        // Select Enabled from Status drop down
        bulkActions.statuses.get(0).click();
        bulkActions.statuses.get(1).click();
        shared.tableElements.count().then(function(enabledTotal) {
          expect(enabledTotal).not.toBeLessThan(Math.min(5, queueCount));
        });
      });
    });
  });

  it('should ignore disabled fields on update', function() {
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.enableDropdownOption.click();

    // Disable Enable toggle
    bulkActions.selectEnable.click();
    expect(bulkActions.enableDropdown.getAttribute('disabled')).toBeTruthy();

    // No bulk actions to perform
    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isPresent()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should only affect selected queues', function() {
    shared.tableElements.then(function(originalQueues) {
      // Select odd queues and leave even queues unselected
      for (var i = 0; i < originalQueues.length; i++) {
        if (i % 2 > 0) {
          bulkActions.selectItemTableCells.get(i).click();
        }
      }
      shared.actionsBtn.click();
      bulkActions.selectAllTableHeader.click();

      // Disable selected Queues
      bulkActions.selectEnable.click();
      bulkActions.disableDropdownOption.click();

      bulkActions.submitFormBtn.click();

      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        shared.waitForSuccess();
        shared.successMessage.click();

        // Only selected queues are updated
        for (var i = 0; i < originalQueues.length; i++) {
          if (i % 2 > 0) {
            // Queue was updated to Disabled
            expect(shared.tableElements.get(i).getText()).toContain('Disabled');
          } else {
            // Queue status remains unchanged
            expect(shared.tableElements.get(i).getText()).toBe(originalQueues[i].getText());
          }
        }
      });
    });
  });

});

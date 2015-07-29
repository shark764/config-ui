'use strict';

describe('The groups view bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    shared = require('../shared.po.js'),
    groups = require('./groups.po.js'),
    params = browser.params,
    groupCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.groupsPageUrl);
    groupCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });


  it('should allow updates to supported bulk action fields', function() {
    shared.actionsBtn.click();
    expect(bulkActions.bulkActionDivs.count()).toBe(1);

    // Enable Groups
    expect(bulkActions.selectEnable.isDisplayed()).toBeTruthy();
    expect(bulkActions.enableToggle.isDisplayed()).toBeTruthy();
  });

  it('should allow all selected group\'s status to be Disabled', function() {
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

      // All groups are set to disabled
      // Select Disabled from Status drop down
      bulkActions.statusTableDropDown.click();
      bulkActions.groupStatuses.get(0).click();
      shared.tableElements.count().then(function(disabledTotal) {
        expect(disabledTotal).toBe(groupCount);
      });

      // Select Enabled from Status drop down
      bulkActions.groupStatuses.get(1).click();
      shared.tableElements.count().then(function(enabledTotal) {
        expect(enabledTotal).toBe(0);
      });
    });
  });

  it('should allow all selected group\'s status to be Enabled', function() {
    // Update All bulk actions
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.enableToggle.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Form reset
      expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

      // All groups are set to enabled
      // Select Disabled from Status drop down
      bulkActions.statusTableDropDown.click();
      bulkActions.groupStatuses.get(0).click();
      shared.tableElements.count().then(function(disabledTotal) {
        expect(disabledTotal).toBe(0);
      });

      // Select Enabled from Status drop down
      bulkActions.groupStatuses.get(1).click();
      shared.tableElements.count().then(function(enabledTotal) {
        expect(enabledTotal).toBe(groupCount);
      });
    });
  });

  it('should ignore disabled fields on update', function() {
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.enableToggle.click();

    // Disable Enable toggle
    bulkActions.selectEnable.click();
    expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

    // No bulk actions to perform
    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isPresent()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});

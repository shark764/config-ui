'use strict';

describe('The unsaved changes warning', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    navbar = require('./navbar.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    params = browser.params,
    alertDialog,
    randomUser;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
    //browser.get(shared.usersPageUrl);
  });

  afterAll(function() {
    //shared.tearDown();
  });

  it('should be displayed after changing form fields and selecting cancel', function() {
    shared.firstTableRow.click();

    // Make changes to user form fields
    users.firstNameFormField.sendKeys('unsavedEdit');
    users.lastNameFormField.sendKeys('unsavedEdit');

    // Select cancel
    shared.cancelFormBtn.click().then(function() {
      shared.waitForAlert();

      // Warning message is displayed
      alertDialog = browser.driver.switchTo().alert();
      expect(alertDialog.accept).toBeDefined();
      expect(alertDialog.dismiss).toBeDefined();
    });
  });

  it('should be closed after changing form fields, selecting cancel and clear fields after accepting warning', function() {
    // Accept warning message to clear changes
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Fields are reset
    shared.firstTableRow.element(by.css(users.nameColumn)).getText().then(function(firstRowName) {
      if (firstRowName) {
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      } else {
        expect(users.firstNameFormField.getAttribute('value')).toBe('');
        expect(users.lastNameFormField.getAttribute('value')).toBe('');
      }
    });
  });

  it('should be closed after changing form fields, selecting cancel and dismissing warning', function() {
    users.firstNameFormField.sendKeys('unsavedEdit');
    users.lastNameFormField.sendKeys('unsavedEdit');

    var updatedFirstName = users.firstNameFormField.getAttribute('value');
    var updatedLastName = users.lastNameFormField.getAttribute('value');

    // Select cancel
    shared.cancelFormBtn.click();

    // Dismiss warning message to keep changes
    shared.waitForAlert();
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss();

    // Fields remain unchanged
    expect(users.firstNameFormField.getAttribute('value')).toContain(updatedFirstName);
    expect(users.lastNameFormField.getAttribute('value')).toContain(updatedLastName);
  });

  it('should be displayed after changing form fields and selecting Create', function() {
    shared.createBtn.click().then(function() {
      shared.waitForAlert();

      // Warning message is displayed
      alertDialog = browser.switchTo().alert();
      expect(alertDialog.accept).toBeDefined();
      expect(alertDialog.dismiss).toBeDefined();
    });
  });

  it('should be closed after changing form fields, selecting Create and dismissing warning', function() {
    // Dismiss warning message to keep changes
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss();

    // Fields remain unchanged
    expect(users.firstNameFormField.getAttribute('value')).toContain('unsavedEdit');
    expect(users.lastNameFormField.getAttribute('value')).toContain('unsavedEdit');
  });

  it('should be closed after changing form fields, selecting Create and clear fields after accepting warning', function() {
    // Select create
    shared.createBtn.click();
    shared.waitForAlert();

    // Accept warning message to clear changes
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Create fields are displayed and empty
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.externalIdFormField.getAttribute('value')).toBe('');
  });

  it('should be displayed after completing create form fields and selecting cancel', function() {
    randomUser = Math.floor((Math.random() * 1000) + 1);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get(1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First');
    users.lastNameFormField.sendKeys('Last');

    // Select cancel
    shared.cancelFormBtn.click().then(function() {
      shared.waitForAlert();

      // Warning message is displayed
      alertDialog = browser.switchTo().alert();
      expect(alertDialog.accept).toBeDefined();
      expect(alertDialog.dismiss).toBeDefined();
    });
  });

  it('should be closed after completing create forms, selecting cancel and hide the panel after accepting warning', function() {
    // Accept warning message to clear changes
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Panel is hidden
    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
  });

  it('should be closed after selecting cancel and dismissing warning', function() {
    // Select create
    shared.createBtn.click();

    randomUser = Math.floor((Math.random() * 1000) + 1);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get(1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First');
    users.lastNameFormField.sendKeys('Last');

    // Select cancel
    shared.cancelFormBtn.click();
    shared.waitForAlert();

    // Accept warning message to keep changes
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss();

    // Fields remain unchanged
    expect(users.firstNameFormField.getAttribute('value')).toBe('First');
    expect(users.lastNameFormField.getAttribute('value')).toBe('Last');
    expect(users.emailFormField.getAttribute('value')).toBe('titantest' + randomUser + '@mailinator.com');
  });

  it('should be displayed after completing create form fields and selecting row', function() {
    // Select user row
    shared.firstTableRow.click();
    shared.waitForAlert();

    // Warning message is displayed
    alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
  });

  it('should be closed after selecting row and clear fields after accepting warning', function() {
    // Accept warning message to clear changes and show selected user
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Fields show selected user values
    shared.firstTableRow.element(by.css(users.nameColumn)).getText().then(function(firstRowName) {
      if (firstRowName) {
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
        expect(shared.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(shared.detailsFormHeader.getText());
      } else {
        expect(users.firstNameFormField.getAttribute('value')).toBe('');
        expect(users.lastNameFormField.getAttribute('value')).toBe('');
        expect(shared.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
        expect(shared.detailsFormHeader.getText()).toBe('');
      }
    });
  });

  it('should be closed after selecting row and dismissing warning', function() {
    // Complete create user form fields
    shared.createBtn.click();
    randomUser = Math.floor((Math.random() * 1000) + 1);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get(1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First');
    users.lastNameFormField.sendKeys('Last');

    // Select user row
    shared.firstTableRow.click();
    shared.waitForAlert();

    // Accept warning message to keep changes
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss();

    // Fields remain unchanged
    expect(users.firstNameFormField.getAttribute('value')).toBe('First');
    expect(users.lastNameFormField.getAttribute('value')).toBe('Last');
    expect(users.emailFormField.getAttribute('value')).toBe('titantest' + randomUser + '@mailinator.com');
  });

  it('should be displayed after completing create form fields and selecting navigation button', function() {
    // Select Tenants nav button
    browser.actions().mouseMove(shared.tenantsNavButton).perform();
    navbar.tenantsLink.click().then(function() {
      shared.waitForAlert();

      // Warning message is displayed
      alertDialog = browser.switchTo().alert();
      expect(alertDialog.accept).toBeDefined();
      expect(alertDialog.dismiss).toBeDefined();
    });
  });

  it('should be closed after selecting nav button and change page after dismissing warning', function() {
    // Dismiss warning message to keep changes
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss().then(function() {
      // Fields and page remain unchanged
      expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
      expect(users.firstNameFormField.getAttribute('value')).toBe('First');
      expect(users.lastNameFormField.getAttribute('value')).toBe('Last');
      expect(users.emailFormField.getAttribute('value')).toBe('titantest' + randomUser + '@mailinator.com');
    });
  });

  it('should be closed after selecting nav button and change page after accepting warning', function() {
    // Select Tenants nav button
    browser.actions().mouseMove(shared.tenantsNavButton).perform();
    navbar.tenantsLink.click();

    shared.waitForAlert();

    // Accept warning message to clear changes and change page
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Navigates to selected page
    expect(browser.getCurrentUrl()).toContain(shared.tenantsPageUrl);
  });

  it('should not be displayed after accepting until new form is dirtied', function() {
    // Select Users nav button
    browser.actions().mouseMove(shared.usersNavButton).perform();
    navbar.userLink.click();

    var alertPresent;

    browser.switchTo().alert().then(
      function(alert) {
        alertPresent = true;
      },
      function(err) {
        alertPresent = false;
      }
    ).then(function() {
      expect(alertPresent).toBeFalsy();
    });
  });

  it('should be displayed after making changes to Bulk Actions when Cancel or X is selected', function() {
    shared.actionsBtn.click().then(function () {
      expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();
      bulkActions.userSelectEnable.click();

      // Unsaved changes warning on Cancel
      bulkActions.cancelFormBtn.click();
      shared.waitForAlert();
      alertDialog = browser.switchTo().alert();
      alertDialog.accept();
      expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();

      // Form reset
      expect(bulkActions.userSelectEnable.getAttribute('selected')).toBeFalsy();
      expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      bulkActions.cancelFormBtn.click();

      // No alert and panel closed
      expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();

      // Unsaved changes warning on X
      shared.actionsBtn.click().then(function () {
        expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();
        bulkActions.userSelectEnable.click();
        bulkActions.closeFormBtn.click();
        shared.waitForAlert();
        alertDialog = browser.switchTo().alert();
        alertDialog.accept();
        expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();
      });
    });
  });

  it('should be displayed when switching between Create and Bulk Actions panels', function() {
    shared.actionsBtn.click().then(function () {
      bulkActions.userSelectEnable.click();

      shared.createBtn.click();
      shared.waitForAlert();
      alertDialog = browser.switchTo().alert();
      alertDialog.accept();
      expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();
      expect(shared.rightPanel.isDisplayed()).toBeTruthy();

      shared.createBtn.click();
      users.emailFormField.sendKeys('test');

      shared.actionsBtn.click();
      shared.waitForAlert();
      alertDialog = browser.switchTo().alert();
      alertDialog.accept();
      expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();
    });
  });

  it('should be displayed when switching between Details and Bulk Actions panels', function() {
    browser.get(shared.usersPageUrl);
    shared.tableElements.count().then(function(tableCount) {
      if (tableCount > 0) {
        shared.actionsBtn.click();
        bulkActions.userSelectEnable.click();
        shared.firstTableRow.click();
        shared.waitForAlert();
        alertDialog = browser.switchTo().alert();
        alertDialog.accept();
        expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();
        expect(shared.rightPanel.isDisplayed()).toBeTruthy();

        users.firstNameFormField.sendKeys('test');
        shared.actionsBtn.click();
        shared.waitForAlert();
        alertDialog = browser.switchTo().alert();
        alertDialog.accept();
        expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();
      }
    });
  });

  it('should only be displayed once after switching between Details and Bulk Actions panels', function() {
    browser.get(shared.usersPageUrl);
    shared.tableElements.count().then(function(tableCount) {
      if (tableCount > 0) {
        shared.actionsBtn.click();
        bulkActions.userSelectEnable.click();
        shared.firstTableRow.click();
        shared.waitForAlert();
        alertDialog = browser.switchTo().alert();
        alertDialog.accept();
        expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();

        // select another user
        if (tableCount > 1) {
          shared.secondTableRow.click();
          // No unsaved changes warning
          expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();
        }
      }
    });
  });
});

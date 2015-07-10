'use strict';

describe('The unsaved changes warning', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    params = browser.params,
    alertDialog;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should be displayed after changing form fields and selecting cancel', function() {
    // Make changes to user form fields
    users.firstNameFormField.sendKeys('unsavedEdit');
    users.lastNameFormField.sendKeys('unsavedEdit');
    users.displayNameFormField.sendKeys('unsavedEdit');

    // Select cancel
    shared.cancelFormBtn.click().then(function() {
      // Warning message is displayed
      alertDialog = browser.switchTo().alert();
      expect(alertDialog.accept).toBeDefined();
      expect(alertDialog.dismiss).toBeDefined();
    });
  });

  it('should be closed after changing form fields, selecting cancel and clear fields after accepting warning', function() {
    // Accept warning message to clear changes
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Fields are reset
    expect(users.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
    expect(users.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
    expect(users.firstTableRow.element(by.css(users.displayNameColumn)).getText()).toBe(users.displayNameFormField.getAttribute('value'));
  });

  it('should be closed after changing form fields, selecting cancel and dismissing warning', function() {
    users.firstNameFormField.sendKeys('unsavedEdit');
    users.lastNameFormField.sendKeys('unsavedEdit');
    users.displayNameFormField.sendKeys('unsavedEdit');

    var updatedFirstName = users.firstNameFormField.getAttribute('value');
    var updatedLastName = users.lastNameFormField.getAttribute('value');
    var updatedDisplayName = users.displayNameFormField.getAttribute('value');

    // Select cancel
    shared.cancelFormBtn.click();

    // Dismiss warning message to keep changes
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss();

    // Fields remain unchanged
    expect(users.firstNameFormField.getAttribute('value')).toContain(updatedFirstName);
    expect(users.lastNameFormField.getAttribute('value')).toContain(updatedLastName);
    expect(users.displayNameFormField.getAttribute('value')).toContain(updatedDisplayName);
  });

  it('should be displayed after changing form fields and selecting Create', function() {
    shared.createBtn.click().then(function() {
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
    expect(users.displayNameFormField.getAttribute('value')).toContain('unsavedEdit');
  });

  it('should be closed after changing form fields, selecting Create and clear fields after accepting warning', function() {
    // Select create
    shared.createBtn.click();

    // Accept warning message to clear changes
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Create fields are displayed and empty
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.displayNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.externalIdFormField.getAttribute('value')).toBe('');
  });

  it('should be displayed after completing create form fields and selecting cancel', function() {
    users.firstNameFormField.sendKeys('First');
    users.lastNameFormField.sendKeys('Last');
    users.emailFormField.sendKeys('titantest@mailinator.com');
    users.passwordFormField.sendKeys('password');

    // Select cancel
    shared.cancelFormBtn.click().then(function() {
      // Warning message is displayed
      alertDialog = browser.switchTo().alert();
      expect(alertDialog.accept).toBeDefined();
      expect(alertDialog.dismiss).toBeDefined();
    });
  });

  it('should be closed after completing create forms, selecting cancel and clear fields after accepting warning', function() {
    // Accept warning message to clear changes
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Fields are cleared
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.displayNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.externalIdFormField.getAttribute('value')).toBe('');
  });

  it('should be closed after selecting cancel and dismissing warning', function() {
    users.firstNameFormField.sendKeys('First');
    users.lastNameFormField.sendKeys('Last');
    users.emailFormField.sendKeys('titantest@mailinator.com');
    users.passwordFormField.sendKeys('password');

    // Select cancel
    shared.cancelFormBtn.click();

    // Accept warning message to keep changes
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss();

    // Fields remain unchanged
    expect(users.firstNameFormField.getAttribute('value')).toBe('First');
    expect(users.lastNameFormField.getAttribute('value')).toBe('Last');
    expect(users.emailFormField.getAttribute('value')).toBe('titantest@mailinator.com');
  });

  it('should be displayed after completing create form fields and selecting row', function() {
    // Select user row
    users.firstTableRow.click();

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
    expect(users.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
    expect(users.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
    expect(users.firstTableRow.element(by.css(users.displayNameColumn)).getText()).toBe(users.displayNameFormField.getAttribute('value'));
    expect(users.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
    expect(users.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
    expect(users.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(shared.detailsFormHeader.getText());
  });

  it('should be closed after selecting row and dismissing warning', function() {
    // Complete create user form fields
    shared.createBtn.click();
    users.firstNameFormField.sendKeys('First');
    users.lastNameFormField.sendKeys('Last');
    users.emailFormField.sendKeys('titantest@mailinator.com');
    users.passwordFormField.sendKeys('password');

    // Select user row
    users.firstTableRow.click();

    // Accept warning message to keep changes
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss();

    // Fields remain unchanged
    expect(users.firstNameFormField.getAttribute('value')).toBe('First');
    expect(users.lastNameFormField.getAttribute('value')).toBe('Last');
    expect(users.emailFormField.getAttribute('value')).toBe('titantest@mailinator.com');
  });

  it('should be displayed after completing create form fields and selecting navigation button', function() {
    // Select Tenants nav button
    shared.tenantsNavButton.click().then(function() {
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
      expect(users.emailFormField.getAttribute('value')).toBe('titantest@mailinator.com');
    });
  });

  it('should be closed after selecting nav button and change page after accepting warning', function() {
    // Select Tenants nav button
    shared.tenantsNavButton.click();

    // Accept warning message to clear changes and change page
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Navigates to selected page
    expect(browser.getCurrentUrl()).toContain(shared.tenantsPageUrl);
  });

  it('should not be displayed after accepting until new form is dirtied', function() {
    // Select Users nav button
    shared.usersNavButton.click();
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
});

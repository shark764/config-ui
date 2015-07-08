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

  it('should be displayed after completing create form fields and selecting cancel', function() {
    // Complete create user form fields
    shared.createBtn.click();
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

  it('should be closed after selecting cancel and clear fields after dismissing warning', function() {
    // Dismiss warning message to clear changes
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss();

    // Fields are cleared
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.displayNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.externalIdFormField.getAttribute('value')).toBe('');
  });


  it('should be closed after selecting cancel and accepting warning', function() {
    users.firstNameFormField.sendKeys('First');
    users.lastNameFormField.sendKeys('Last');
    users.emailFormField.sendKeys('titantest@mailinator.com');
    users.passwordFormField.sendKeys('password');

    // Select cancel
    shared.cancelFormBtn.click();

    // Accept warning message to keep changes
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Fields remain unchanged
    expect(users.firstNameFormField.getAttribute('value')).toBe('First');
    expect(users.lastNameFormField.getAttribute('value')).toBe('Last');
    expect(users.emailFormField.getAttribute('value')).toBe('titantest@mailinator.com');
  });

  xit('should be displayed after completing create form fields and selecting row', function() {
    // Select user row
    users.firstTableRow.click();

    // Warning message is displayed
    alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
  });

  xit('should be closed after selecting row and clear fields after dismissing warning', function() {
    // Dismiss warning message to clear changes and show selected user
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss();

    // Fields show selected user values
    expect(users.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
    expect(users.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
    expect(users.firstTableRow.element(by.css(users.displayNameColumn)).getText()).toBe(users.displayNameFormField.getAttribute('value'));
    expect(users.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
    expect(users.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
    expect(users.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(shared.detailsFormHeader.getText());
  });

  xit('should be closed after selecting row and accepting warning', function() {
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
    alertDialog.accept();

    // Fields remain unchanged
    expect(users.firstNameFormField.getAttribute('value')).toBe('First');
    expect(users.lastNameFormField.getAttribute('value')).toBe('Last');
    expect(users.emailFormField.getAttribute('value')).toBe('titantest@mailinator.com');
  });

  xit('should be displayed after completing create form fields and selecting navigation button', function() {
    // Select Tenants nav button
    shared.tenantsNavButton.click().then(function() {
      // Warning message is displayed
      alertDialog = browser.switchTo().alert();
      expect(alertDialog.accept).toBeDefined();
      expect(alertDialog.dismiss).toBeDefined();
    });
  });

  xit('should be closed after selecting nav button and change page after accepting warning', function() {
    // Accept warning message to clear changes and change page
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();

    // Navigates to selected page
    expect(browser.getCurrentUrl()).toContain(shared.tenantsPageUrl);
  });

  xit('should be closed after selecting row and dismissing warning', function() {
    // Select Tenants nav button
    shared.usersNavButton.click();

    // Complete create user form fields
    shared.createBtn.click();
    users.firstNameFormField.sendKeys('First');
    users.lastNameFormField.sendKeys('Last');
    users.emailFormField.sendKeys('titantest@mailinator.com');
    users.passwordFormField.sendKeys('password');

    // Select Tenants nav button
    shared.tenantsNavButton.click();

    // Accept warning message to keep changes
    alertDialog = browser.switchTo().alert();
    alertDialog.dismiss().then(function() {
      // Fields and page remain unchanged
      expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
      expect(users.firstNameFormField.getAttribute('value')).toBe('First');
      expect(users.lastNameFormField.getAttribute('value')).toBe('Last');
      expect(users.emailFormField.getAttribute('value')).toBe('titantest@mailinator.com');
    });
  });
});

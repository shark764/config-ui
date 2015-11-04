'use strict';

describe('The tenants view', function() {
  var loginPage = require('../login/login.po.js'),
    tenants = require('./tenants.po.js'),
    profile = require('../userProfile/profile.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params,
    tenantCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
    browser.get(shared.tenantsPageUrl);
    // TITAN2-4878
    //tenants.createTenant();
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.tenantsPageUrl);
    tenantCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include list of tenants, create tenant section and standard page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavButton.getText()).toBe('Configuration');

    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeFalsy(); //Hide side panel by default
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Tenant Management');
  });


  it('should display users in the admin dropdown', function() {
    shared.createBtn.click();

    var adminUserList = [];
    tenants.adminDropDownItems.each(function(adminElement, index) {
      if (index < 10) { // Only check first 10 users to limit test length
        adminElement.getText().then(function(adminName) {
          adminUserList.push(adminName);
        });
      }
    }).then(function() {
      browser.get(shared.usersPageUrl);

      // Admin list on Tenants page should contain all Users
      for (var i = 0; i < adminUserList.length && i < 10; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(adminUserList[i]);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    });
  });

  it('should display users email in the admin dropdown when name is blank', function() {
    // Remove current user's first and last name
    browser.get(shared.profilePageUrl);
    profile.firstNameFormField.clear();
    profile.lastNameFormField.clear();

    profile.updateProfileBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeTruthy();

      // Verify that the user's email is displayed in the admin dropdown
      browser.get(shared.tenantsPageUrl);
      shared.createBtn.click();

      expect(tenants.adminFormDropDown.$('option:checked').getText()).toBe(params.login.user);
    }).then(function() {
      // Reset users name
      browser.get(shared.profilePageUrl);
      profile.firstNameFormField.sendKeys(params.login.firstName);
      profile.lastNameFormField.sendKeys(params.login.lastName);
      profile.updateProfileBtn.click();
      shared.waitForSuccess();
      expect(shared.successMessage.isPresent()).toBeTruthy();
    });
  });

  it('should display tenant details when selected from table', function() {
    tenants.firstTableRow.click();

    // Verify tenant name in table matches populated field
    expect(tenants.firstTableRow.element(by.css(tenants.nameColumn)).getText()).toContain(tenants.nameFormField.getAttribute('value'));
    expect(tenants.region.isDisplayed()).toBeTruthy();

    tenants.secondTableRow.isPresent().then(function(secondRowExists) {
      if (secondRowExists) {
        // Change selected tenant and ensure details are updated
        tenants.secondTableRow.click();

        expect(tenants.secondTableRow.element(by.css(tenants.nameColumn)).getText()).toContain(tenants.nameFormField.getAttribute('value'));
        expect(tenants.region.isDisplayed()).toBeTruthy();
      }
    });
  });

  it('should require name field when editing', function() {
    shared.tableElements.count().then(function(tenantCount) {
      if (tenantCount > 0) {
        tenants.firstTableRow.click().then(function() {
          tenants.nameFormField.clear();
          tenants.nameFormField.sendKeys('\t');

          // Submit button is still disabled
          expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
          shared.submitFormBtn.click();

          expect(tenants.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
          expect(tenants.nameRequiredError.get(0).getText()).toBe('Please enter a name');
          expect(shared.successMessage.isPresent()).toBeFalsy();
        });
      }
    });
  });

  it('should not require description when editing', function() {
    shared.searchField.sendKeys('Tenant'); // Ensure Platform tenant is not selected
    shared.tableElements.count().then(function(tenantCount) {
      if (tenantCount > 0) {
        tenants.firstTableRow.click();

        // Edit fields
        tenants.descriptionFormField.sendKeys('Edit');
        tenants.descriptionFormField.clear();
        shared.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();
        });
      }
    });
  });

  it('should reset fields after editing and selecting Cancel', function() {
    tenants.firstTableRow.click();

    var originalName = tenants.nameFormField.getAttribute('value');
    var originalDescription = tenants.descriptionFormField.getAttribute('value');
    var originalAdmin = tenants.adminFormDropDown.getAttribute('value');

    // Edit fields
    tenants.nameFormField.sendKeys('Edit');
    tenants.descriptionFormField.sendKeys('Edit');
    tenants.adminFormDropDown.all(by.css('option')).get(0).click();

    shared.cancelFormBtn.click();

    // Warning message is displayed
    shared.waitForAlert();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(tenants.nameFormField.getAttribute('value')).toBe(originalName);
    expect(tenants.descriptionFormField.getAttribute('value')).toBe(originalDescription);
    expect(tenants.adminFormDropDown.getAttribute('value')).toBe(originalAdmin);
  });

  it('should allow the tenant name, and description fields to be updated', function() {
    shared.searchField.sendKeys('Tenant'); // Ensure Platform tenant is not selected
    shared.tableElements.count().then(function(tenantCount) {
      if (tenantCount > 0) {
        tenants.firstTableRow.click();

        // Edit fields
        tenants.nameFormField.sendKeys('Edit');
        tenants.descriptionFormField.sendKeys('Edit');
        shared.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();
        });
      }
    });
  });

  xit('should allow tenant admin to be updated and update user permissions for new and previous admin', function() {
    // TODO Expected result to be determined
  });

  it('should update tenant name in table and nav dropdown when edited', function() {
    var tenantUpdated = false;

    shared.searchField.sendKeys('Tenant'); // Ensure Platform tenant is not selected
    shared.tableElements.count().then(function(tenantCount) {
      if (tenantCount > 0) {
        tenants.firstTableRow.click();

        tenants.nameFormField.getAttribute('value').then(function(previousTenantName) {
          // Edit fields
          tenants.nameFormField.sendKeys('Edit');
          shared.submitFormBtn.click().then(function(newTenantName) {
            expect(shared.successMessage.isDisplayed()).toBeTruthy();

            // Confirm tenant is displayed in tenant table with new name
            shared.tableElements.then(function(rows) {
              for (var i = 1; i <= rows.length; ++i) {
                element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > span:nth-child(1)')).getText().then(function(value) {
                  expect(value).not.toBe(previousTenantName);
                  if (value == (previousTenantName + 'Edit')) {
                    tenantUpdated = true;
                  }
                });
              }
            }).then(function() {
              // Verify tenants updated name was found in the table
              expect(tenantUpdated).toBeTruthy();
            }).then(function() {
              // Reset flag
              tenantUpdated = false;

              // Confirm tenant is listed in nav dropdown with new name
              shared.tenantsNavDropdown.click();

              shared.tenantsNavDropdownContents.then(function(tenants) {
                for (var i = 0; i < tenants.length; ++i) {
                  tenants[i].getText().then(function(value) {
                    expect(value).not.toBe(previousTenantName);
                    if (value == (previousTenantName + 'Edit')) {
                      tenantUpdated = true;
                    }
                  });
                }
              }).then(function() {
                // Verify tenants new name was found in the tenant dropdown
                expect(tenantUpdated).toBeTruthy();
              });
            });
          });
        });
      }
    });
  });
});

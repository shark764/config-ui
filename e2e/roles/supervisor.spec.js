'use strict';

describe('The Supervisor role', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    invites = require('../invitations/invites.po.js'),
    params = browser.params,
    randomUser,
    supervisorEmail;

  afterAll(function() {
    shared.tearDown();
  });

  it('should allow new user to be created with the role', function() {
    // Create user with supervisor role
    randomUser = Math.floor((Math.random() * 1000) + 1);
    supervisorEmail = 'supervisor' + randomUser + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys(supervisorEmail);
    users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'supervisor')).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('supervisor' + randomUser);
    users.lastNameFormField.sendKeys('Role' + randomUser);

    users.submitFormBtn.click().then(function() {

      // Wait to allow the API to send and Mailinator to receive the email
      invites.goToInvitationAcceptPage();

      browser.driver.wait(function() {
        return invites.submitFormBtn.isPresent().then(function(submitBtn) {
          console.log(submitBtn);
          return submitBtn;
        });
      }, 10000).then(function() {
        invites.passwordFormField.sendKeys('password');

        invites.submitFormBtn.click().then(function() {
          expect(shared.message.isDisplayed()).toBeTruthy();
          expect(shared.message.getText()).toBe('Your invitation has been accepted!');
        });
      });
    });
  });

  it('should only have access to the current tenant', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
  });

  it('should display nav bar links for User Management and Reporting paged only', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
  });

  it('should only have access to User Management page with limited permissions', function() {
    // no bulk
  });

  it('should only have access to Role Management page with limited permissions', function() {});

  it('should only have access to Group Management page with limited permissions', function() {});

  it('should not have access to other User Management pages', function() {});

  it('should not have access to any Configuration pages', function() {});

  it('should not have access to any Flow pages', function() {});

  it('should only have access to their user profile page', function() {});

  it('should have access to edit user profile details', function() {});

  it('should not have access to add a new User', function() {});
  it('should not have access to edit an existing User', function() {});
  it('should not have access to view existing User details', function() {});

  it('should not have access to add a new Role', function() {});
  it('should not have access to edit an existing Role', function() {});
  it('should not have access to view existing Role details', function() {});


  it('should not have access to add a new Group', function() {});
  it('should not have access to edit an existing Group', function() {});
  it('should not have access to view existing Group details', function() {});

});

'use strict';

describe('The Administrator role', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    invites = require('../invitations/invites.po.js'),
    params = browser.params,
    randomRole,
    administratorEmail,
    randomUser;

  afterAll(function() {
    shared.tearDown();
  });

  it('should allow new user to be created with the role', function() {
    // Create user with administrator role
    randomUser = Math.floor((Math.random() * 1000) + 1);
    administratorEmail = 'administrator' + randomUser + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys(administratorEmail);
    users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'administrator')).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('administrator' + randomUser);
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

  it('should display all nav bar links', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
  });

  it('should have access to all User Management pages with full access', function() {});


  it('should have access to all Configuration pages with full access', function() {});

  it('should have access to all Flow pages with full access', function() {});

  it('should have access to their user profile page', function() {});

  it('should have access to edit user profile details', function() {});

  it('should have access to add a new User', function() {});
  it('should have access to edit an existing User', function() {});
  it('should have access to view existing User details', function() {});

  it('should have access to add a new Role', function() {});
  it('should have access to edit an existing Role', function() {});
  it('should have access to view existing Role details', function() {});

  it('should have access to add a new Skill', function() {});
  it('should have access to edit an existing Skill', function() {});
  it('should have access to view existing Skill details', function() {});

  it('should have access to add a new Group', function() {});
  it('should have access to edit an existing Group', function() {});
  it('should have access to view existing Group details', function() {});

  it('should have access to add a new Tenant', function() {});
  it('should have access to edit current Tenant', function() {});
  it('should have access to view current Tenant details only', function() {});

  it('should have access to edit an existing Integration', function() {});
  it('should have access to view existing Integration details', function() {});

  it('should have access to add a new Group', function() {});
  it('should have access to edit an existing Group', function() {});
  it('should have access to view existing Group details', function() {});

  it('should have access to add a new Flow', function() {});
  it('should have access to edit an existing Flow', function() {});
  it('should have access to view existing Flow details', function() {});

  it('should have access to add a new Queue', function() {});
  it('should have access to edit an existing Queue', function() {});
  it('should have access to view existing Queue details', function() {});

  it('should have access to add a new Group', function() {});
  it('should have access to edit an existing Group', function() {});
  it('should have access to view existing Group details', function() {});

  it('should have access to add a new Media', function() {});
  it('should have access to edit an existing Media', function() {});
  it('should have access to view existing Media details', function() {});

  it('should have access to add a new Media Collection', function() {});
  it('should have access to edit an existing Media Collection', function() {});
  it('should have access to view existing Media Collection details', function() {});

  it('should have access to add a new Dispatch Mapping', function() {});
  it('should have access to edit an existing Dispatch Mapping', function() {});
  it('should have access to view existing Dispatch Mapping details', function() {});
});

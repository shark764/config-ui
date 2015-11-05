'use strict';

describe('The Administrator role', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    invites = require('../invitations/invites.po.js'),
    request = require('request'),
    params = browser.params,
    randomRole,
    administratorEmail,
    randomUser;
  var req,
    jar;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);

    // Create user with Administrator role
    randomUser = Math.floor((Math.random() * 1000) + 1);
    administratorEmail = 'administrator' + randomUser + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys(administratorEmail);
    users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'Administrator')).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('Administrator' + randomUser);
    users.lastNameFormField.sendKeys('Role' + randomUser);

    users.submitFormBtn.click().then(function() {
      shared.waitForSuccess();

      // Accept invite
      jar = request.jar();
      req = request.defaults({
        jar: jar
      });

      // Wait to allow the API to send and Mailinator to receive the email
      browser.sleep(2000).then(function() {
        // Verify user invitation email was sent
        // NOTE: Add user email when emails are not redirected
        req.get('https://api.mailinator.com/api/inbox?to=titantest&token=' + params.mailinator.token, '', function(error, response, body) {
          if (JSON.parse(body).messages.length > 0) {
            var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

            // Verify the newest message details
            expect(newestMessage.seconds_ago).toBeLessThan(60);

            // Prevent 429 response
            browser.sleep(2000).then(function() {
              // Get the newest message content
              req.get('https://api.mailinator.com/api/email?id=' + newestMessage.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
                if (body) {
                  var newestMessageContents = JSON.parse(body).data.parts[0].body;

                  // Verify link is correct
                  var acceptInvitationLink = newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0];
                  browser.get(acceptInvitationLink);

                  invites.passwordFormField.sendKeys('password');

                  expect(invites.submitFormBtn.getAttribute('disabled')).toBeNull();
                  invites.submitFormBtn.click().then(function() {
                    expect(shared.message.isDisplayed()).toBeTruthy();
                    expect(shared.message.getText()).toBe('Your invitation has been accepted!');
                  });
                } else { // Fail test
                  expect(true).toBeFalsy();
                }
              });
            });
          } else { // Fail test
            expect(true).toBeFalsy();
          }
        });
      });
    });
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.usersPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
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

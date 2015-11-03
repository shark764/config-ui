'use strict';

describe('The custom role', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    role = require('../management/role.po.js'),
    users = require('../management/users.po.js'),
    invites = require('../invitations/invites.po.js'),
    profile = require('../userProfile/profile.po.js'),
    request = require('request'),
    params = browser.params,
    roleCount,
    randomRole,
    customRoleEmail,
    addedMember;
  var req,
    jar;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);

    // Create custom role
    // Create user with custom role
    var randomUser = Math.floor((Math.random() * 1000) + 1);
    customRoleEmail = 'customRole' + randomUser + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys(customRoleEmail);
    users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'Custom Role')).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('Agent' + randomUser);
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
    browser.get(shared.profilePageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should only have access to the current tenant', function() {
    shared.tenantsNavDropdown.click();
    expect(shared.tenantsNavDropdownContents.count()).toBe(1);
    expect(shared.tenantsNavDropdownContents.get(0).getText()).toBe('Platform');
  });

  it('should display limited nav bar with Reporting link only', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.reportingNavButton.isDisplayed()).toBeTruthy();

    expect(shared.usersNavButton.isDisplayed()).toBeFalsy();
    expect(shared.tenantsNavButton.isDisplayed()).toBeFalsy();
    expect(shared.flowsNavButton.isDisplayed()).toBeFalsy();
  });

  it('should not have access to User Management pages', function() {
    browser.get(shared.usersPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.skillsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.groupsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.rolePageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
  });

  it('should not have access to Configuration pages', function() {
    browser.get(shared.tenantsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.integrationsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
  });

  it('should not have access to Flow pages', function() {
    browser.get(shared.flowsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.queuesPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.mediaPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.mediaCollectionsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.dispatchMappingsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
  });

  it('should have access to user profile details', function() {
    profile.firstNameFormField.sendKeys('Update');
    profile.lastNameFormField.sendKeys('Update');
    profile.resetPasswordButton.click();
    profile.passwordFormField.sendKeys('newpassword');

    profile.updateProfileBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeTruthy();
      expect(profile.firstNameFormField.getAttribute('value')).toBe(params.login.firstName + 'Update');
      expect(profile.lastNameFormField.getAttribute('value')).toBe(params.login.lastName + 'Update');
      expect(shared.welcomeMessage.getText()).toContain(params.login.firstName + 'Update');
      expect(shared.welcomeMessage.getText()).toContain(params.login.lastName + 'Update');
    });
  });

  it('should have access to edit user profile details', function() {
    profile.firstNameFormField.sendKeys('Update');
    profile.lastNameFormField.sendKeys('Update');
    profile.resetPasswordButton.click();
    profile.passwordFormField.sendKeys('newpassword');

    profile.updateProfileBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeTruthy();
      expect(profile.firstNameFormField.getAttribute('value')).toBe(params.login.firstName + 'Update');
      expect(profile.lastNameFormField.getAttribute('value')).toBe(params.login.lastName + 'Update');
      expect(shared.welcomeMessage.getText()).toContain(params.login.firstName + 'Update');
      expect(shared.welcomeMessage.getText()).toContain(params.login.lastName + 'Update');
    });
  });

});

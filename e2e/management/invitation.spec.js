'use strict';

describe('The user invitation', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    tenants = require('../configuration/tenants.po.js'),
    invites = require('./invites.po.js'),
    request = require('request'),
    params = browser.params,
    userCount,
    userAdded,
    randomUser,
    newUserEmail,
    newUserFirstName,
    newUserLastName,
    acceptInvitationLink,
    checkMailinator;
  var req,
    jar;
  var defaultTenantName,
    newTenantName,
    existingUserEmail;

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    loginPage.login(params.login.user, params.login.password);
    browser.get(shared.usersPageUrl);

    jar = request.jar();
    req = request.defaults({
      jar: jar
    });
  });

  afterAll(function() {
    shared.tearDown();
  });

  // NOTE Tests are dependant on Mailinator API
  // and invite emails being sent to the email specified when creating the user

  describe('email', function() {

    xit('should not be sent when creating a new user and Invite Now is deselected', function() {
      // Add randomness to user details
      randomUser = Math.floor((Math.random() * 1000) + 1);
      newUserEmail = 'titantest' + randomUser + '@mailinator.com';

      // Add new user
      shared.createBtn.click();

      users.emailFormField.sendKeys(newUserEmail + '\t');
      users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
      users.platformRoleFormDropdownOptions.get(1).click();

      // Deselect Invite Now toggle
      users.inviteNowFormToggle.click();

      users.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Verify tenant status
        expect(users.tenantStatus.getText()).toBe('Pending Invitation');
        expect(users.resendInvitationBtn.isDisplayed()).toBeTruthy();

        // Wait to allow the API to send and Mailinator to receive the email
        browser.sleep(1000).then(function() {
          // Verify user invitation email was NOT sent
          // NOTE: Add randomUser when emails are sent to the user email and not redirected
          //req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
          req.get('https://api.mailinator.com/api/inbox?to=titantest&token=' + params.mailinator.token, '', function(error, response, body) {
            if (JSON.parse(body).messages.length > 0) {
              var newestMessage1 = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

              // Get the newest message content
              req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage1.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
                var newestMessage1Contents = JSON.parse(body).data.parts[0].body;

                // Verify the email is NOT from the latest user created
                expect(newestMessage1Contents).not.toContain('User Name: ' + newUserEmail);
              });
            }
          });
        });
      });
    });

    xit('should be sent when creating a new user', function() {
      // Add randomness to user details
      randomUser = Math.floor((Math.random() * 1000) + 1);
      userAdded = false;
      newUserEmail = 'titantest' + randomUser + '@mailinator.com';

      // Add new user
      shared.createBtn.click().then(function() {
        users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
        users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
        users.platformRoleFormDropdownOptions.get(1).click();

        users.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Wait to allow the API to send and Mailinator to receive the email
          browser.sleep(1000).then(function() {
            // Verify user invitation email was sent
            // NOTE: Add randomUser when emails are sent to the user email and not redirected
            //req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
            req.get('https://api.mailinator.com/api/inbox?to=titantest&token=' + params.mailinator.token, '', function(error, response, body) {
              if (JSON.parse(body).messages.length > 0) {
                var newestMessage2 = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

                // Verify the newest message details
                expect(newestMessage2.seconds_ago).toBeLessThan(60);
                expect(newestMessage2.subject).toBe(params.mailinator.subject);
                expect(newestMessage2.been_read).toBeFalsy();
                expect(newestMessage2.from).toBe(params.mailinator.from);

                // Get the newest message content
                req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage2.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
                  var newestMessage2Contents = JSON.parse(body).data.parts[0].body;

                  // Verify the email contains the expected content
                  expect(newestMessage2Contents).toContain('User Name: ' + newUserEmail);
                  expect(newestMessage2Contents).toContain('Password: Set the first time you login');
                  expect(newestMessage2Contents).toContain('Log in automatically by clicking');

                  // Verify link is correct
                  acceptInvitationLink = newestMessage2Contents.split('Log in automatically by clicking ')[1].split('\n')[0];
                  browser.get(acceptInvitationLink);
                });
              } else { // Fail test
                expect(true).toBeFalsy();
              }
            });
          });
        });
      });
    });

    xit('contain user information and accept link', function() {
      // NOTE: Add randomUser when emails are sent to the user email and not redirected
      //req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
      req.get('https://api.mailinator.com/api/inbox?to=titantest&token=' + params.mailinator.token, '', function(error, response, body) {
        if (JSON.parse(body).messages.length > 0) {
          var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

          expect(newestMessage.subject).toBe(params.mailinator.subject);
          expect(newestMessage.been_read).toBeFalsy();
          expect(newestMessage.from).toBe(params.mailinator.from);

          req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
            var newestMessageContents = JSON.parse(body).data.parts[0].body;
            expect(newestMessageContents).toContain('User Name: ');
            expect(newestMessageContents).toContain('Password: Set the first time you login');
            expect(newestMessageContents).toContain('Log in automatically by clicking');

            acceptInvitationLink = newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0];
          });
        } else {
          // Fail test
          expect(false).toBeTruthy();
        }
      });
    });

    xit('should link to the invitation accept form', function() {
      // Add randomness to user details
      randomUser = Math.floor((Math.random() * 1000) + 1);
      userAdded = false;
      newUserEmail = 'titantest' + randomUser + '@mailinator.com';

      // Add new user
      shared.createBtn.click().then(function() {
        users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
        users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
        users.platformRoleFormDropdownOptions.get(1).click();

        users.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Wait to allow the API to send and Mailinator to receive the email
          browser.sleep(1000).then(function() {
            // Verify user invitation email was sent
            // NOTE: Add randomUser when emails are sent to the user email and not redirected
            //req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
            req.get('https://api.mailinator.com/api/inbox?to=titantest&token=' + params.mailinator.token, '', function(error, response, body) {
              if (JSON.parse(body).messages.length > 0) {
                var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

                expect(newestMessage.seconds_ago).toBeLessThan(60);
                expect(newestMessage.subject).toBe(params.mailinator.subject);
                expect(newestMessage.been_read).toBeFalsy();
                expect(newestMessage.from).toBe(params.mailinator.from);

                // Get the newest message content
                req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
                  var newestMessageContents = JSON.parse(body).data.parts[0].body;

                  // Verify link is correct
                  acceptInvitationLink = newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0];
                  browser.get(acceptInvitationLink);
                  expect(invites.acceptForm.isDisplayed()).toBeTruthy();
                });
              } else {
                // Fail test
                expect(false).toBeTruthy();
              }
            });
          });
        });
      });
    });
  });

  describe('acceptance form', function() {

    xit('should include supported fields and user details', function() {
      loginPage.login(params.login.user, params.login.password);
      browser.get(shared.usersPageUrl);

      // Add randomness to user details
      randomUser = Math.floor((Math.random() * 1000) + 1);
      newUserEmail = 'titantest' + randomUser + '@mailinator.com';

      // Add new user
      shared.createBtn.click().then(function() {
        users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
        users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
        users.platformRoleFormDropdownOptions.get(1).click();

        users.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Wait to allow the API to send and Mailinator to receive the email
          browser.sleep(1000).then(function() {
            // Verify user invitation email was sent
            // NOTE: Add randomUser when emails are sent to the user email and not redirected
            //req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
            req.get('https://api.mailinator.com/api/inbox?to=titantest&token=' + params.mailinator.token, '', function(error, response, body) {
              if (JSON.parse(body).messages.length > 0) {
                var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

                expect(newestMessage.seconds_ago).toBeLessThan(60);
                expect(newestMessage.subject).toBe(params.mailinator.subject);
                expect(newestMessage.been_read).toBeFalsy();
                expect(newestMessage.from).toBe(params.mailinator.from);

                // Get the newest message content
                req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
                  var newestMessageContents = JSON.parse(body).data.parts[0].body;

                  // Verify link is correct
                  acceptInvitationLink = newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0];
                  browser.get(acceptInvitationLink);
                  expect(invites.acceptForm.isDisplayed()).toBeTruthy();

                  // Verify Details of Acceptance Form
                  expect(invites.logo.isDisplayed()).toBeTruthy();
                  expect(invites.alertMessage.isDisplayed()).toBeTruthy();
                  expect(invites.userEmail.isDisplayed()).toBeTruthy();
                  expect(invites.passwordFormField.isDisplayed()).toBeTruthy();
                  expect(invites.firstNameFormField.isDisplayed()).toBeTruthy();
                  expect(invites.lastNameFormField.isDisplayed()).toBeTruthy();
                  expect(invites.externalIdFormField.isDisplayed()).toBeTruthy();
                  expect(invites.submitFormBtn.isDisplayed()).toBeTruthy();
                  expect(invites.submitFormBtn.getAttribute('disabled')).toBeTruthy();

                  // Fields populated with details as input in the user create form
                  expect(invites.userEmail.getText()).toBe(newUserEmail);
                  expect(invites.passwordFormField.getAttribute('value')).toBe('');
                  expect(invites.firstNameFormField.getAttribute('value')).toBe('');
                  expect(invites.lastNameFormField.getAttribute('value')).toBe('');
                  expect(invites.externalIdFormField.getAttribute('value')).toBe('');

                  expect(shared.navBar.isPresent()).toBeFalsy();
                });
              } else {
                // Fail test
                expect(false).toBeTruthy();
              }
            });
          });
        });
      });
    });

    xit('should include non-required fields when provided', function() {
      loginPage.login(params.login.user, params.login.password);
      browser.get(shared.usersPageUrl);

      // Add randomness to user details
      randomUser = Math.floor((Math.random() * 1000) + 1);
      newUserEmail = 'titantest' + randomUser + '@mailinator.com';

      // Add new user
      shared.createBtn.click().then(function() {
        users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
        users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
        users.platformRoleFormDropdownOptions.get(1).click();

        users.firstNameFormField.sendKeys('First ' + randomUser);
        users.lastNameFormField.sendKeys('Last ' + randomUser);
        users.externalIdFormField.sendKeys('External Id' + randomUser);

        users.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Wait to allow the API to send and Mailinator to receive the email
          browser.sleep(1000).then(function() {
            // Verify user invitation email was sent
            // NOTE: Add randomUser when emails are sent to the user email and not redirected
            //req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
            req.get('https://api.mailinator.com/api/inbox?to=titantest&token=' + params.mailinator.token, '', function(error, response, body) {
              if (JSON.parse(body).messages.length > 0) {
                var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

                expect(newestMessage.seconds_ago).toBeLessThan(60);
                expect(newestMessage.subject).toBe(params.mailinator.subject);
                expect(newestMessage.been_read).toBeFalsy();
                expect(newestMessage.from).toBe(params.mailinator.from);

                // Get the newest message content
                req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
                  var newestMessageContents = JSON.parse(body).data.parts[0].body;

                  // Verify link is correct
                  acceptInvitationLink = newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0];
                  browser.get(acceptInvitationLink);
                  expect(invites.acceptForm.isDisplayed()).toBeTruthy();

                  // Fields populated with details as input in the user create form
                  expect(invites.userEmail.getText()).toBe(newUserEmail);
                  expect(invites.passwordFormField.getAttribute('value')).toBe('');
                  expect(invites.firstNameFormField.getAttribute('value')).toBe('First ' + randomUser);
                  expect(invites.lastNameFormField.getAttribute('value')).toBe('Last ' + randomUser);
                  expect(invites.externalIdFormField.getAttribute('value')).toBe('External Id' + randomUser);
                });
              } else {
                // Fail test
                expect(false).toBeTruthy();
              }
            });
          });
        });
      });
    });

    xit('should include Copyright and Legal information', function() {
      // NOTE: This test uses the acceptInvitationLink from the previous test
      browser.get(acceptInvitationLink);

      expect(invites.copyrightLabel.isDisplayed()).toBeTruthy();
      expect(invites.signupLegalLabel.isDisplayed()).toBeTruthy();

      expect(invites.copyrightLabel.getText()).toBe(invites.copyrightText);
      expect(invites.signupLegalLabel.getText()).toBe(invites.legalText);
    });

    xit('should require completed fields', function() {
      browser.get(acceptInvitationLink);

      invites.passwordFormField.sendKeys('temp');
      invites.firstNameFormField.sendKeys('temp');
      invites.lastNameFormField.sendKeys('temp');
      invites.externalIdFormField.sendKeys('temp');

      invites.passwordFormField.clear();
      invites.firstNameFormField.clear();
      invites.lastNameFormField.clear();
      invites.externalIdFormField.clear();

      expect(invites.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    });

    xit('should require password field input', function() {
      browser.get(acceptInvitationLink);

      invites.passwordFormField.sendKeys('temp');
      invites.passwordFormField.clear();
      invites.passwordFormField.sendKeys('\t');

      expect(invites.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(invites.errors.get(0).getText()).toBe('Please enter a password');
    });

    xit('should not require first, last name or external id field input', function() {
      browser.get(acceptInvitationLink);

      invites.passwordFormField.sendKeys('password\t');

      expect(invites.submitFormBtn.getAttribute('disabled')).toBeNull();
    });

    xit('should not accept spaces as valid input', function() {
      // TODO Fails
      browser.get(acceptInvitationLink);

      invites.passwordFormField.sendKeys(' \t');
      invites.firstNameFormField.sendKeys(' \t');
      invites.lastNameFormField.sendKeys(' \t');
      invites.externalIdFormField.sendKeys(' \t');

      expect(invites.submitFormBtn.getAttribute('disabled')).toBeTruthy();

      expect(invites.errors.get(0).getText()).toBe('Please enter a password');
      expect(invites.errors.get(1).getText()).toBe('Please enter a first name');
      expect(invites.errors.get(2).getText()).toBe('Please enter a last name');
      expect(invites.errors.get(3).getText()).toBe('Please enter an external id');
    });

    xit('should accept invitation', function() {
      browser.get(acceptInvitationLink);

      invites.passwordFormField.sendKeys('password');

      expect(invites.submitFormBtn.getAttribute('disabled')).toBeNull();
      invites.submitFormBtn.click().then(function() {
        expect(shared.message.isDisplayed()).toBeTruthy();
        expect(shared.message.getText()).toBe('Your invitation has been accepted!');
      });
    });

    xit('should redirect to login page when invitation is already accepted', function() {
      // TODO Update expected flow after TITAN2-3299
      browser.get(acceptInvitationLink);

      invites.passwordFormField.sendKeys('not the same password');

      invites.submitFormBtn.click().then(function() {
        expect(shared.errorMessage.isDisplayed()).toBeTruthy();
        expect(shared.errorMessage.getText()).toContain('Sorry, there was an error accepting your invitation.');
      });
    });
  });

  xit('should expire after 24 hours', function() {});

  xit('should not be expired after 23 hours', function() {});

  xit('should display expired message after expiry period has passed', function() {});

  // For existing users
  describe('for inviting existing users not in the current tenant', function() {
    beforeAll(function() {
      loginPage.login(params.login.user, params.login.password);

      browser.get(shared.tenantsPageUrl);
      shared.tenantsNavDropdown.getText().then(function(selectTenantNav) {
        defaultTenantName = selectTenantNav;
      });

      // Create new Tenant that tests will use; admin defaults to current user
      newTenantName = tenants.createTenant();
      tenants.selectTenant(newTenantName);
    });

    it('should display message but not user details', function() {
      newUserEmail = 'james.sullivan@mailinator.com';
      shared.createBtn.click();

      // newUserEmail is already set to a value used for the previous tenants new user
      users.emailFormField.sendKeys(newUserEmail + '\t');

      expect(users.userAlreadyExistsAlert.isDisplayed()).toBeTruthy();
      expect(users.userAlreadyExistsAlert.getText()).toBe('This user already exists on the platform and they will be added to the tenant upon clicking "Submit"');

      // Platform role field is removed
      expect(users.tenantRoleFormDropdown.isDisplayed()).toBeTruthy();
      expect(users.platformRoleFormDropdown.isPresent()).toBeFalsy();

      // Remaining fields are displayed and remain blank
      expect(users.firstNameFormField.isEnabled()).toBeFalsy();
      expect(users.lastNameFormField.isEnabled()).toBeFalsy();
      expect(users.externalIdFormField.isEnabled()).toBeFalsy();
      expect(users.firstNameFormField.getAttribute('value')).toBe('');
      expect(users.lastNameFormField.getAttribute('value')).toBe('');
      expect(users.externalIdFormField.getAttribute('value')).toBe('');

      expect(users.submitFormBtn.isEnabled()).toBeFalsy();

      // Only tenant role is required
      users.tenantRoleFormDropdownOptions.get(1).click();
      expect(users.submitFormBtn.isEnabled()).toBeTruthy();
    });

    it('should send invitation email', function() {
      shared.createBtn.click();

      // newUserEmail is already set to a value used for the previous tenants new user
      users.emailFormField.sendKeys(newUserEmail + '\t');
      users.tenantRoleFormDropdownOptions.get(1).click();

      expect(users.userAlreadyExistsAlert.isDisplayed()).toBeTruthy();
      users.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Wait to allow the API to send and Mailinator to receive the email
        browser.sleep(1000).then(function() {
          // Verify user invitation email was sent
          // NOTE: Add randomUser when emails are sent to the user email and not redirected
          //req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
          req.get('https://api.mailinator.com/api/inbox?to=titantest&token=' + params.mailinator.token, '', function(error, response, body) {
            if (JSON.parse(body).messages.length > 0) {
              var newestMessage2 = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

              // Verify the newest message details
              expect(newestMessage2.seconds_ago).toBeLessThan(60);
              expect(newestMessage2.subject).toBe(params.mailinator.subject);
              expect(newestMessage2.been_read).toBeFalsy();
              expect(newestMessage2.from).toBe(params.mailinator.from);

              // Get the newest message content
              req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage2.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
                var newestMessage2Contents = JSON.parse(body).data.parts[0].body;

                // Verify the email contains the expected content
                expect(newestMessage2Contents).toContain('User Name: ' + newUserEmail);
                expect(newestMessage2Contents).toContain('Password: Set the first time you login');
                expect(newestMessage2Contents).toContain('Please click the following link to get started on accepting this invitation: ');

                // Verify link is correct
                acceptInvitationLink = newestMessage2Contents.split('Please click the following link to get started on accepting this invitation: ')[1].split('\n')[0];
                browser.get(acceptInvitationLink);
              });
            } else { // Fail test
              expect(true).toBeFalsy();
            }
          });
        });
      });
    });

    xit('should not display user details before invitation is accepted', function() {
      // TODO Bug TITAN2-3979
      shared.searchField.sendKeys(newUserEmail);
      shared.firstTableRow.click();

      // Only user email and current tenant status displayed in the table
      expect(shared.firstTableRow.getText()).not.toContain('First ' + randomUser);
      expect(shared.firstTableRow.getText()).not.toContain('Last ' + randomUser);
      expect(shared.firstTableRow.getText()).not.toContain('External Id' + randomUser);
      expect(shared.firstTableRow.getText()).toContain(newUserEmail);
      expect(shared.firstTableRow.getText()).toContain('Agent');
      expect(shared.firstTableRow.getText()).toContain('Pending Acceptance');

      // Remaining fields are displayed and remain blank
      expect(users.firstNameFormField.isEnabled()).toBeFalsy();
      expect(users.lastNameFormField.isEnabled()).toBeFalsy();
      expect(users.externalIdFormField.isEnabled()).toBeFalsy();
      expect(users.firstNameFormField.getAttribute('value')).toBe('');
      expect(users.lastNameFormField.getAttribute('value')).toBe('');
      expect(users.externalIdFormField.getAttribute('value')).toBe('');
    });

    it('should link to login page instead of the acceptance form', function() {
      // NOTE: This test uses the acceptInvitationLink from the previous test
      browser.get(acceptInvitationLink);

      expect(browser.getCurrentUrl()).toContain(shared.loginPageUrl);
    });

    it('should accept invitation after login', function() {
      browser.get(acceptInvitationLink);

      loginPage.emailLoginField.sendKeys(newUserEmail);
      loginPage.passwordLoginField.sendKeys('password');
      loginPage.loginButton.click();

      expect(browser.getCurrentUrl()).toContain(shared.profilePageUrl);
      expect(shared.message.isDisplayed()).toBeTruthy();
      expect(shared.message.getText()).toContain('Your invitation has been accepted!');

      // User is added to previous and new Tenant
      expect(shared.tenantsNavDropdownContents.count()).toBe(2);
      expect(shared.tenantsNavDropdownContents.get(0).getText()).toBeIn([newTenantName, defaultTenantName]);
      expect(shared.tenantsNavDropdownContents.get(1).getText()).toBeIn([newTenantName, defaultTenantName]);
    });

    it('should display user details after the invitation is accepted', function() {
      shared.searchField.sendKeys(newUserEmail);
      shared.firstTableRow.click();

      // Only user email and current tenant status displayed in the table
      expect(shared.firstTableRow.getText()).toContain('First ' + randomUser);
      expect(shared.firstTableRow.getText()).toContain('Last ' + randomUser);
      expect(shared.firstTableRow.getText()).toContain('External Id' + randomUser);
      expect(shared.firstTableRow.getText()).toContain(newUserEmail);
      expect(shared.firstTableRow.getText()).toContain('Agent');
      expect(shared.firstTableRow.getText()).toContain('Accepted');

      // Remaining fields are displayed and remain blank
      expect(users.firstNameFormField.isEnabled()).toBeTruthy();
      expect(users.lastNameFormField.isEnabled()).toBeTruthy();
      expect(users.externalIdFormField.isEnabled()).toBeTruthy();
      expect(users.firstNameFormField.getAttribute('value')).toBe('First ' + randomUser);
      expect(users.lastNameFormField.getAttribute('value')).toBe('Last ' + randomUser);
      expect(users.externalIdFormField.getAttribute('value')).toBe('External Id' + randomUser);
    });

    it('should not send invitation email when Invite Now is deselected', function() {
      // Create new Tenant that tests will use; admin defaults to current user
      browser.get(shared.tenantsPageUrl);
      newTenantName = tenants.createTenant();
      tenants.selectTenant(newTenantName);

      browser.get(shared.usersPageUrl());
      shared.createBtn.click();

      // newUserEmail is already set to a value used for the previous tenants new user
      users.emailFormField.sendKeys(newUserEmail + '\t');
      users.tenantRoleFormDropdownOptions.get(1).click();

      expect(users.userAlreadyExistsAlert.isDisplayed()).toBeTruthy();
      users.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Wait to allow the API to send and Mailinator to receive the email
        browser.sleep(1000).then(function() {
          // Verify user invitation email was NOT sent
          // NOTE: Add randomUser when emails are sent to the user email and not redirected
          //req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
          req.get('https://api.mailinator.com/api/inbox?to=titantest&token=' + params.mailinator.token, '', function(error, response, body) {
            if (JSON.parse(body).messages.length > 0) {
              var newestMessage1 = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

              // Get the newest message content
              req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage1.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
                var newestMessage1Contents = JSON.parse(body).data.parts[0].body;

                // Verify the email is NOT from the latest user created
                expect(newestMessage1Contents).not.toContain('User Name: ' + newUserEmail);
              });
            }
          });
        });
      });
    });
  });
});

'use strict';

describe('The user invitation', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
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

    it('should not be sent when creating a new user and Invite Now is deselected', function() {
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
          req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
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

    it('should be sent when creating a new user', function() {
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
            req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
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

    it('contain user information and accept link', function() {
      req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
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
      });
    });

    it('should link to the invitation accept form', function() {
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
            req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
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
            });
          });
        });
      });
    });
  });

  describe('acceptance form', function() {

    it('should include supported fields and user details', function() {
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
            req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
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
            });
          });
        });
      });
    });

    it('should include non-required fields when provided ', function() {
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
            req.get('https://api.mailinator.com/api/inbox?to=titantest' + randomUser + '&token=' + params.mailinator.token, '', function(error, response, body) {
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
            });
          });
        });
      });
    });

    it('should include Copyright and Legal information', function() {
      // NOTE: This test uses the acceptInvitationLink from the previous test
      browser.get(acceptInvitationLink);

      expect(invites.copyrightLabel.isDisplayed()).toBeTruthy();
      expect(invites.signupLegalLabel.isDisplayed()).toBeTruthy();

      expect(invites.copyrightLabel.getText()).toBe(invites.copyrightText);
      expect(invites.signupLegalLabel.getText()).toBe(invites.legalText);
    });

    it('should require completed fields', function() {
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

    it('should require password field input', function() {
      browser.get(acceptInvitationLink);

      invites.passwordFormField.sendKeys('temp');
      invites.passwordFormField.clear();
      invites.passwordFormField.sendKeys('\t');

      expect(invites.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(invites.errors.get(0).getText()).toBe('Please enter a password');
    });

    it('should not require first, last name or external id field input', function() {
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

    it('should accept invitation', function() {
      browser.get(acceptInvitationLink);

      invites.passwordFormField.sendKeys('password');

      expect(invites.submitFormBtn.getAttribute('disabled')).toBeNull();
      invites.submitFormBtn.click().then(function() {
        expect(shared.message.isDisplayed()).toBeTruthy();
        expect(shared.message.getText()).toBe('Your invitation has been accepted!');
      });
    });

    it('should redirect to login page when invitation is already accepted', function() {
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
    // TODO
    xit('should send invitation email', function() {});

    xit('should not send invitation email when Invite Now is deselected', function() {});

    xit('should include existing user details on the acceptance form', function() {});

    xit('should leave existing password when left blank on the acceptance form', function() {});

    xit('should diplay new and existing tenant in nav bar after accepting new invitation', function() {});
  });
});

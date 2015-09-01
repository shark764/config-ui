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
  // and invite emails being redirected to the mailbox specified in protractor params
  // Default inbox for receiving invitiation emails is titantest@mailinator.com

  describe('email', function() {
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
            req.get('https://api.mailinator.com/api/inbox?to=' + params.mailinator.inbox + '&token=' + params.mailinator.token, '', function(error, response, body) {
              var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

              // Verify the newest message details
              expect(newestMessage.seconds_ago).toBeLessThan(60);
              expect(newestMessage.subject).toBe(params.mailinator.subject);
              expect(newestMessage.been_read).toBeFalsy();
              expect(newestMessage.from).toBe(params.mailinator.from);

              // Get the newest message content
              req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
                var newestMessageContents = JSON.parse(body).data.parts[0].body;

                // Verify the email contains the expected content
                expect(newestMessageContents).toContain('User Name: ' + newUserEmail);
                expect(newestMessageContents).toContain('Password: Set the first time you login');
                expect(newestMessageContents).toContain('Log in automatically by clicking');

                // Verify link is correct
                acceptInvitationLink = newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0];
                browser.get(acceptInvitationLink);
              });

            });
          });
        });
      });
    });

    it('contain user information and accept link', function() {
      req.get('https://api.mailinator.com/api/inbox?to=' + params.mailinator.inbox + '&token=' + params.mailinator.token, '', function(error, response, body) {
        var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

        expect(newestMessage.seconds_ago).toBeLessThan(600);
        expect(newestMessage.subject).toBe(params.mailinator.subject);
        expect(newestMessage.been_read).toBeFalsy();
        expect(newestMessage.from).toBe(params.mailinator.from);
        console.log(newestMessage.id);

        req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
          console.log(JSON.parse(body).data);
          var newestMessageContents = JSON.parse(body).data.parts[0].body;
          console.log(newestMessageContents);
          expect(newestMessageContents).toContain('User Name: ');
          expect(newestMessageContents).toContain('Password: Set the first time you login');
          expect(newestMessageContents).toContain('Log in automatically by clicking');

          acceptInvitationLink = newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0];
          browser.get(acceptInvitationLink);
        }).then(function () {
          browser.get(acceptInvitationLink);
        });
      });
    });

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
          req.get('https://api.mailinator.com/api/inbox?to=' + params.mailinator.inbox + '&token=' + params.mailinator.token, '', function(error, response, body) {
            var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

            // Get the newest message content
            req.get('https://api.mailinator.com/api/email?msgid=' + newestMessage.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
              var newestMessageContents = JSON.parse(body).data.parts[0].body;

              // Verify the email is NOT from the latest user created
              expect(newestMessageContents).not.toContain('User Name: ' + newUserEmail);

              // Verify link is correct
              acceptInvitationLink = newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0];
              browser.get(acceptInvitationLink);
            });
          });
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
            req.get('https://api.mailinator.com/api/inbox?to=' + params.mailinator.inbox + '&token=' + params.mailinator.token, '', function(error, response, body) {
              var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

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
    beforeEach(function() {
      // Ignore unsaved changes warnings
      browser.executeScript("window.onbeforeunload = function(){};");
    });

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
            req.get('https://api.mailinator.com/api/inbox?to=' + params.mailinator.inbox + '&token=' + params.mailinator.token, '', function(error, response, body) {
              var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

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
            req.get('https://api.mailinator.com/api/inbox?to=' + params.mailinator.inbox + '&token=' + params.mailinator.token, '', function(error, response, body) {
              var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

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

    it('should require completed fields', function() {
      // NOTE: This test uses the acceptInvitationLink from the previous test
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
      acceptInvitationLink = 'http://localhost:3000/#/invite-accept?tenantId=126dd800-4c88-11e5-9123-621c6d9e2761&userId=8c8f4800-500f-11e5-ab91-621c6d9e2761&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJ1c2VyLWlkIjoiOGM4ZjQ4MDAtNTAwZi0xMWU1LWFiOTEtNjIxYzZkOWUyNzYxIiwidXNlcm5hbWUiOiJ0aXRhbnRlc3Q1NzBAbWFpbGluYXRvci5jb20iLCJwbGF0Zm9ybS1yb2xlLWlkIjoiMTFkMWJmMTAtNGM4OC0xMWU1LTkxMjMtNjIxYzZkOWUyNzYxIiwicGxhdGZvcm0tcm9sZS1uYW1lIjoiUGxhdGZvcm0gQWRtaW5pc3RyYXRvciIsInBsYXRmb3JtLXBlcm1pc3Npb25zIjpbIlBMQVRGT1JNX01BTkFHRV9BTExfVEVOQU5UU19FTlJPTExNRU5UIiwiUExBVEZPUk1fVklFV19BTExfVVNFUlMiLCJQTEFURk9STV9DUkVBVEVfVVNFUlMiLCJQTEFURk9STV9NQU5BR0VfQUxMX1VTRVJTIiwiUExBVEZPUk1fVklFV19VU0VSX0FDQ09VTlQiLCJQTEFURk9STV9WSUVXX0FMTF9URU5BTlRTIiwiUExBVEZPUk1fQ1JFQVRFX0FMTF9URU5BTlRTIiwiUExBVEZPUk1fTUFOQUdFX1VTRVJfQUNDT1VOVCIsIlBMQVRGT1JNX0NSRUFURV9URU5BTlRfUk9MRVMiLCJQTEFURk9STV9NQU5BR0VfQUxMX1RFTkFOVFMiXSwidGVuYW50cyI6W3sidGVuYW50LWlkIjoiMTI2ZGQ4MDAtNGM4OC0xMWU1LTkxMjMtNjIxYzZkOWUyNzYxIiwidGVuYW50LW5hbWUiOiJQbGF0Zm9ybSIsInRlbmFudC1yb2xlLWlkIjoiMTI2Zjg1YjAtNGM4OC0xMWU1LTkxMjMtNjIxYzZkOWUyNzYxIiwidGVuYW50LXJvbGUtbmFtZSI6IkFkbWluaXN0cmF0b3IiLCJ0ZW5hbnQtcGVybWlzc2lvbnMiOlsiTUFOQUdFX1RFTkFOVF9ERUZBVUxUUyIsIlZJRVdfQUxMX1FVRVVFUyIsIlZJRVdfQUxMX1JFUE9SVFMiLCJWSUVXX0FMTF9QUk9WSURFUlMiLCJNQU5BR0VfQUxMX1VTRVJfTE9DQVRJT05TIiwiTUFOQUdFX0FMTF9HUk9VUF9PV05FUlMiLCJWSUVXX0FMTF9DT05UQUNUX1BPSU5UUyIsIk1BTkFHRV9BTExfUFJPVklERVJTIiwiUFVSQ0hBU0VfQ09OVEFDVF9QT0lOVFMiLCJNQU5BR0VfQUxMX0dST1VQUyIsIk1BTkFHRV9BTExfVVNFUl9FWFRFTlNJT05TIiwiVklFV19BTExfU0tJTExTIiwiVklFV19BTExfUk9MRVMiLCJNQU5BR0VfQUxMX0xPQ0FUSU9OUyIsIlZJRVdfQUxMX0ZMT1dTIiwiTUFOQUdFX0FMTF9NRURJQSIsIlZJRVdfQUxMX1VTRVJTIiwiVklFV19BTExfTE9DQVRJT05TIiwiVklFV19BTExfTUVESUEiLCJNQU5BR0VfQUxMX1JPTEVTIiwiTUFOQUdFX0FMTF9HUk9VUF9VU0VSUyIsIk1BTkFHRV9BTExfUVVFVUVTIiwiTUFOQUdFX0FMTF9SRVBPUlRTIiwiTUFOQUdFX0FMTF9GTE9XUyIsIk1BUF9BTExfQ09OVEFDVF9QT0lOVFMiLCJNQU5BR0VfQUxMX1JFU09VUkNFX1NFTEVDVElPTiIsIk1BTkFHRV9URU5BTlQiLCJNQU5BR0VfQUxMX1VTRVJfU0tJTExTIiwiTUFOQUdFX1RFTkFOVF9MT09LX0FORF9GRUVMIiwiVklFV19BTExfUkVTT1VSQ0VfU0VMRUNUSU9OIiwiTUFOQUdFX1RFTkFOVF9FTlJPTExNRU5UIiwiTUFOQUdFX0FMTF9TS0lMTFMiLCJWSUVXX0FMTF9HUk9VUFMiXX1dLCJleHAiOjEuNDQxMTMyNzQyMTY0RTl9.tbViN2nVvWU7VubmYYzSfxjwdy35SEyUYMgSlmteYWA';
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
      browser.get(acceptInvitationLink);

      invites.passwordFormField.sendKeys(' \t');
      invites.firstNameFormField.sendKeys(' \t');
      invites.lastNameFormField.sendKeys(' \t');
      invites.externalIdFormField.sendKeys(' \t');

      expect(invites.submitFormBtn.getAttribute('disabled')).toBeTruthy();

      expect(invites.errors.get(0).getText()).toBe('Please enter a password');
      expect(invites.errors.get(0).getText()).toBe('Please enter a first name');
      expect(invites.errors.get(0).getText()).toBe('Please enter a last name');
      expect(invites.errors.get(0).getText()).toBe('Please enter an external id');
    });

    it('should accept invitation', function() {
      browser.get(acceptInvitationLink);

      invites.passwordFormField.sendKeys('password');

      expect(invites.submitFormBtn.getAttribute('disabled')).toBeNull();
      invites.submitFormBtn.click().then(function() {
        expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);

        expect(shared.message.isDisplayed()).toBeTruthy();
        expect(shared.message.getText()).toBe('Your invitation has been accepted!');
      });
    });

    xit('should redirect to login page when invitation is already accepted', function() {
      // TODO Enable after TITAN2-3299
      browser.get(acceptInvitationLink);

      expect(browser.getCurrentUrl()).toContain(shared.loginPageUrl);

      expect(shared.errorMessage.isDisplayed()).toBeTruthy();
      expect(shared.errorMessage.getText()).toBe('Accept token invalid.');
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

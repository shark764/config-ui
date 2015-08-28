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
    checkMailinator;
  var req,
    jar;


  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.usersPageUrl);
    userCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });


  // NOTE Tests will fail is Mailinator.com is unreponsive
  // OR if invite emails are not redirected to the mailbox specified in protractor params
  // Default inbox for receiving invitiation emails is titantest@mailinator.com

  describe('email', function() {
    beforeEach(function() {
      jar = request.jar();
      req = request.defaults({
        jar: jar
      });
    });

    xit('should be sent when creating a new user', function() {
      req.get('https://api.mailinator.com/api/inbox?to=' + params.mailinator.inbox + '&token=' + params.mailinator.token, '', function(error, response, body) {
        var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];
        //console.log(newestMessage);
        expect(newestMessage.seconds_ago).toBeGreaterThan(1000);
        expect(newestMessage.subject).toBe(params.mailinator.subject);
        expect(newestMessage.been_read).toBeFalsy();
        expect(newestMessage.from).toBe(params.mailinator.from);
        var newestMessageID = newestMessage.id;

        req.get('https://api.mailinator.com/api/email?msgid=' + newestMessageID + '&token=' + params.mailinator.token, '', function(error, response, body) {
          var newestMessageContents = JSON.parse(body).data.parts[0].body;
          expect(newestMessageContents).toContain('User Name: ');
          expect(newestMessageContents).toContain('Password: Set the first time you login');
          expect(newestMessageContents).toContain('Log in automatically by clicking');

          var acceptInvitationLink = newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0];
          console.log('ACCEPT LINK: ' + acceptInvitationLink);
        });
      });
    });


    it('should be sent when creating a new user', function() {
      // Add randomness to user details
      randomUser = Math.floor((Math.random() * 1000) + 1);
      userAdded = false;
      newUserEmail = 'titantest' + randomUser + '@mailinator.com';

      // Add new user
      shared.createBtn.click();

      users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
      users.roleFormDropdownOptions.get((randomUser % 3) + 1).click();

      users.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Verify user invitation email was sent
        req.get('https://api.mailinator.com/api/inbox?to=' + params.mailinator.inbox + '&token=' + params.mailinator.token, '', function(error, response, body) {
          var newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

          // Verify the newest message details
          expect(newestMessage.seconds_ago).toBeGreaterThan(60);
          expect(newestMessage.subject).toBe(params.mailinator.subject);
          expect(newestMessage.been_read).toBeFalsy();
          expect(newestMessage.from).toBe(params.mailinator.from);
          var newestMessageID = newestMessage.id;

          // Get the newest message content
          req.get('https://api.mailinator.com/api/email?msgid=' + newestMessageID + '&token=' + params.mailinator.token, '', function(error, response, body) {
            var newestMessageContents = JSON.parse(body).data.parts[0].body;

            // Verify the email contains the expected content
            expect(newestMessageContents).toContain('User Name: ' + newUserEmail);
            expect(newestMessageContents).toContain('Password: Set the first time you login');
            expect(newestMessageContents).toContain('Log in automatically by clicking');

            // Verify link is correct
            var acceptInvitationLink = newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0];
            browser.get(acceptInvitationLink);
            expect(invites.acceptForm.isDisplayed()).toBeTruthy();
          });
        });
      });
    });

    xit('should not be sent when creating a new user and Invite Now is deselected', function() {
      // Add randomness to user details
      randomUser = Math.floor((Math.random() * 1000) + 1);
      userAdded = false;
      newUserName = 'First' + randomUser + ' Last' + randomUser;

      // Add new user
      shared.createBtn.click();

      users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
      users.roleFormDropdownOptions.get((randomUser % 3) + 1).click();

      users.firstNameFormField.sendKeys('First' + randomUser);
      users.lastNameFormField.sendKeys('Last' + randomUser);
      users.externalIdFormField.sendKeys(randomUser);
      users.personalTelephoneFormField.sendKeys('15062345678');

      users.submitFormBtn.click();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Confirm user is displayed in user list with correct details
      shared.tableElements.then(function(users) {
        for (var i = 1; i <= users.length; ++i) {
          // Check if user name in table matches newly added user
          element(by.css('tr.ng-scope:nth-child(' + i + ') > ' + users.nameColumn)).getText().then(function(value) {
            if (value == newUserName) {
              userAdded = true;
            }
          });
        }
      }).thenFinally(function() {
        // Verify new user was found in the user table
        expect(userAdded).toBeTruthy();
        expect(shared.tableElements.count()).toBeGreaterThan(userCount);
        expect(users.userNameDetailsHeader.getText()).toBe(newUserName);

        // Verify tenant status
        expect(users.tenantStatus.getText()).toBe('Pending Invitation');
        expect(users.resendInvitationBtn.isDisplayed()).toBeTruthy();

      }).then(function() {
        // Verify user invitation email was NOT sent
        browser.get(invites.mailinatorInbox);

        invites.emails.count().then(function(emailCount) {
          // if there are emails, verify the newest email is not from the new user
          if (emailCount > 0) {
            expect(invites.firstEmailRow.getText()).not.toContain('less than a minute ago');
            // TODO Could fail... add checks to verify email content does not have the new users name/email
          }
        });
      });
    });

    xit('should be sent when adding an existing user to the current tenant', function() {
      // TODO
      // Add randomness to user details
      randomUser = Math.floor((Math.random() * 1000) + 1);
      userAdded = false;
      newUserName = 'First' + randomUser + ' Last' + randomUser;

      // Add new user
      shared.createBtn.click();

      users.firstNameFormField.sendKeys('First' + randomUser);
      users.lastNameFormField.sendKeys('Last' + randomUser);
      users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
      users.externalIdFormField.sendKeys(randomUser);
      users.personalTelephoneFormField.sendKeys('15062345678');

      users.submitFormBtn.click();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Confirm user is displayed in user list with correct details
      shared.tableElements.then(function(users) {
        for (var i = 1; i <= users.length; ++i) {
          // Check if user name in table matches newly added user
          element(by.css('tr.ng-scope:nth-child(' + i + ') > ' + users.nameColumn)).getText().then(function(value) {
            if (value == newUserName) {
              userAdded = true;
            }
          });
        }
      }).thenFinally(function() {
        // Verify new user was found in the user table
        expect(userAdded).toBeTruthy();
        expect(shared.tableElements.count()).toBeGreaterThan(userCount);
        expect(users.userNameDetailsHeader.getText()).toBe(newUserName);

        // Verify tenant status
        expect(users.tenantStatus.getText()).toBe('Pending Acceptance');
        expect(users.resendInvitationBtn.isDisplayed()).toBeFalsy();
      }).then(function() {
        // Verify user invitation email was sent
        browser.get(invites.mailinatorInbox);
        // TODO
      });
    });

    xit('should not be sent when adding an existing user to the current tenant and Invite Now is deselected', function() {
      // TODO
      // Add randomness to user details
      randomUser = Math.floor((Math.random() * 1000) + 1);
      userAdded = false;
      newUserName = 'First' + randomUser + ' Last' + randomUser;

      // Add new user
      shared.createBtn.click();

      users.firstNameFormField.sendKeys('First' + randomUser);
      users.lastNameFormField.sendKeys('Last' + randomUser);
      users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
      users.externalIdFormField.sendKeys(randomUser);
      users.personalTelephoneFormField.sendKeys('15062345678');

      users.submitFormBtn.click();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Confirm user is displayed in user list with correct details
      shared.tableElements.then(function(users) {
        for (var i = 1; i <= users.length; ++i) {
          // Check if user name in table matches newly added user
          element(by.css('tr.ng-scope:nth-child(' + i + ') > ' + users.nameColumn)).getText().then(function(value) {
            if (value == newUserName) {
              userAdded = true;
            }
          });
        }
      }).thenFinally(function() {
        // Verify new user was found in the user table
        expect(userAdded).toBeTruthy();
        expect(shared.tableElements.count()).toBeGreaterThan(userCount);
        expect(users.userNameDetailsHeader.getText()).toBe(newUserName);

        // Verify tenant status
        expect(users.tenantStatus.getText()).toBe('Pending Invitation');
        expect(users.resendInvitationBtn.isDisplayed()).toBeTruthy();

      }).then(function() {
        // Verify user invitation email was NOT sent
        browser.get(invites.mailinatorInbox);
        // TODO
      });
    });

    xit('should contain a link to accept the invitation and user details', function() {
      shared.createBtn.click();
      expect(shared.detailsForm.isDisplayed()).toBeTruthy();
    });

    xit('should link to the invitation accept form', function() {
      shared.createBtn.click();
      expect(shared.detailsForm.isDisplayed()).toBeTruthy();
    });
  });

  describe('acceptance form', function() {
    xit('should include supported fields and user details', function() {
      shared.createBtn.click();
      expect(users.firstNameFormField.isDisplayed()).toBeTruthy();
      expect(users.lastNameFormField.isDisplayed()).toBeTruthy();
      expect(users.emailFormField.isDisplayed()).toBeTruthy();
      expect(users.passwordFormField.isDisplayed()).toBeTruthy();
      expect(users.externalIdFormField.isDisplayed()).toBeTruthy();
      expect(users.personalTelephoneFormField.isDisplayed).toBeTruthy();

      expect(users.passwordEditFormBtn.isPresent()).toBeFalsy();

      expect(shared.cancelFormBtn.isDisplayed()).toBeTruthy();
      expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();

      expect(users.createNewUserHeader.isDisplayed()).toBeTruthy();
    });

    xit('should require completed fields', function() {
      shared.createBtn.click();
      expect(shared.detailsForm.isDisplayed()).toBeTruthy();

      expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(shared.tableElements.count()).toBe(userCount);

      expect(shared.successMessage.isPresent()).toBeFalsy();
    });

    xit('should require password field input', function() {
      // Select User from table
      shared.firstTableRow.click();

      // Select Create button
      shared.createBtn.click();
      shared.dismissChanges();

      // Create user section cleared
      expect(users.createNewUserHeader.getText()).toBe('Creating New User');
      expect(users.firstNameFormField.getAttribute('value')).toBe('');
      expect(users.lastNameFormField.getAttribute('value')).toBe('');
      expect(users.emailFormField.getAttribute('value')).toBe('');
      expect(users.externalIdFormField.getAttribute('value')).toBe('');
      expect(users.personalTelephoneFormField.getAttribute('value')).toBe('');
    });

    xit('should not require first or last name field input', function() {
      // Select User from table
      shared.firstTableRow.click();

      // Select Create button
      shared.createBtn.click();
      shared.dismissChanges();

      // Create user section cleared
      expect(users.createNewUserHeader.getText()).toBe('Creating New User');
      expect(users.firstNameFormField.getAttribute('value')).toBe('');
      expect(users.lastNameFormField.getAttribute('value')).toBe('');
      expect(users.emailFormField.getAttribute('value')).toBe('');
      expect(users.externalIdFormField.getAttribute('value')).toBe('');
      expect(users.personalTelephoneFormField.getAttribute('value')).toBe('');
    });

    xit('should not accept spaces as valid input', function() {
      shared.createBtn.click();

      // Enter a space into each field
      users.emailFormField.sendKeys(' ');
      users.firstNameFormField.sendKeys(' ');
      users.lastNameFormField.sendKeys(' ');
      users.personalTelephoneFormField.sendKeys(' ');
      users.externalIdFormField.sendKeys(' ');

      expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(shared.tableElements.count()).toBe(userCount);
      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Verify error messages are displayed
      expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
      expect(users.requiredErrors.get(1).getText()).toBe('Please enter a first name');
      expect(users.requiredErrors.get(2).getText()).toBe('Please enter a last name');
    });

    xit('should redirect to login page when invitation is already accepted', function() {
      shared.createBtn.click();

      // Enter a space into each field
      users.emailFormField.sendKeys(' ');
      users.firstNameFormField.sendKeys(' ');
      users.lastNameFormField.sendKeys(' ');
      users.personalTelephoneFormField.sendKeys(' ');
      users.externalIdFormField.sendKeys(' ');

      expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(shared.tableElements.count()).toBe(userCount);
      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Verify error messages are displayed
      expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
      expect(users.requiredErrors.get(1).getText()).toBe('Please enter a first name');
      expect(users.requiredErrors.get(2).getText()).toBe('Please enter a last name');
    });
  });

  xit('should expire after 24 hours', function() {
    shared.createBtn.click();

    // Enter a space into each field
    users.emailFormField.sendKeys(' ');
    users.firstNameFormField.sendKeys(' ');
    users.lastNameFormField.sendKeys(' ');
    users.personalTelephoneFormField.sendKeys(' ');
    users.externalIdFormField.sendKeys(' ');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Verify error messages are displayed
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
    expect(users.requiredErrors.get(1).getText()).toBe('Please enter a first name');
    expect(users.requiredErrors.get(2).getText()).toBe('Please enter a last name');
  });

  xit('should not be expired after 23 hours', function() {
    shared.createBtn.click();

    // Enter a space into each field
    users.emailFormField.sendKeys(' ');
    users.firstNameFormField.sendKeys(' ');
    users.lastNameFormField.sendKeys(' ');
    users.personalTelephoneFormField.sendKeys(' ');
    users.externalIdFormField.sendKeys(' ');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Verify error messages are displayed
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
    expect(users.requiredErrors.get(1).getText()).toBe('Please enter a first name');
    expect(users.requiredErrors.get(2).getText()).toBe('Please enter a last name');
  });

  xit('should display expired message after expiry period has passed', function() {
    shared.createBtn.click();

    // Enter a space into each field
    users.emailFormField.sendKeys(' ');
    users.firstNameFormField.sendKeys(' ');
    users.lastNameFormField.sendKeys(' ');
    users.personalTelephoneFormField.sendKeys(' ');
    users.externalIdFormField.sendKeys(' ');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Verify error messages are displayed
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
    expect(users.requiredErrors.get(1).getText()).toBe('Please enter a first name');
    expect(users.requiredErrors.get(2).getText()).toBe('Please enter a last name');
  });


  // For existing users

});

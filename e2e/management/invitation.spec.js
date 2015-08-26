'use strict';

describe('The user invitation', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    invites = require('./invites.po.js'),
    params = browser.params,
    userCount,
    userAdded,
    randomUser,
    newUserName;
    var http = require('http');

  beforeAll(function() {
  // Send Invitation
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
  // OR if invite emails are not redirected to the mailbox specified in invites.mailinatorInbox
  // Default inbox for receiving invitiation emails is titantest@mailinator.com

  describe('email', function() {
    xit('should be sent when creating a new user', function() {
      /*
            // Verify user invitation email was sent
            browser.get(invites.mailinatorInbox);
            browser.ignoreSynchronization = false;



            browser.refresh();

            //browser.pause();

            browser.driver.wait(function() {
              return invites.firstEmailRow.isPresent().then(function(emailPresent) {
                return emailPresent;
              });
            }, 5000);

      */
      browser.get(shared.usersPageUrl);
      var request =
      var flow = protractor.promise.controlFlow();
      var result = flow.execute(function() {
          var defer = protractor.promise.defer();
          request('https://api.mailinator.com/api/inbox?to=titantest&token=358b00e30aa94f62be812de7e4a66ee2', function (error, response, body) {
              if (!error && response.statusCode === 200) {
                  defer.fulfill(JSON.parse(body));
              }
          });

          return defer.promise;
      }).then(function () {
        result.then(function (resultText) {
          console.log(resultText);
        });
      });


      /*  invites.checkMailinator()
        .done(function(r) {
          if (r) {
            console.log('Response: ' + r);
          } else {
            console.log('Failed');
          }
        })
        .fail(function (x) {
          console.log('Failed: ' + x);
        }) */

      //expect(invites.emails.count()).toBeGreaterThan(1);
      //expect(invites.firstEmailRow.getText()).toContain('titan.noreply@liveops.com');
      //expect(invites.firstEmailRow.getText()).toContain('Welcome to Titan');
      //expect(invites.firstEmailRow.getText()).toContain('less than a minute ago');



    });

    xit('should be sent when creating a new user', function() {
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
          element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
            if (value == newUserName) {
              userAdded = true;
            }
          });
        }
      }).then(function() {
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

        expect(invites.emails.count()).toBeGreaterThan(1);
        expect(invites.firstEmailRow.getText()).toContain('titan.noreply@liveops.com');
        expect(invites.firstEmailRow.getText()).toContain('Welcome to Titan');
        expect(invites.firstEmailRow.getText()).toContain('less than a minute ago');
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

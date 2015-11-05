'use strict';

describe('The Agent role', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    invites = require('../invitations/invites.po.js'),
    profile = require('../userProfile/profile.po.js'),
    request = require('request'),
    params = browser.params,
    agentEmail,
    randomUser;
  var req,
    jar;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should allow new user to be created with the role', function() {
    // Create user with agent role
    randomUser = Math.floor((Math.random() * 1000) + 1);
    agentEmail = 'agent' + randomUser + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys(agentEmail);
    users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'Agent')).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('Agent' + randomUser);
    users.lastNameFormField.sendKeys('Role' + randomUser);

    users.submitFormBtn.click().then(function() {

      // Wait to allow the API to send and Mailinator to receive the email
      invites.goToInvitationAcceptPage();

      browser.driver.wait(function() {
        return invites.submitFormBtn.isPresent().then(function (submitBtn) {
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

  it('should login as new user with Agent role', function() {
    expect(shared.welcomeMessage.getText()).toContain('Hello, Agent' + randomUser + ' Role' + randomUser);
  });

  it('should only have access to the current tenant', function() {
    shared.tenantsNavDropdownClick.click().then(function() {
      expect(shared.tenantsNavDropdownContents.count()).toBe(1);
      expect(shared.tenantsNavDropdownContents.get(0).getText()).toBe('Platform');
      //expect(shared.tenantsNavDropdownContents.get(0).getAttribute('value')).toBe('Platform');

      //browser.pause();
    });
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

  xit('should not have access to Flow pages', function() {
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

  // TODO TITAN2-4937
  xit('should have access to user profile details', function() {
    expect(profile.userEmail.getText()).toBe(agentEmail);
    expect(profile.firstNameFormField.getAttribute('value')).toBe('Agent' + randomUser);
    expect(profile.lastNameFormField.getAttribute('value')).toBe('Role' + randomUser);

    expect(profile.resetPasswordButton.isDisplayed()).toBeTruthy();
    expect(profile.userSkillsSectionHeader.isDisplayed()).toBeTruthy();
    expect(profile.userGroupsSectionHeader.isDisplayed()).toBeTruthy();
  });

  xit('should have access to edit user profile details', function() {
    profile.firstNameFormField.sendKeys('Update');
    profile.lastNameFormField.sendKeys('Update');
    profile.resetPasswordButton.click();
    profile.passwordFormField.sendKeys('newpassword');

    profile.updateProfileBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeTruthy();
      expect(profile.firstNameFormField.getAttribute('value')).toBe('Agent' + randomUser + 'Update');
      expect(profile.lastNameFormField.getAttribute('value')).toBe('Role' + randomUser + 'Update');
      expect(shared.welcomeMessage.getText()).toContain('Agent' + randomUser + 'Update');
      expect(shared.welcomeMessage.getText()).toContain('Role' + randomUser + 'Update');
    });
  });

});

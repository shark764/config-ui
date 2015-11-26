'use strict';

describe('The empty role', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    role = require('../management/role.po.js'),
    users = require('../management/users.po.js'),
    invites = require('../invitations/invites.po.js'),
    role = require('../management/role.po.js'),
    profile = require('../userProfile/profile.po.js'),
    params = browser.params,
    random,
    emptyRoleEmail;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should allow new user to be created with the role', function() {
    random = Math.floor((Math.random() * 1000) + 1);

    // Create empty role with no permissions
    browser.get(shared.rolePageUrl);
    shared.createBtn.click();
    role.nameFormField.sendKeys('Empty Role' + random);
    role.submitFormBtn.click().then(function() {
      shared.waitForSuccess();

      // Create user with emptyRole role
      browser.get(shared.usersPageUrl);
      emptyRoleEmail = 'emptyRole' + random + '@mailinator.com';
      shared.createBtn.click();

      users.emailFormField.sendKeys(emptyRoleEmail);
      users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'Empty Role' + random)).click();
      users.platformRoleFormDropdownOptions.get(1).click();

      users.firstNameFormField.sendKeys('Empty' + random);
      users.lastNameFormField.sendKeys('Role' + random);

      users.submitFormBtn.click().then(function() {

        // Wait to allow the API to send and Mailinator to receive the email
        invites.goToInvitationAcceptPage();

        browser.driver.wait(function() {
          return invites.submitFormBtn.isPresent().then(function(submitBtn) {
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
  });

  it('should login as new user with Empty role', function() {
    expect(shared.welcomeMessage.getText()).toContain('Hello, Empty' + random + ' Role' + random);
  });

  it('should only have access to the current tenant', function() {
    shared.tenantsNavDropdownClick.click().then(function() {
      expect(shared.tenantsNavDropdownContents.count()).toBe(1);
      expect(shared.tenantsNavDropdownContents.get(0).getText()).toBe('Platform');
    });
  });

  it('should display limited nav bar with Reporting link only', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.reportingNavButton.isDisplayed()).toBeTruthy();

    expect(shared.usersNavButton.isDisplayed()).toBeFalsy();
    //expect(shared.tenantsNavButton.isDisplayed()).toBeFalsy();
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

  // TODO TITAN2-4936 TBD
  xit('should not have access to user profile details', function() {
    expect(profile.userEmail.getText()).toContain(emptyRoleEmail);
    expect(profile.firstNameFormField.getAttribute('value')).toBe('Agent' + random);
    expect(profile.lastNameFormField.getAttribute('value')).toBe('Role' + random);

    expect(profile.resetPasswordButton.isDisplayed()).toBeTruthy();
    expect(profile.userSkillsSectionHeader.isDisplayed()).toBeTruthy();
    expect(profile.userGroupsSectionHeader.isDisplayed()).toBeTruthy();
  });

  xit('should not have access to user profile details', function() {
    expect(profile.firstNameFormField.isEnabled()).toBeFalsy();
    expect(profile.lastNameFormField.isEnabled()).toBeFalsy();
    expect(profile.resetPasswordButton.isEnabled()).toBeFalsy();
  });
});

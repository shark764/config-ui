'use strict';

describe('The users view bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    params = browser.params,
    userCount;

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


  xit('should allow updates to supported bulk action fields', function() {
    // Enable Users

    // Reset Password

    // Change Skills

    // Change Groups
  });

  xit('should allow selected user\'s status to be updated', function() {
  });
  xit('should allow selected user\'s password to be reset', function() {
  });
  xit('should allow selected user\'s skills to be updated', function() {
  });
  xit('should allow multiple skills to be updates for the selected users', function() {
  });
  xit('should update proficiency when adding a skill for existing users with the skill', function() {
  });

  xit('should allow selected user\'s groups to be updated', function() {
  });
  xit('should allow multiple groups to be updates for the selected users', function() {
  });
  xit('should do nothing when adding a group for existing users with the group', function() {
  });

  xit('should allow multiple fields to be updated at once for the selected users', function() {
  });
  xit('should allow all fields to be updated at once for the selected users', function() {
  });
  xit('should ignore disabled fields on update', function() {
  });
});

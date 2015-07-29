'use strict';

describe('The skills view bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../bulkActions.po.js'),
    shared = require('../shared.po.js'),
    skills = require('./skills.po.js'),
    params = browser.params,
    skillCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.skillsPageUrl);
    skillCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });


  xit('should allow updates to supported bulk action fields', function() {
    // Enable Skills

    // Has Proficiency

  });

  xit('should allow selected skill\'s status to be updated', function() {
  });
  xit('should allow selected skill\'s proficiency to be set to True only', function() {
  });
  xit('should update proficiency when adding a skill for existing users with the skill', function() {
  });
  xit('should do nothing when setting proficiency for existing skills with proficiency', function() {
  });

  xit('should allow multiple fields to be updated at once for the selected skills', function() {
  });
  xit('should allow all fields to be updated at once for the selected skills', function() {
  });
  xit('should ignore disabled fields on update', function() {
  });
});

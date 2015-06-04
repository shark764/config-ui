'use strict';

describe('The profile view', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    profile = require('./profile.po.js');

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  beforeEach(function() {
    browser.get(shared.profilePageUrl);
  });

  afterAll(function(){
    shared.tearDown();
  });

  it('should include profile page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

  });


});

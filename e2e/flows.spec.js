'use strict';

describe('The flows view', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    flows = require('./flows.po.js'),
    flowCount;

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  beforeEach(function() {
    browser.get(shared.flowsPageUrl);
    flowCount = flows.flowElements.count();
  });

  afterAll(function(){
    shared.tearDown();
  });

  xit('should include flow management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

  });


});

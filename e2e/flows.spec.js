'use strict';

describe('The flows view', function () {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    flows = require('./flows.po.js'),
    flowCount;

  beforeEach(function () {
    // Login
    browser.get(shared.loginPageUrl);
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);

    browser.get(shared.flowsPageUrl);
    flowCount = flows.flowElements.count();
  });

  it('should include flow management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

  });


});

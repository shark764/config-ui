'use strict';
var shared = require('../shared.po.js');

var Login = function() {
  this.loginForm = element(by.id('login-form'));
  this.emailLoginField = element(by.model('username'));
  this.passwordLoginField = element(by.model('password'));
  this.loginButton = element(by.css('.btn'));

  this.logo = element(by.css('img'));
  this.errorMessage = element(by.css('.lo-error'));

  this.copyrightLabel = element(by.css('p.copyright:nth-child(3)'));
  this.signupLegalLabel = element(by.css('p.copyright:nth-child(4)'));

  this.copyrightText = 'Copyright © 2015 LiveOps, Inc. All rights reserved.';
  this.legalText = 'Access to this site requires separate permission from LiveOps. This site contains confidential information, and may also contain content and enable interaction with users from third-party sites subject to different terms that are outside of LiveOps control. By using or accessing this site, you have agreed to the Terms of Service as outlined in the Beta Service Agreement ("Agreement"). A copy of this Agreement is available from your LiveOps contact.';


  this.login = function(email, password) {
    // Ensure user is logged out before trying to login
    browser.get(shared.loginPageUrl);
    browser.executeScript('window.sessionStorage.clear()');
    browser.executeScript('window.localStorage.clear()');

    this.emailLoginField.sendKeys(email);
    this.passwordLoginField.sendKeys(password);
    this.loginButton.click();

    browser.driver.wait(function() {
      return browser.getCurrentUrl().then(function (url) {
          return shared.loginPageUrl !== url;
      });
    }, 5000);
  };
};

module.exports = new Login();

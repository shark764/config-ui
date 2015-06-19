'use strict';
var shared = require('../shared.po.js');

var Login = function() {
  this.emailLoginField = element(by.model('username'));
  this.passwordLoginField = element(by.model('password'));
  this.loginButton = element(by.css('.btn'));

  this.logo = element(by.css('img'));
  this.errorMessage = element(by.css('.error'));

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

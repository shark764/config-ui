'use strict';

var Login = function() {
  this.emailLoginField = element(by.model('username'));
  this.passwordLoginField = element(by.model('password'));
  this.loginButton = element(by.css('.login-btn'));

  this.emailLoginCreds = 'titan@liveops.com';
  this.passwordLoginCreds = 'gKVnfF9wrs6XPSYs';

  this.login = function(email, password) {
    this.emailLoginField.sendKeys(email);
    this.passwordLoginField.sendKeys(password);
    this.loginButton.click();
  };
};

module.exports = new Login();

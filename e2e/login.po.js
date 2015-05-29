'use strict';

var Login = function() {
  this.emailLoginField = element(by.model('username'));
  this.passwordLoginField = element(by.model('password'));
  this.loginButton = element(by.css('.login-btn'));

  this.emailLoginCreds = 'test@test.com';
  this.passwordLoginCreds = 'password';

  this.login = function(email, password) {
    this.emailLoginField.sendKeys(email);
    this.passwordLoginField.sendKeys(password);
    this.loginButton.click();
<<<<<<< HEAD
  };
=======
  }; 
>>>>>>> d18a76e8d48367b3671df90aef81bf62c7a6d92c
};

module.exports = new Login();

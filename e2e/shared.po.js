'use strict';

var Shared = function() {
  // Page URLS
  this.mainUrl = 'localhost:3000/#/';
  this.loginPageUrl = this.mainUrl + 'login';
  this.usersPageUrl = this.mainUrl + 'users';
  this.tenantsPageUrl = this.mainUrl + 'tenants';

  // Elements that are present on all pages: navbar, etc.
  this.navBar = element(by.css('.navbar'));
  this.welcomeMessage = element(by.css('div.ng-binding:nth-child(3)'));
  this.logoutButton = element(by.css('.fa-sign-out'));
};

module.exports = new Shared();

'use strict';

var Shared = function() {
  // Page URLS
  this.mainUrl = 'http://localhost:3000/#/';
  this.loginPageUrl = this.mainUrl + 'login';
  this.usersPageUrl = this.mainUrl + 'users';
  this.tenantsPageUrl = this.mainUrl + 'tenants';

  // Elements that are present on all pages: navbar, etc.
  this.navBar = element(by.css('.navbar'));
  this.welcomeMessage = element(by.css('.navbar > div:nth-child(3) > span:nth-child(1)'));
  this.logoutButton = element(by.css('.fa-sign-out'));
  this.siteNavLogo = element(by.css('.navbar > a:nth-child(1)'));
  this.tenantsNavDropdown = element(by.model('activeTenant'));
  this.usersNavButton = element(by.css('li.active:nth-child(3) > a:nth-child(1)'));
  this.tenantsNavButton = element(by.css('ul.ng-scope > li:nth-child(4) > a:nth-child(1)'));
};

module.exports = new Shared();

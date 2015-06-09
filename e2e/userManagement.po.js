'use strict';

var UserManagement = function() {
  this.sidebar = element(by.css('.side-bar'));
  this.sidebarCollapse = element(by.css('.collapse-bar'));
  this.sidebarMenu = element(by.css('.menu-container'));

  this.userList = element(by.css('.user-list-container'));

  this.sidebarOpenArrow = element(by.css('.fa-angle-double-right'));
  this.sidebarTack = element(by.css('.fa-thumb-tack'));
  this.sidebarCloseArrow = element(by.css('.fa-angle-double-left'));

  this.sidebarHeader = this.sidebarMenu.element(by.css('h4'));

  // Page links
  this.sidebarUserLink = element(by.id('users-side-bar-link'));
  this.sidebarGroupsLink = element(by.id('groups-side-bar-link'));
  this.sidebarSkillsLink = element(by.id('skills-side-bar-link'));
  this.sidebarRolesLink = element(by.id('roles-side-bar-link'));
  this.sidebarLocationsLink = element(by.id('locations-side-bar-link'));
  this.sidebarExtensionsLink = element(by.id('extensions-side-bar-link'));
};

module.exports = new UserManagement();

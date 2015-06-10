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
  this.sidebarUserLink = element(by.id('user-management-link'));
  this.sidebarGroupsLink = element(by.id('group-management-link'));
  this.sidebarSkillsLink = element(by.id('skill-management-link'));
  this.sidebarRolesLink = element(by.id('role-management-link'));
  this.sidebarLocationsLink = element(by.id('location-management-link'));
  this.sidebarExtensionsLink = element(by.id('extension-management-link'));
};

module.exports = new UserManagement();

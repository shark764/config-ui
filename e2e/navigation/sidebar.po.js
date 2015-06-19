'use strict';

var Sidebar = function() {
  this.sidebar = element(by.css('.side-bar'));
  this.sidebarCollapse = element(by.css('.collapse-bar'));
  this.sidebarMenu = element(by.css('.menu-container'));

  this.mainContent = element(by.id('main-content'));

  this.openArrow = element(by.css('.fa-angle-double-right'));
  this.tack = element(by.css('.fa-thumb-tack'));
  this.closeArrow = element(by.css('.fa-angle-double-left'));

  this.header = this.sidebarMenu.element(by.css('h4'));

  // User Management Page links
  this.userLink = element(by.id('user-management-link'));
  this.groupsLink = element(by.id('group-management-link'));
  this.skillsLink = element(by.id('skill-management-link'));
  this.rolesLink = element(by.id('role-management-link'));
  this.locationsLink = element(by.id('location-management-link'));
  this.extensionsLink = element(by.id('extension-management-link'));

  // Configuration Page links
  this.tenantsLink = element(by.id('tenants-configuration-link'));

  // Flow Designer Page links
  this.flowsLink = element(by.id('flow-management-link'));
  this.queuesLink = element(by.id('queue-management-link'));
  this.mediaLink = element(by.id('media-management-link'));
};

module.exports = new Sidebar();

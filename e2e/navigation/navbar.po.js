'use strict';

var Navbar = function() {
  // User Management Page links
  this.userManagementDropdown = element(by.css('#users-nav-link .dropdown'));
  this.managementOptions = this.userManagementDropdown.all(by.css('li'));
  this.userLink = element(by.id('user-management-link'));
  this.groupsLink = element(by.id('group-management-link'));
  this.skillsLink = element(by.id('skill-management-link'));
  this.rolesLink = element(by.id('role-management-link'));
  this.locationsLink = element(by.id('location-management-link'));
  this.extensionsLink = element(by.id('extension-management-link'));

  // Configuration Page links
  this.configurationDropdown = element(by.css('#tenants-nav-link .dropdown'));
  this.configurationOptions = this.configurationDropdown.all(by.css('li'));
  this.tenantsLink = element(by.id('tenants-configuration-link'));
  this.integrationsLink = element(by.id('integrations-configuration-link'));
  this.listsLink = element(by.id('lists-configuration-link'));

  // Flow Designer Page links
  this.flowsDropdown = element(by.css('#flows-nav-link .dropdown'));
  this.flowsOptions = this.flowsDropdown.all(by.css('li'));
  this.flowsLink = element(by.id('flow-management-link'));
  this.queuesLink = element(by.id('queue-management-link'));
  this.mediaLink = element(by.id('media-management-link'));
  this.dispatchMappingsLink = element(by.id('dispatch-mappings-configuration-link'));

  // Flow Debugger Page links
  this.flowDebuggerLink = element(by.id('flow-debugger-link'));

  this.userManagementNavDropdown = element(by.css('#users-nav-link > dropdown'));
  this.downArrow = 'nav-dropdown-down-arrow';
};

module.exports = new Navbar();

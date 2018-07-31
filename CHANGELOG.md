# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [4.50.0]
* CXV1-14481 - Add data-source in  verint integraion-config-ui.

## [4.49.8]
* CXV1-14393 - Cannot disable an identity provider if the IdP has disabled the application on their side.

## [4.49.7]
* CXV1-14669 - Transfer Lists - When creating a new transfer list, submit fails due to Warn/Cold Transfer property type.

## [4.49.6]
* CXV1-14496 - Update the user detail panel (View/Edit) to show the platform account status as it is defined for the list view.

## [4.49.5]
* CXV1-8657 - Added error handling around 404s on the MessagingFrom route

## [4.49.4]
* Fixed issue with Dispatch Mappings and use of phoneUtils for E164 validation.

## [4.49.3]
* CXV1-14495 - Update the user listing page so there are two columns available for user status instead of one.

## [4.49.2]
* Remove supervisor toolbar feature flag

## [4.49.1]
* CXV1-13830 - Added insufficient privileges message for App Dock, when attempting to load Message Transcripts, and not having MESSAGING_USERS_READ permission on current role.

## [4.49.0]
* CXV1-13680 - Remove old toolbar from config-ui
* CXV1-14659 - Silent Monitoring - Permissions are being cached
* CXV1-14723 - Silent monitoring - Navigating to another tenant and back causes "postMessage of undefined"

## [4.48.5]
* CXV1-13691 - Resetting user password breaks config-ui.

## [4.48.4]
* CXV1-14632 - Telstrat - Switching from a Telstrat to a non-telstart tenant causes UI errors.

## [4.48.3]
* CXV1-13691 - Resetting user password breaks config-ui
* CXV1-13742 - Updated E 164 validation so it can include numbers according to standard, checked documentation.

## [4.48.2]
CXV1-13866 - Added loading GIF for AppDock and interaction view.

## [4.48.1]
* CXV1-13716 - Navigating to a Non Existing RealTime Dashboard does not navigate to Dashboard Overview.

## [4.48.0]
CXV1-9940 - Interaction monitoring table (Alpha UAT)

## [4.47.0]
* CXV1-14191 - added value selector for agentInitiated

## [4.46.8]
* CXV1-14494 - Replace all user-facing text instances of 'CxEngage Authentication' with 'Platform Authentication'

## [4.46.7]
* CXV1-14278 - Cannot update default tenant on user profile page in config UI

## [4.46.6]
* CXV1-14514 - Changing type of an existing media to 'Media List' throws a bunch of entries in list.

## [4.46.5]
* CXV1-14515 - Can't change a media to Audio Type when editing.

## [4.46.4]
* CXV1-9301 - Can't change media type.

## [4.46.3]
* CXV1-14071 - Business Hours - Cannot enter Midnight as End Time.

## [4.46.2]
Fix jenkins deployments (broken)

## [4.46.0]
CXV1-14372 - Added Workstation ID field to TenantUser service for TelStrat QM & Recording Integration (broken)

## [4.45.2]
* CXV1-14279 - SSO: "Cannot Read Property tenantId of null" when signing in with sso (broken)

## [4.45.1] (broken)
* Rebasing Hotfixes:
* Fixed Custom Domain Help Links
* Fixed inability to change a user's role
* Fixed user statuses
* Re-added externalId
* Isolated Logi script
* Fixed user invite issues
* Fixed Status column in user management

## [4.45.0]
* CXV1-14221 - The information in Agent State Table doesn't show properly using IE11 and Edge

## [4.44.9]
* CXV1-12962 - Display appropriate error banner while creating an IDP with the existing IDP name

## [4.44.8]
* CXV1-9774 - Prevent JS errors upon logout from any page

## [4.44.7]
* CXV1-12852 - Permission for Quality Management
* CXV1-14249 - Move "Hello <user name>" into dropdown so "Quailty Management" link will fit

## [4.44.6]
* CXV1-13509 - Add Calabrio to integrations page of Config-UI

## [4.44.5]
* CXV1-14381 - Fixed issue caused by deep link query params not being all lower case

## [4.44.4]
* CXV1-14377 - Fix issue with CxEngage Authentication on Tenants page not being reflected on the UI
* CXV1-14381 - Fix issue with deep link not working properly when tenant-id is provided in the url

## [4.44.3]
* CXV1-10838 - Fixed bugs related to creating new users and tenants as well as loading specific users and tenants

## [4.44.2]
* Cleaned up JS errors around the isNew function
* Fixed an error showing around identityProviders

## [4.44.1]
* Revert 732f236786ce558a8acc921dfdce726c4954c3c1 as agent-initiated should not
  be customer facing yet
* CXV1-12218 - Updated deep linking in Config-UI
* Update RTD to 5.2.8

## [4.44.0]
* CXV1-10838 - Update user invitation creation/tenant invitation process for SSO

## [4.43.20]
* CXV1-14015 - Updated function to fix Forgot Password redirection when coming from SSO to a new Tenant that requires authentication.

## [4.43.19]
* CXV1-14218 - Identity Providers - Name field error not formatted correctly.

## [4.43.18]
* CXV1-14219 - Identity Providers - Name label updates in Real time.

## [4.43.17]
* CXV1-14015 - Fixed bug that prevented users to login if they visited Forgot Password page previous to a login attempt.

## [4.43.16]
* Update RTD to 5.2.7
* Fix SDK Listener ignoring post messages

## [4.43.15]
* CXV1-14218 - Identity Providers - Name field error not formatted correctly.

## [4.43.14]
* CXV1-14270 - Version bump for RTD. Group and Skills Source Switchers.

## [4.43.13]
* CXV1-14191 - added value selector for agentInitiated

## [4.43.12]
* CXV1-14212 - Missing "Identity Providers" Link to Associated Doc.

## [4.43.11]
* CXV1-13562 - Fix for switching tenants redirect UX

## [4.43.10]
* Update SDK Listener to ignore foreign events

## [4.43.9]
* CXV1-13838 - SDK version bump for shared parameter needed for lists

## [4.43.8]
* CXV1-14059 - Fix for Side Panel not being resizable in IE11 when the name is too large

## [4.43.7]
* CXV1-14251 - Missing "Interaction Monitoring" Link to Associated Doc.

## [4.43.6]
* CXV1-13983/CXV1-13984 - Version bump for RTD. Group/Skills filters bug fixes

## [4.43.5]
* CXV1-12854 - Update to quality management URL

## [4.43.4]
* CXV1-13931 - Remove broken column preferences / default all columns to checked

## [4.43.3]
* CXV1-12854 - Update quality management to use new link

## [4.43.2]
* CXV1-13836 - Fix login with sso links

## [4.43.1]
* CXV1-13125 - Pages are Missing Links to Associated Docs

## [4.43.0]
* CXV1-12854 - Quality management (Telstrat iframe)

## [4.42.5]
* CXV1-13987 - Realtime Dashboards - Disabled Queues selectable in Queues Dashboard

## [4.42.4]
* CXV1-14010 - Fix quotes on login page

## [4.42.3]
* CXV1-13570 Fix for initial IDP toggle disabled

## [4.42.2]
* CXV1-11557 - Presence Reasons Name Cuts Words in Half and Starts on New Line

## [4.42.1]
* CXV1-13836 - Fix login UI for SSO

## [4.42.0]
* CXV1-13836 - Update login UI for SSO

## [4.41.1]
* CXV1-13931 - Tables losing columns on refresh

## [4.41.0]
* Add Logi Dashboards

## [4.40.2]
* CXV1-13984 - Version bump for RTD latest version
* CXV1-8127 - Filter duration in Interaction Monitoring does not show correctly in FireFox.
* CXV1-13740 - UI - Make year on Copyright notice update automatically.
* CXV1-13788 - Flow Management pages - "Submit" changed to "Submit Query" in Firefox.

## [4.40.1]
* CXV1-13528 - Fix CSS issues related to Custom Dashboards mail filters not showing properly, overlaying elements placed by user.

## [4.40.0]
* CXV1-13763 - Hide toast popups for new user invites and password updates after user logs in to CX-Enagage.

## [4.39.9]
* CXV1-13531 - Version bump for RTD, added a small change for CSS in RTD and translation for a label.

## [4.39.8]
* CXV1-13742 - Display a Confirmation Toast popup for Password Reset

## [4.39.7]
* CXV1-13851 - Fix for conference only showing on tooltip

## [4.39.6]
* CXV1-13547 - Fixed issue with Generic Lists iFrame height not rendering properly in Firefox

## [4.39.5]
* CXV1-13854 - Update default to "Conference" if no Artifact subtype is available

## [4.39.4]
* CXV1-12753: Trying to update a disabled Twilio integration sends incorrect payload

## [4.39.3]
* CXV1-13707: Fixed issue whereby Tenant Details panel was not completely clearing out upon user clicking 'Cancel' button. Also fixed issue whereby submit button was not getting activated upon color picker value changing.

## [4.39.2]
* CXV1-13844: Fixed issue with new API property breaking initial save of new tenant

## [4.39.1]
* CXV1-13762: SDK bump

## [4.39.0]
* Added Protected Brandings 'from address' to tenant details panel

## [4.38.5]
* CXV1-13720 - Able to login with Cx creds despite it being disabled
* CXV1-13719 - Hide current tenant from dropdown
* CXV1-13588 - Ability to select Denied as an Cx authentication status
* CXV1-13586 - Only third party IDPs should be displayed

## [4.38.4]
* CXV1-12492 - Added ellipsis and tooltips to artifact subtypes
* Update SDK to 6.19.6

## [4.38.3]
* CXV1-12492 - Fixed displaying artifact subtypes

## [4.38.2]
* Revert Silent Monitoring changes

## [4.38.1]
* CXV1-12492 - Fixed properly filtering artifact types to only show audio-recording

## [4.38.0]
* CXV1-13348 - Added functionality to change the Help Links in case a Custom Subdomain has been added to the Tenant.

## [4.37.1]
* CXV1-12492 - Fixed a few minor bugs around switching artifacts

## [4.37.0]
* CXV1-13517 - Hide DNC from nav
* Fixed direct navigation to campaign pages to redirect to user management

## [4.36.0]
* CXV1-12492 - Multiple Historical Voice Artifacts
* Update SDK to v6.19.0

## [4.35.2]
* CXV1-10832 - Updated Tenant Management page to work with API changes.

## [4.35.1]
* CXV1-13517 - Remove Outbound from Navbar / block navigation

## [4.35.0]
* CXV1-10832 - Fixed Tenant Management page SSO bug that prevented new Tenants from being created.

## [4.34.0] <REVERTED>
* CXV1-9940 - Silent Monitoring

## [4.33.0]
* CXV1-13300 - Email Templates

## [4.32.0]
* CXV1-10832 - Added IDP management on the Tenant Management page

## [4.31.2]
* SDK Version Bump to 6.16.0

## [4.31.1]
* CXV1-13211 - Additional logs for initial SDK tenant set

## [4.31.0]
* CXV1-12277 - Generic lists

## [4.30.17]
* CXV1-12954 - Fixed issues with Presence Reasons/Disposition Lists when the "Cancel" action is triggered. Now is allowing the user to add categories and dispositions/reasons

## [4.30.16]
* CXV1-13264 - Reason Lists - When a category has no reasons under it indented then submitted, error is incorrect for why it wasn't submitable

## [4.30.15]
* CXV1-13306 - Reason Lists - Category is giant text box (updated)
* CXV1-12942 - Reason Lists - Changing Your Reason Multiple Times Can Result in an Empty Field that Wont Save.(updated)

## [4.30.14]
* Update Reason List

## [4.30.13]
* CXV1-13306 - Reason Lists - Category is giant text box
* CXV1-12942 - Reason Lists - Changing Your Reason Multiple Times Can Result in an Empty Field that Wont Save.

## [4.30.12]
* CXV1-13276 - Hide Custom Stat page

## [4.30.11]
* CXV1-13265 - Reason Lists - Category can be saved without a value.

## [4.30.10]
* CXV1-12560 - Un-did selected changes to tenant invite process since these changes would best be left out until some related API work is done

## [4.30.9]
* CXV1-12951 - Reason Lists - When an error occurs, Fixing the issue doesn't let you submit the change (updated)
* CXV1-12949 - Reason Lists - Getting an Error Message Causes all Reasons Lists to be Unchangeable Until Page is Navigated Away From (updated)
* CXV1-12942 - Reason Lists - Changing Your Reason Multiple Times Can Result in an Empty Field that Wont Save.(updated)

## [4.30.8]
* Update Realtime Dashboards to v5.0.8

## [4.30.7]
* CXV1-13033 - Removed Popup and added a regular error message on top of Disposition List for empty Categories
* CXV1-13032 - Added the centered error message, when trying to add an empty disposition in Reason List Management

## [4.30.6]
* CXV1-12951 - Reason Lists - When an error occurs, Fixing the issue doesn't let you submit the change
* CXV1-12949 - Reason Lists - Getting an Error Message Causes all Reasons Lists to be Unchangeable Until Page is Navigated Away From
* CXV1-12942 - Reason Lists - Changing Your Reason Multiple Times Can Result in an Empty Field that Wont Save.

## [4.30.5]
* CXV1-13032 - Fixed error message not centered in Disposition Lists, when trying to submit with no disposition selected.

## [4.30.4]
* CXV1-13177 - Added Mitel Branding for forgot password and reset password screens. Modified CSS for proper UI

## [4.30.3]
* CXV1-12906 - Reason Lists - Squishing the Side Panel Causes UX Issues

## [4.30.2]
* CXV1-11831 - Updated assigned flow doesn't display in Dispatch Mapping Management screen

## [4.30.1]
* CXV1-12397 - IDP XML file uploads bug fix followup

## [4.30.0]
* CXV1-12823 -  Added Legal Disclaimer link to portal access pages

## [4.29.16]
* CXV1-12397 - Fixed bugs related to IDP XML file uploads

## [4.29.15]
* CXV1-12560 - Fixed issue with global loading mode firing at the wrong time

## [4.29.14]
* CXV1-12560 - Made it so that when user is coming in via a tenant invite, the user table and the tenant drop down are in loading mode until we have fully loading all of the new tenant data

## [4.29.13]
* CXV1-12560 - Fixed issue with incorrect tenant being set after an existing platform user is logging into a tenant via an email invite link

## [4.29.12]
* CXV1-12760 - Presence & Dispositions Deleting items causes fatal page error
* CXV1-12414 - resolved problem with textarea height(update)

## [4.29.11]
* CXV1-12529 - Fix SSO login from being blocked by popup blockers

## [4.29.10]
* CXV1-12924 - Interaction Monitoring displays agent IDs instead of names
* Update Realtime Dashboards to v5.0.7

## [4.29.9] ** DO NOT RELEASE - WILL BREAK REALTIME DASHBOARDS **
* CXV1-12414 - Config UI - Long Disposition List Name Causes Issues (update)
* CXV1-12912 - Fix branding for privacy link

## [4.29.8]
* CXV1-12761 - Added Email Mapping field to Identity Provider configuration so it can be selected for URL and XML
* CXV1-12912 - Added privacy policy link to nav bar and SSO login

## [4.29.7]
* CXV1-12811 - Salesforce toggle fix
* Update Config Shared to v1.5.53

## [4.29.6]
* Fix dashboards being stored in scope
* Update Realtime Dashboards to v5.0.5
* Privacy Policy update

## [4.29.5]
* CXV1-12760 - Presence & Dispositions Deleting items causes fatal page error
* CXV1-12414 - title property added in the disposition list  to see the whole text

## [4.29.4]
* CXV1-12811 - Activity record toggle in salesforce integration

## [4.29.3]
* Update Realtime Dashboards to v5.0.3

## [4.29.2]
* Set SDK token on initial login

## [4.29.1]
* Update Realtime Dashboards to v5.0.2

## [4.29.0]
* Update Realtime Dashboards to v5.0.1
* Update SDK to v4.12.0
* CXV1-12639 - Decrease Loading times for Realtime Dashboards
* CXV1-12229 - Agents not displaying until second batch request
* CXV1-12512 - Update time data in tables to HH:MM:SS format
* CXV1-12769 - Display Twilio integration on User Profile page if they have an active Intergration
* CXV1-11155 - Clicking on Contact Layout A Second Time Removes Items from Their Respective Fields
* CXV1-12414 - Config UI - Long Disposition List Name Causes Issues(update)

## [4.28.6]
* Release Realtime Dashboards v4.6.6
* CXV1-12414 - Long Disposition List Name Causes Issues

## [4.28.5]
* CXV1-12604 - Fix standalone flow-designer not loading correctly in Firefox
* CXV1-12489 - sso - Provide tooltip to logout and logback in to config-ui

## [4.28.4]
* (no ticket) - Fixed issue that might be causing build to break...

## [4.28.3]
* CXV1-12318 - Remove Inactive Tenants from /me Endpoint Response
* CXV1-12432 - Create debug url parameter for spoofing token expiration
* CXV1-11824 - Support GVN (formerly 2600hz) in Config UI
* CXV1-10833 - Add Re-auth to tenant switching
* CXV1-10842 - Update forgot password functionality
* CXV1-12488 - Replace display text for GVN on Default Gateway dropdown on Tenant Detail panel
* CXV1-9823  - Fixed capacity rule outdated function so it shows  current selected rules
* CXV1-12500 - GVN (formerly 2600hz) - Account Id and Account API Key fields are disabled in qe for serenova-voice integration
* CXV1-9513 - Remove "Ext." field from user management details panel
* CXV1-12346 - Change name of label URL to XML Config to: Metadata URL
* CXV1-12394 - Prevented current IDP from being disabled
* CXV1-12382 - Confirm the user with a popup message when Tenant Admin is changed
* CXV1-12398 - Allow for new XML direct input field for IDP page
* CXV1-12576 - Refactor create new/additional Salesforce Integrations
* CXV1-12217 - Remove 2nd vertical scrollbar
* CXV1-12395 - SSO - set "Type" dropdown to active configuration type upon selection of item in IDP list table
* CXV1-9535 - Modified configuration for table in users, to add zero skill element, and also to bind a "No skill" filter to the header of the same table

## [4.28.2]
* Updated docker build to accomodate for remote designer
* CXV1-10847 - Update experience for Re-Authentication or auth expiration, removed "^" from bower.json to avoid bugs caused by package updates and added bower-shrinkwrap to ensure that bower sub-dependencies don't change and break the build
* CXV1-10835 - Add ability to select default tenant for a user in their user profile

## [4.28.1]
* CXV1-12146 - Fixed bug where user was taken back to regular login screen after being logged in via SSO

## [4.27.0]
* CXV1-10843 Modified login screen to support SSO login
* CXV1-11275, CXV1-11276, CXV1-11605 - Updated Verint side panel on Integrations page with new fields for (S)FTP, User Sync, QM, and WFM sections (Verint is feature-flagged out at this time)
* Updated to support standalone flow designer
* CXV1-10830 - Fixed typo in markup on Identity Provider page active/inactive toggle switch
* CXV1-10830 - Added link to clear XML file upload field on Identity Provider page

## [4.26.3]
* CXV1-11918 - Fixed issue with broken Messaging Transcripts and Audio Recordings spawned from links in Historical Reports
* CXV1-10846 - Add support for Tenant specific deep linked login SSO redirect (for existing user invite and tenant re auth)

## [4.26.2]
* Updated to Flow Designer 5.4.13

## [4.26.1]
* CXV1-10830 - Created Identity Management page (Feature Flags Removed)

## [4.26.0]
* Updated to Flow Designer 5.4.13-SNAPSHOT
* CXV1-10830 - Created Identity Management page (Feature Flagged)

## [4.25.21]
* CXV1-11924 - JS error on Users page due undefined value in permissions check

## [4.25.20]
* Bumping Flow Designer to 5.4.12

## [4.25.19]
* CXV1-11681 - Bumping config-shared in order to fix search bug

## [4.25.18]
* Bumping Flow Designer to 5.4.11

## [4.25.17]
* Bumping Flow Designer to 5.4.10

## [4.25.16]
* Bumping Flow Designer to 5.4.9

## [4.25.15]
* CXV1-10548 - User details for Verint Integration will only show when Verint Integration Available

## [4.25.14]
* CXV1-10177 - FEATURE FLAGGED OUT: Create UI for new Verint Integration
* CXV1-8555 - Refactor of proficiency display on Queue Query Builder to fix multiple bugs
* CXV1-10548 - FEATURE FLAGGED OUT: Added Platform/Tenant Alias Ids to user details for Verint Integration
* CXV1-11556 - Added MANAGE_ALL_USERS check for editing user data

## [4.25.13]
* Bumping Flow Designer to 5.4.8

## [4.25.12]
* Revert "CXV1-8555 - Fixed issue with proficiency value not displaying for basic queries in details panels on queries page"

## [4.25.11]
* CXV1-8555 - Fixed issue with proficiency value not displaying for basic queries in details panels on queries page
* CXV1-10669 - On integrations page, converted email listener password field to use HTML password input type, also fixed incorrect integration-specific input types.
* Bumping Flow Designer to 5.4.7

## [4.25.10]
* Bumping Flow Designer to 5.4.6

## [4.25.9]
* Bumping Flow Designer to 5.4.5

## [4.25.8]
* Bumping Flow Designer to 5.4.4

## [4.25.7]
* CXV1-11364 - Fix silent monitoring page

## [4.25.6]
* Bumping Flow Designer to 5.4.3

## [4.25.5]
* Bumping realtime-dashboards to fix build

## [4.25.4]
* CXV1-11049 - Bumping soundwave to prevent unnecessary calls to /users and /queues

## [4.25.3]
* Bumping Flow Designer to 5.4.1

## [4.25.2]
* CXV1-11056 - Prevent unnecessary calls to /users, /queues, and /flows routes on realtime dashboards

## [4.25.1]
* CXV1-11056 - Prevent unnecessary calls to /users route on config pages

## [4.25.0]
* Bumping Flow Designer to 5.4.0

## [4.24.0]
* Bumping Flow Designer to 5.3.4

## [4.23.0]
* Bumping Flow Designer to 5.3.3

## [4.22.1]
* Changed User table to use infinite scroll + bumping shared

## [4.22.0]
* Bumping Flow Designer to 5.3.2

## [4.21.0]
* Bumping Flow Designer to 5.3.1

## [4.20.0]
* Bumping Flow Designer to 5.3.0

## [4.19.2]
* Setting EMAIL_PERMS Flag to False
* Removed EMAIL_PERMS Flag check from email templates. Flag is now set for integration only.

## [4.19.1]
* Bumping realtime-dashboards to 4.6.3
* Bumping config-shared to 1.5.32
* Setting EMAIL_PERMS Flag to True

## [4.19.0]
* Bumping flow designer to v5.2.1

## [4.18.6]
* Bumping flow designer to v5.1.0
* Move notation parsing to Flow Designer

## [4.18.5]
* Bumping realtime-dashboards to v4.6.2

## [4.18.4]
* Bumping flow designer to v5.0.4

## [4.18.3]
* CXV1-10170 - Bumping soundwave so that it won't break silent monitoring, fixing issue that was keeping silent monitoring toolbar from appearing.

## [4.18.2]
* CXV1-10170 - Bumping RTD to v4.6.1 to add new channels to filter

## [4.18.1]
* Fixing version of angular-color-picker to avoid breaking changes

## [4.18.0]
* Reverting Soundwave to v3.1.19

## [4.17.0]
* Bumping flow designer to 5.0.3

## [4.16.0]
* Bumping flow designer to 5.0.2

## [4.15.0]
* Bumping flow designer to 5.0.1

## [4.14.1]
* CXV1-9770 - Fixed broken field label for New Password in invite-accept page

## [4.14.0]
* CXV1-9310 - Fixed JS error when moving from RTD to Flows
* CXV1-9310 - Fixed JS console errors that were causing a ton of noise for QE and dev, bumped up soundwave, realtime-dashboards, and config-shared since they also had changes related to this work.

## [4.13.0]
* Upgrade to flow-designer 5.0.0

## [4.12.0]
* Added spacing to bottom of dashboards, downgraded flow designer, upgraded rtd

## [4.11.6]
* Updated to flow-designer 4.3.2

## [4.11.5]
* CXV1-8523 - Bump RTD, add default column selection for resource dashboard tables

## [4.11.4]
* CXV1-8523 - Fix Reasons dropdown filter on RTD - this PR is just for a minor css fix

## [4.11.3]
* CXV1-8523 - Fix Reasons dropdown filter on RTD

## [4.11.2]
* CXV1-8523 - Config-UI changes for Group/Skill reporting

## [4.11.1]
* CXV1-9131 - Removed extra check to display header causing unwanted behavior
* CXV1-9234 - Added email integration listener success and error alerts
* CXV1-8875 - Hide image controls in email template rich text editor
* Updated flow-designer to 4.3.1

## [4.11.0]
* CXV1-9207 - Fixed email integrations form bug with SMTP Encryption Types
* CXV1-8883 - Prevent queue query builder from allowing any number less than one or a decimal
* Bumping Flow Designer

## [4.10.25]
* Fixed Email feature flag

## [4.10.24]
* Email perms now under feature flag EMAIL_PERMS

## [4.10.23]
* CXV1-8879 - Fixed category creation button on transfer lists contact panel
* CXV1-8878 - Bug fix for angular moment picker minification override
* CXV1-8923 - Added email perms to UI

## [4.10.22]
* CXV1-8501 - Added email integration form validation
* CXV1-8746 - Version Bump for Realtime Dashboards
* CXV1-8864 - Remove blockquotes from email template rich text editor
* CXV1-8878 - Bug fix for angular moment picker, updated dependency

## [4.10.21]
* CXV1-8816 - Fixed bug that prevented flows from disabling
* CXV1-8817 - Remove Create Version "+" button on Flow Management side panel
* CXV1-8762 Email templates
* CXV1-8232 - Fixed issue with flow copying not also copying flow inputs, outputs, and defaults, and also used the opportunity to replace the hacky $rootScope-storage of the last saved flow data with a getter and setter coming from the flow service in config-shared

## [4.10.20]
* CXV1-8741- fixed bug with notations bind to cursor after viewing flow
* no ticket - Fixed build process error
* no ticket - fix mitel branding

## [4.10.19]
* no ticket - fix icon preview typo and take out fallback icon

## [4.10.18]
* CXV1-8474 - fixed bug with flows not enabling and disabling correctly after coming back from flow designer

## [4.10.17]
* no ticket - add dynamic s3BucketUrl in env.js and add fallback icon

## [4.10.16]
* Flow designer bump from SNAPSHOT

## [4.10.15]
* CXV1-8597 - Added Mitel Branding favicon and logo to assets

## [4.10.14]
* CXV1-8148 - Set tenant dropdown in top nav to only display active tenants
* CXV1-8474 - Fixed issue that was allowing the user to copy a flow with no active version and have the flow set to 'enabled'
* Bumping Flow Designer
* CXV1-8599 - Bumping soundwave
* CXV1-2085 - Added white label branding panel and bumping config-shared to match
* CXV1-8082 - Change from sandbox to production instance for salesforce interaction lib
* CXV1-8143 - Require current password for password update
* CXV1-8619 - Fixed over-scroll layout break
* CXV1-8645 - Fixed password reset and tenant accept

## [4.10.13]
* CXV1-6501 - fixed broken enable/disable functionality, also fixed bug with drafts table not updating on save of new draft
* CXV1-8450 - Bumped Realtime Dashboards again to add several new widgets on both interactions and resources dashboards
* CXV1-8450 - Bumped Realtime Dashboards version for ticket that replaces two stats on interactions dashboard
* CXV1-8085 - Updated to angular 1.6.3 fixed breaking changes

## [4.10.12]
* CXV1-8119 - Added additional warning messages for user transfer lists and message templates
* CXV1-7482 - Fixed duplicate extensions form bug
* Update to latest flow designer

## [4.10.11]
* CXV1-8114 - Removed Realtime Recordings Page

## [4.10.10]
* CXV1-6717 - Fixed decimal interpretation and added filtering for interaction ID
* CXV1-7401 - Fixed API key visibility when switching between keys
* CXV1-8020 - Fixed Extensions form to reset on cancel, disable save until form is valid, and form is no longer disabled when Twilio is selected
* CXV1-6642 - Fixed Reasons List dropdown from getting stuck on smaller screen scroll and fixed repeat track by error when selecting multiple times in a dropdown
* CXV1-6844 - Removed ability to create empty disabled reason lists via a users detail and added an alert
* CXV1-8091 - Updated branding logo on login page

## [4.10.9]
* Remove billing reports link from Navbar

## [4.10.8]
* CXV1-6456 - Fixed issue with missing description and lodash version change breaking capacity rules

## [4.10.7]
* CXV1-6456 - Implemented Updated Requirement on Flow Cloning Feature
* CXV1-7975 - Fix bug with Realtime Dashboard Tables Showing Up Empty
* CXV1-7908 - Don't allow inactive attributes on contact layouts.
* Bumping Flow Designer

## [4.10.6]
* Limit dropdown height for tenant select
* CXV1-7871 - Add Error Message to Contact Attributes Bulk Edit for Inherited Items
* CXV1-7828 - Contact Attributes page: broke Label column into 2 separate columns for both Label and Language

## [4.10.5]
* CXV1-7854 - Add skill proficiency selector to queue query builder v2, set v2 query builder as active version
* CXV1-3938 - Added "All" option to filter checkbox dropdown for all "Manage" views
* CXV1-7782 - Simply updated Soundwave to latest version after translations bug was fixed in the toolbar
* CXV1-6456 - Enable cloning of flows
* CXV1-7070 -  **IMPORTANT** this will not work, and in fact, may break the appDock, until CXV1-7419 is complete! Updated App Dock to be able to handle SMS messages, and use a cleaner method of interaction type detection. Need this to go on dev-config b/c it is not possible to test this locally.
* CXV1-7653 - Fixed 403/Forbidden on call recording retrieval/playback on Recordings page
* CXV1-7053 and CXV1-7054 - Contact Attributes and Layouts *NOTE: Not for production release. Ensure gulp/flags.js has CONTACT_MANAGEMENT set to false before making a prod release*
* CXV1-6726 - Add billing reports menu link *NOTE: Not for production release until live access. Ensure gulp/flags.js has PLATFORM_REPORTING set to false before making a prod release*
* CXV1-7664 - Add 'work-item' channel type to Capacity Rules
* Updating Flow Designer

## [4.10.4]
* CXV1-5699 - Removed reason list creation from Groups until group has been created.
* CXV1-4043 - Changed Capacity Rule version naming so that v1 will be the first version, as opposed to v0.
* CXV1-7082 - Created Warning for trying to save integration with the same name

## [4.10.3]
* Bump soundwave

## [4.10.2]
* Bump realtime dashboards
* CXV1-7603 - Fixed issue that was preventing users in UK from setting business hour exception to today's date

## [4.10.1]
* Fixed linting errors
* CXV1-7598 - Updated config-shared for fix to GlobalRegionsList service, updated gulp to stop build upon linting error

## [4.10.0]
* Update soundwave for toolbar interconnect
* Enable SIP contacts in transfer lists
* Add 'messaging' channel type for message templates

## [4.9.5]
* Changed password field on Zendesk integration to actually be a password type input (type="password")

## [4.9.4]
* CXV1-7446 - Remove workItems switch from Zendesk integrations

## [4.9.3]
* Fix word wrap bug on API key management

## [4.9.2]
* CXV1-7381 - config-shared version bump to allow for fix to POSTS to integrations api
* CXV1-6787 - Re-added new Twilio regions for Virginia and Oregon Interconnect
* CXV1-7123 - On Integrations page, added 3rd option for authentication method, 'no authentication'

## [4.9.1]
* CXV1-7157 - On Integrations, although it's not part of the work from this ticket fixed issue with default API URL for Zendesk not populating as part of the same PR used for the main portion of this work, that was done in config-shared.

## [4.9.0]
* CXV1-7081 - removed UI for agents to make changes to their extensions on the user profile page, also removed the roleId property from the extensions edit module in order to prevent a JS bug that was occuring when agents made changes to their extensions
* Update flow designer
* CXV1-6781 - Enabled generic REST integrations on Integrations page
* CXV1-6787 - Updated property on regions service to match change in config-shared as part of a ticket to add 2 new regions required for Twilio Interconnect

## [4.8.8]
* CXV1-6592 - Implement UI for Multiple Zendesk Integrations
* CXV1-6603 - Use flow-designer 3.0.3 for Multiple Zendesk Integrations

## [4.8.7]
* CXV1-3541 - Enabled assignment of message templates on users page

## [4.8.6]
* Hide API keys configuration menu item

## [4.8.5]
* CXV1-6694 - Fixed bug: Transfer Lists - Add New Category should be a button not a text line - update to logic around hiding button

## [4.8.4]
* CXV1-6694 - Fixed bug: Transfer Lists - Add New Category should be a button not a text line

## [4.8.3]
* Bumping flow designer

## [4.8.2]
* Bump soundwave for silent monitoring bugfix

## [4.8.1]
* Bumping flow designer

## [4.8.0]
* CXV1-6386 - Fixed bug: Recordings page, need to prevent start date from being set to after end date in search filter
* CXV1-5465 - Fixed bug: Tenant names in navbar not updating on edit
* CXV1-5469 - Fixed bug: Disabled reasons lists should not show when adding to a group
* CXV1-5029 - Fixed bug: Dispositions List shows error in Developer Tools
* CXV1-5605 - Fixed Firefox bug with dropdown menu appearing behind widgets
* CXV1-6543 - Fixed bug: Cannot change dispatch mapping - submit button stays greyed out
* Bumping flow designer
* CXV1-6514 - Updated tenant create/update to select from regions API.
* CXV1-5536 - Added new page for interactions in conversation
* CXV1-6516 - Update soundwave to enable barge-in

## [4.7.0]
* CXV1-6491 - Got recordings page and app dock to automatically refresh audio URL every 5 mins
* CXV1-6193 - On Transfer Lists page, moved "Warm" and "Cold" options from select menu to checkboxes, also made CSS fixes
* CXV1-6193 - Added UI for Transfer List on new Transfer list page, and also added ability to assign transfer lists from Users page

## [4.6.0]
* CXV1-5713 - Switch to token based auth
* CXV1-6336 - Re-enable SIP extension.
* CXV1-3541 - Message Templates (navbar link hidden by TEMPLATES feature flag)

## [4.5.3]
* CXV1-6355 - Fixed issue with messages from CxEngage breaking appDock

## [4.5.2]
* CXV1-6186 - Add Timezone conversion to AppDock

## [4.5.0]
* CXV1-6103 - Add email integration fields & UI

## [4.4.5]
* CXV1-4953 - Unflagged AppDock for further testing, but if it's not working, needs to be re-flagged

## [4.4.4]
* CXV1-5567 - Fixed link to help docs on Capacity Rules page

## [4.4.3]
* CXV1-4953 Reinstated the Recordings link in navbar since AppDock is not yet working and is flagged out

## [4.4.2]
* CXV1-6116 - Fixed issue with spinner not showing up on load of media page

## [4.4.1]
* CXV1-6116 - Put user-friendly media item names for media lists in table on media page
* CXV1-4953 - Feature-flagged AppDock due to reappearance of cross-domain issue

## [4.4.0]
* CXV1-6119 - Fixed media list add btn disabling issue
* CXV1-6120 - Fixed issue with Submit button not enabling on media lists
* CXV1-6027 - Enable drag-sorting for media list items
* CXV1-4953 - Created App Dock for interaction data from interactions table
* CXV1-6012 - Added dashboard categories so they can be grouped together in dropdown
* CXV1-6056 - Fixed date and time sorting on recordings.
* CXV1-6086 - Fix linking of custom dashboard statistic widgets to source switchers
* CXV1-6137 - Silent Monitoring undefined interaction id
* Update Realtime Dashboards to 4.4.5
* Update Config Shared to 1.3.16
* Updated styling of realtime report dropdown labels to be consistent (all light grey)

## [4.3.3]
* CXV1-6003 - Recrodings page search does not finish if there are zero Interactions

## [4.3.2]
* CXV1-5974 - Fix Recordings page
* Update Realtime Dashboards to 4.4.2
* Revert queue builder to v1 and hide API key management page

## [4.3.1]
* Update Realtime Dashboards to 4.4.1

## [4.3.0]
* Update Realtime Dashboards to 4.4.0
* CXV1-4815 - UI for new "media lists" media type, to be applied on both media and media collections pages
* CXV1-4426 - UI for View Only Platform Role (contains known issues, see ticket for more info)
* CXV1-5805 - Add tenant default property to Reason Lists
* Hotfixes for queue query builder. Version 1 and 2 queries should both display and be allowed to be copied. New queries and new versions (not copies) should produce Zermelo v2 queries. Copies will produce queries using the same version of Zermelo as the original.

## [4.2.2]
* Update Realtime Dashboards to 4.3.2 (Bug fixes)

## [4.2.1]
* Update Realtime Dashboards to 4.3.1 (Bug fixes)

## [4.2.0]
* Update Realtime Dashboards to 4.3.0 (New Available endpoint changes + Custom Gauge Widgets)
* Fixed bug with DNC List edit panels being dirty upon initially loading
* Only validate dispatch mappings as phone numbers on voice/sms

## [4.1.22]
* CXV1-5500 - Came to a resolution on this although QE disagrees, will leave it to Clint to decide
* CXV1-5446 - Removed modal confirmation pop up with incorrect text in it
* CXV1-5445 - Made DNC list fields editable
* Merging work from hotfix branch into master
* CXV1-2281 - Bug fix timezone should default to tenant's timezone
* CXV1-4859 - Bug fix for Campaign Settings tool tip
* CXV1-5396 - Typo fix for Dispatch Mapping
* CXV1-3993 - Reasons/Disposition Lists are not displayed very well in FireFox
* CXV1-4638 - Frontend for zendesk integrations
* CXV1-4469 - Fixed issue with wrong capacity rule being selected on users page
* CXV1-4859 - Add tooltips to Settings page controls
* CXV1-4912 - Enable multiple salesforce integrations
* CXV1-3596 - Reasons/Dispos bulk action fail messages
* Bumping flow designer

## [4.1.21]
* (no ticket) - Added back feature flag since Outbound is no longer the next release

## [4.1.20]
* CXV1-5278 - Provide feedback after campaign is altered notifying user that they must restart campaign
* CXV1-5081 - Bug fix bulkActions enable/disable makes flow name disappear
* CXV1-5190 - Bug fix for submit not being active on campaign settings
* CXV1-5184 - Date Selector should only allow future dates campaign settings
* CXV1-5172 - Bug fix campaign settings caller id now required
* CXV1-2275 - Fix invite page password issue bug
* CXV1-5125 - Removed default Twilio region from integrations page
* CXV1-4940 - Changed Twilio integration default region text in regions dropdown
* CXV1-5149 - Set Twilio region display names to match Tenant region display names
* CXV1-5127 - Made "Forced" toggle switch for Twilio region on Integrations page an optional field
* CXV1-4858 - Implemented new directive for uploading and downloading CSV's for the Outbound functionality
* CXV1-4903 - Rearrage campaign settings
* CXV1-4838 - Campaign expiry absolute date and time
* CXV1-4838 - Got campaign start/stop functionality working & re-introduced campaign stats in side panel
* (no specific ticket) - Updated config-shared to latest version w/campaign start/stop fix
* (no specific ticket) - Fixed incorrect campaign start/stop popup messaging
* CXV1-2273 - Bug with manually typing a date for business hrs exception rule
* CXV1-2516 - Default to show basic query on query builder
* CXV1-2553 - Fix display issues when new query versions are created
* CXV1-2514 - Fix issue with cancel message on query builder
* CXV1-5027 - Add queryVersion to new queue versions
* CXV1-5167 - Add default outbound integration to tenant settings
* CXV1-5162 - URL change needed for Silent Monitoring toolbar
* (no ticket) - Flag query builder to show v1 query builder for now
* CXV1-5072 - Quantifier support for capacity rule builder

## [4.1.19]
* CXV1-4805 - Fixed UI issues with campaign settings page schedule exceptions
* CXV1-4180 - Minor UI fixes

## [4.1.18]
NOTE: WILL NEED A FEATURE FLAG FOR TWILIO REGIONS TICKET (4179 and 4180) IF THIS GETS RELEASED BEFORE
TOOLBAR WORK IS COMPLETE
* CXV1-4179 and CXV1-4180 - Implemented Twilio Regions UI dropdown in users and integrations views
* CXV1-4415 - Campaign settings UI improvements
* CXV1-4676 - Campaign settings bug fix
* CXV1-3111 - Hide SIP extension
* CXV1-2803 - Bug fix for business hour exception page
* CXV1-3069 - Bug fix error message displaying before new user login
* CXV1-4732 - Add tooltips to disposition list editor
* CXV1-4415 - Fix Campaign left column and dispo mapping text
* CXV1-4758 - Fixed issue with disposition list ID on campaign settings page not saving
* CXV1-4102 - Add login URL to Salesforce Integration
* CXV1-2913 - Clear filter on recordings doesn't reset date
* CXV1-2088 - Update request for the popup tooltip in creating a new user
* CXV1-2274 - Invite acceptance page misaligned
* CXV1-2647 - Cannot manually change date on recordings page
* CXV1-870 - Queue query builder

## [4.1.17]
* CXV1-4390 - Got campaigns properly enabling and disabling

## [4.1.16]
* CXV1-4403 - Visual improvements to dispo/reasons list editor

## [4.1.15]
* CXV1-4394 - Made follow up fix to issue where campaign settings page was loading up w/blank expiry

## [4.1.14]
* CXV1-3589 - Initial addition of *feature-flagged* campaigns/outbound feature, still in development.
* CXV1-3027 - Update group management view for reason lists
* Bump config-shared to 1.2.4
* Bumping flow-designer version to 2.1.0-SNAPSHOT

## [4.1.13]
* CXV1-3922 - Other bugfixes reintroduced original bug. Fixed reason/disposition list anomalies with headers.

## [4.1.12]
* CXV1-3922 - Fix problem where dropdown was not populating on reason/dispo list after deleting a reason/dispo
* CXV1-3949 - Fix problem where inherited reason list cannot be disassociated from a user

## [4.1.11]
* Second attempt at CXV1-3997

## [4.1.10]
* CXV1-3922 - Fix problem where dropdown was not populating on reason/dispo list when creating lists

## [4.1.9]
* CXV1-3997 - Config UI - Hide inactive capacity rules in user management page

## [4.1.8]
* CXV1-3922 - Fix problem where dropdown was not populating on reason/dispo list when switching lists

## [4.1.7]
* CXV1-3426 - Contact point accepts any string for dispatch mappings
* CXV1-3965 - Capacity UI - Creating Group/Creating Capacity Rule Text
* CXV1-3964 - Config-ui - Remove Capacity Rule
* CXV1-3876 - Capacity UI - Creating New Rule Issue (part 2)
* CXV1-3175 - Custom Stat Editor view only mode
* Updated Realtime Dashboards to 4.0.1

## [4.1.6]
* CXV1-3922 - Fix reason/disposition list anomalies with headers
* CXV1-3889 - Fix query builder for queues
* CXV1-3892 - Reloading listeners on integration active update
* CXV1-3849 - Don't show disabled reason lists on user management page
* CXV1-3886 - Only show "disposition list is inherited" message on disposition lists that are actually inherited

## [4.1.5]
* Bumping flow-designer version to 2.0.6 (Hide inactive reasons / dispositions )

## [4.1.4]
* Finished CXV1-3838. Invalidate building capacity rules with invalid options
* CXV1-3876 Fixed display issue

## [4.1.3]
* CXV1-3847 - Can't enable/disable reason list (also disposition lists)
* CXV1-3848 - Don't allow System Presence Reasons to be assigned to specific users
* Feature flag to disable new queue query builder

## [4.1.2]
* CXV1-3854 - Added permission requirement to manage Capacity Rules
* CXV1-3825 - Config UI - Capacity Rules 'View' Button Not Working
* CXV1-3829 - Config UI - Capacity 'Cancel' Button Not Working
* CXV1-3835 - Capacity UI - No Alert on Rule Change
* CXV1-3837 - Capacity UI - High Capacity Digits Cut Off
* CXV1-3838 - Capacity Ui - Negative Numbers, Decimals, and the letter 'e'
* CXV1-3839 - Capacity UI - 'Group' Instead of 'Rule' Popup
* CXV1-3840 - Capacity UI - Group Actions for Enabled

## [4.1.1]
* Bumping flow-designer version to 2.0.5

## [4.1.0]
* Added management for Capacity Rules and Listeners

## [4.0.2]
* CXV1-3026 Add presence reasons to user management
* Bumping flow-designer version to 2.0.4

## [4.0.1]
* Update Liveops Text on login screens
* Update Realtime Dashboards to 4.0.0 (Includes Custom Realtime Dashboards and Custom Stats)

## [4.0.0]
* CXV1-1203 - Added annotations icon and removed an extraneous line break, should not affect any other code
* CXV1-2396 - Hide birst integration details from UI
* CXV1-2490 - Create view for presence reasons
* CXV1-2491 - Create view for presence reason lists
* CXV1-2492 - Create view for dispositions
* CXV1-2493 - Create view for disposition lists
* CXV1-1909 - Bugfix for making PSTN extension primary
* CXV1-1993 - Clean up edit panel/text alignment on tenant configuration view
* CXV1-2543 - re-enable Plivo
* CXV1-307 - Custom Stats Management
* CXV1-3182 - Unique Source Switchers
* Update Config-Shared to 1.1.1
* Update Flow Viewer controller
* Increased timeout allowance for historical provisioning
* Bumping flow-designer version to 2.0.2

## [3.1.10]
* Update realtime dashboards to 3.0.3
* Update realtime dashboards to 3.0.3-SNAPSHOT

## [3.1.9]
* Hotfix for password reset error messages
* Update realtime dashboards to 3.0.2
* Update flow designer to 1.9.4
* CXV1-1643 - 24/7 business hours bugfix
* CXV1-1819, CXV1-1909, CXV1-1911 - Extensions bugfix
* CXV1-1916 Realtime dashboards dropdown bug fix for Firefox

## [3.1.8]
* CXV1-1305 Added export image to assets/images folder
* CXV1-1819 Hide Plivo and made Twilio the default primary
* Update flow designer to 1.9.3

## [3.1.7]
* Updating agent-phone-panel to 1.14.7

## [3.1.6]
* Hotfix - rolling back some designer related changes for QE

## [3.1.5]
* CXV1-767 - Update help links throughout UI
* CXV1-803 - Admin initiated password reset
* CXV1-807 - Admin initiated password reset - bulk action
* TITAN2-8279 - Fix bug related to duplicate business hour exceptions
* Hotfix - remove SNAPSHOT dependency on flow designer

## [3.1.4]
* Updating agent-phone-panel to 1.14.6
* Bumping config-shared

## [3.1.3]
* CXV1-1446 - Fix bug with duplicate results for recordings search
* Update realtime-dashboards to 3.0.1 (Hyperion hotfix)
* Update recordings search endpoints (Hyperion hotfix)

## [3.1.2]
* Updating agent-phone-panel to 1.14.1

## [3.1.1](https://github.com/liveops/config-ui/compare/3.1.0...3.1.1)
* Improve the user experience when accessing historical-dashboards by adding load wheels and messages.

## [3.1.0]
* Add silent monitoring toolbar
* Updating agent-phone-panel to 1.13.8

## [3.0.0]
* CXV1-206 Add Plivo as another possible integration type
* Updating realtime-dashboards to 3.0.0

## [2.0.26]
* Rollback realtime-dashboards to 2.4.7 (backwards compatibility issues - 2.4.8 will require config-ui to update minor version to 2.1.0)

## [2.0.25]
* TITAN2-5018 Fix recordings search filters and state change errors

## [2.0.24]
* TITAN2-5018 Fix timezone issue with recordings search

## [2.0.23]
* TITAN2-5018 Improve recordings UX

## [2.0.22]
* Updating realtime-dashboards to 2.4.8

## [2.0.21]
* TITAN2-5018 View list of recordings and playback
* TITAN2-8731 Show better error message when tenant fails to save
* CXV1-572 passing platform flow ID to Flow designer

## [2.0.20]
* Updating flow-designer to 1.9.1

## [2.0.19]
* Fix bug preventing dropdown menus from dismissing on historical dashboard
* Fix font issues on OS X
* Recordings search has been fixed, feature is still disabled in this version
* Disable silent monitoring features
* Improve error messages on flow designer
* Update LiveOps logo to CxEngage logo

## [2.0.18]
* Fix gulp serve tasks for local development
* Remove CSS focus-ring from table cells.
* added gear image asset
* Updating the designer
* Update API URL according to environment for soundwave
* Update soundwave to 1.12.14

## [2.0.17]
* Updated bower.json to resolve bower component dependency conflicts resulting from bringing in agent toolbar
* Update soundwave to 1.12.12

## [2.0.16]
* Update soundwave to 1.12.5

## [2.0.15]
* Add silent monitoring controls to loResourceTable
* Update soundwave to 1.12.3
* Update realtime-dashboards to 2.4.6

## [2.0.14]
- Quick fix for hiding recordings tab

## [2.0.13]
- Updating Config-Shared to 1.0.54
- Updating for JSEDN fixes
- Updating Designer to 1.8.4

## [2.0.12]
- Updating designer to 1.8.3 [TITAN2-8725 TITAN2-8421]
- Updating realtime-dashboards to 2.4.5

## [2.0.11] - 2016-03-09
* Added help menu for API, Reporting and general documentation.
* Update version of realtime dashboards to 2.4.4

## [2.0.10] - 2016-03-02
* Updating version of flow designer [TITAN2-6225]
* Updating version of realtime dashboards to 2.4.3
* Updating flow designer and view controllers to handle new grouping
* Added C3 imports for dashboard visualizations
* Check for freezeState property on resource tables to disable clicking on Realtime Dashboard tables

## [2.0.9]
* Hotfix for table filter
* Hotfix for /users not returning $resource objects
* Import config-shared 1.0.53

## [2.0.8]
* Fixed multiple bugs with business hour exception form
* Updated realtime-dashboards to 2.4.2-SNAPSHOT, see that repo for update notes
* Updated flow-designer to 1.6.4 which includes updated flow-library and includes activity defaults
* Updated accepted permissions to show create tenant button (Tenant Admin now able to create child tenants)
* Show user friendly names for states and entities, remove dead code

## [2.0.7]
* (Applying kirbys fix) link realtime straight to overview dashboard
* Updated scss to float queue selector dropdowns to float left instead of right
* Re-added Historical Dashboards page, added birst iframe

## [2.0.6] - 2016-02-17
* Update import of realtime dashboards to latest (2.4.1)

## [2.0.5] - 2016-02-17
* Updated CSS of tables on dashboards to be a bit more pleasing to the eyes
* Added confirm password functionality to invitation flow.
* Updated Flow Designer to include various fixes and minimap for editor

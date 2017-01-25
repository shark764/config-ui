# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
* Version bump to 4.10.1-SNAPSHOT and fixed linting errors
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

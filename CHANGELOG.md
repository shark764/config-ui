# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
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
* Update Realtime Dashboards to 4.0.0 (Includes Custom Realtime Dashboards and Custom Stats)
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

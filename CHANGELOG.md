# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 336
- Update import of flow designer to v1.5.0-SNAPSHOT3. Designer changes for TITAN2-4976 Flow Notations - Check Business Hours

## 331
- Update import of flow designer to v1.5.0-SNAPSHOT2. Should fix TITAN2-6290

## 330
##### Flow designer
- Update import of flow designer to v1.4.1. Should fix TITAN2-7417 and TITAN2-6978
##### Realtime Dashboards
- Added a title header to all dashboards
- Added a quick dashboard switcher dropdown - fixes TITAN2-7134
- Fixed typo in interaction holds count DSL query - fixes TITAN2-7190
##### General
- Switching tenants in the navbar now does different (non-breaking) things based on your current context - fixes TITAN2-7180
-

**Config-UI**
Update E2E tests
Unit test coverage
Cleanup and code documentation

TITAN2-4716 Add dropdowns for text-to-speech media and language types
TITAN2-6691 Fix tenant bulk actions
TITAN2-6694 Fix loading spinner stuck showing when cancellng navigation
TITAN2-6510 Fix logo border in IE10
TITAN2-6135 Save changes automatically after toggling active/enabled
TITAN2-6793 IE10 and IE11 display fixes
TITAN2-6790 Fix user status bulk action sending true/false instead of accepted/disabled
TITAN2-6588 Remove functionality which closes side panel when resource doesn't meet search criteria
TITAN2-6587 Fix user profile "no skills" message alignment
TITAN2-6645 Fix user management 'invite now' becoming deselected when clicking 'Create' button twice
TITAN2-6679 Display errors from API for user extensions
TITAN2-6618 Remove scroll table from skills and groups members table
TITAN2-6534 Use new custom time picker directive for business hours
TITAN2-6929 Fix business hours form reset
TITAN2-7083 TITAN2-7000 Add better handling of errors on user groups and user skills
TITAN2-5018 Recordings management
TITAN2-6453 Fix disable/hide logic for invited user info
TITAN2-7183 Fix generic list name/description when list is owned by current tenant
TITAN2-6530 Fix management table size for no elements
TITAN2-6697 Allow flow active version to be optional if there aren't any published flow versions
TITAN2-6698 Add ability to edit user extensions
TITAN2-6886 Fix bulk action select boxes in IE10

**Config-shared**
Cleanup and code documentation

TITAN2-6793 IE10 and IE11 display fixes
TITAN2-4249 Add API error response interceptor
TITAN2-6534 Add custom time picker directive
TITAN2-6546 Remove 'All Users' filter in query editor
TITAN2-7083 TITAN2-7000 Improve lo-submit error handling
Fix typeAhead to dirty ngModel on select
TITAN2-5018 Recordings resources
TITAN2-6697 Allow flow active version to be optional


## 318
##### Realtime Dashboards
- Update import of realtime dashboards to v2.1.2

## 317
##### All Modules
- Constrained Helvetica font to not be global

## 315
##### Realtime Dashboards
- Updated realtime dashboards version import

## 311
##### Realtime Dashboards
- Re-wrote all 4 dashboards in new DSL

## 309
##### Realtime Dashboards
- Fixed numerous realtime dashboards UI bugs such as typos, inconsistent text, and wrong stats being queried. Removed the 'this dashboard refreshes every 15s' disclaimer.

## 301
##### Realtime Dashboards
- finalized all 4 dashboards and added/removed stats as needed based on feedback

## 294
##### Realtime Dashboards
- fixed current resource statistics on overview dashboard (ui bug in query builder)

## 291
##### Realtime Dashboards
- added back in resource dashboard
- updated DSL to add support for gauge start and gauge end for resources gauges

## 287
##### Realtime Dashboards
- made disclaimer more subtle and at the bottom of the screen
- on the main dashboard, replaced wrap-up-duration w/ avg time-to-answer
- made all statistic boxes the same size, and adjusted positions slightly to accommodate box size changes

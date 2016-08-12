'use strict';

angular.module('liveopsConfigPanel')
  .controller('campaignSettingsController', [
    '$scope', '$rootScope', '$state', '$stateParams', '$translate', '$moment', '$q', '$document', '$compile', '$timeout', 'Session', 'Flow', 'Timezone', 'Campaign', 'CampaignVersion', 'Disposition', 'DispositionList', 'DirtyForms', 'loEvents', 'getCampaignId', 'DncLists', 'campaignChannelTypes',
    function ($scope, $rootScope, $state, $stateParams, $translate, $moment, $q, $document, $compile, $timeout, Session, Flow, Timezone, Campaign, CampaignVersion, Disposition, DispositionList, DirtyForms, loEvents, getCampaignId, DncLists, campaignChannelTypes) {
      $scope.forms = {};
      $scope.showDispoDNC = false;
      // adding to the scope all of the data from the campaigns page
      var csc = this;
      csc.loading = true;
      csc.expiryUnit = 'hr';
      csc.campaignSettings = Campaign.get({
        tenantId: Session.tenant.tenantId,
        id: getCampaignId
      });

      csc.campaignChannels = campaignChannelTypes;

      var dayMap = {
        'sunday': 'SU',
        'monday': 'M',
        'tuesday': 'T',
        'wednesday': 'W',
        'thursday': 'TH',
        'friday': 'F',
        'saturday': 'S'
      };

      function initHours() {
        // we don't add the leading zeroes to hours yet, since we have to do math with those numbers for AM/PM conversions
        csc.hours = [];
        csc.minutes = [];

        for (var i = 1; i < 13; i++) {
          csc.hours.push(i);
        }

        for (i = 0; i < 60; i++) {
          csc.minutes.push(addLeadingZeros(i));
        }
      }

      function convertTimestampToFormVal(timestamp) {
        if (angular.isDefined(timestamp)) {
          return parseInt(timestamp.split(':').shift());
        } else {
          return 0;
        }
      }

      function convertDefaultExpiryToFormValue(settings) {
        var verifiedDefaultExpiry = checkConditionals(settings.defaultLeadExpiration);
        settings.defaultLeadExpiration = convertTimestampToFormVal(verifiedDefaultExpiry);
        if (settings.defaultLeadExpiration % 24 === 0) {
          csc.leadExpiry = settings.defaultLeadExpiration / 24;
          csc.expiryUnit = 'day';
        } else {
          csc.leadExpiry = settings.defaultLeadExpiration;
          csc.expiryUnit = 'hr';
        }
      }

      function addLeadingZeros(num) {
        if (num < 10) {
          return '0' + num;
        } else {
          return num;
        }
      }

      function convertToTimestamp(time) {
        var hours;

        //make sure that the value we're getting is a number using Lodash's _.isFinite()
        if (_.isFinite(time)) {
          if (time > 0) {
            hours = addLeadingZeros(time);
          } else {
            hours = '00'
          }
        } else {
          // if it's not a number, make it one
          var toNum = parseInt(time);
          // if it's still not a number, force the value to be '00'
          if (!_.isFinite(toNum)) {
            hours = '00';
          } else {
            // since the parseInt() worked, add the leading zeros if necessary
            hours = addLeadingZeros(toNum);
          }
        }

        return hours + ':00:00';
      }

      function convertExpiryToTimestamp() {
        if (angular.isDefined(csc.leadExpiry)) {
          if (csc.expiryUnit === 'day') {
            csc.versionSettings.defaultLeadExpiration = csc.leadExpiry * 24;
          }
          csc.versionSettings.defaultLeadExpiration = convertToTimestamp(csc.leadExpiry);
        }
      }

      function generateSchedule() {
        csc.versionSettings.schedule = [];

        for (var day in dayMap) {
          if (csc[day + 'Selected']) {
            csc.versionSettings.schedule.push({
              startTime: convertToMilitaryHours(csc.scheduleStartHour, 'schedule', 'Start') + ':' + csc.scheduleStartMinutes + ':00',
              endTime: convertToMilitaryHours(csc.scheduleEndHour, 'schedule', 'End') + ':' + csc.scheduleEndMinutes + ':00',
              day: dayMap[day],
              blackOut: false
            });
          }
        }

        if(!csc.versionSettings.schedule.length){
          csc.noDaysChecked = true;
        } else {
          csc.noDaysChecked = false;
        }

        // TODO: push exception hours as well
        if (angular.isDefined(csc.exceptions)) {
          csc.exceptions.forEach(function (exception) {
            csc.versionSettings.schedule.push(exception);
          });
        }
      }

      function parseSchedule() {
        // TODO: This assumes that the schedule item at index 0 is the "actual schedule" and everything else is an exception.
        // This needs to be reconsidered....for now we should find the first item that has a "day" property and use that as the schedule.
        // In the future, since the "actual schedule" is made up of multiple schedule items, with potentially different start/end times,
        // this will need to be completely reworked.
        if (angular.isDefined(csc.versionSettings.schedule[0])) {
          csc.scheduleStartHour = parseInt(csc.versionSettings.schedule[0].startTime.slice(0, 2));
          csc.scheduleEndHour = parseInt(csc.versionSettings.schedule[0].endTime.slice(0, 2));
          csc.scheduleStartMinutes = addLeadingZeros(parseInt(csc.versionSettings.schedule[0].startTime.slice(3, 5)));
          csc.scheduleEndMinutes = addLeadingZeros(parseInt(csc.versionSettings.schedule[0].endTime.slice(3, 5)));

          setHours();
        }

        csc.exceptions = []

        var invertedDayMap = _.invert(dayMap);
        csc.versionSettings.schedule.forEach(function (scheduleItem) {
          if (angular.isDefined(scheduleItem.day)) {
            csc[invertedDayMap[scheduleItem.day] + 'Selected'] = true;
          } else {
            csc.exceptions.push(scheduleItem);
          }
        });
      }

      function checkConditionals(value, min) {
        if (!value || value === 0) {
          return min || 0;
        } else {
          return value;
        }
      }

      function setHours() {
        // TODO: Optimize or simplify
        var startHour = csc.scheduleStartHour,
          startAmPm = csc.scheduleStartAmPm,
          endHour = csc.scheduleEndHour,
          endAmPm = csc.scheduleEndAmPm;

        loadStartTimePickerData.call(csc, startHour, startAmPm);
        loadEndTimePickerData.call(csc, endHour, endAmPm);

        csc.scheduleStartHour = csc.startHour;
        csc.scheduleStartAmPm = csc.startAmPm;
        csc.scheduleEndHour = csc.endHour;
        csc.scheduleEndAmPm = csc.endAmPm;
      }

      function loadStartTimePickerData(startHour) {
        if (startHour > 12) {
          this.startHour = startHour - 12;
          this.startAmPm = 'pm';
        } else if (startHour < 12) {
          this.startHour = startHour;
          this.startAmPm = 'am';
          if (startHour === 0) {
            this.startHour = 12;
            this.startAmPm = 'am';
          }
        } else if (startHour === 12) {
          this.startHour = startHour;
          this.startAmPm = 'pm';
        } else {
          this.startHour = 12;
          this.startAmPm = 'am';
        }
      }

      function loadEndTimePickerData(endHour) {
        if (endHour > 12) {
          this.endHour = endHour - 12;
          this.endAmPm = 'pm';
        } else if (endHour < 12) {
          this.endHour = endHour;
          this.endAmPm = 'am';
          if (endHour === 0) {
            this.endHour = 12;
            this.endAmPm = 'am';
          }
        } else if (endHour === 12) {
          this.endHour = endHour;
          this.endAmPm = 'pm';
        } else {
          this.endHour = 12;
          this.endAmPm = 'am';
        }
      }

      function convertToMilitaryHours(hours, scheduleOrException, startOrEnd) {
        // handle edge cases for noon and midnight first
        if (hours === 12) {
          if (csc[scheduleOrException + startOrEnd + 'AmPm'] === 'am') {
            return '00';
          } else {
            return '12';
          }
        }

        if (csc[scheduleOrException + startOrEnd + 'AmPm'] === 'pm') {
          return addLeadingZeros(hours + 12);
        }
        return addLeadingZeros(hours);
      }

      csc.campaignSettings.$promise.then(function (response) {
        if (response.latestVersion) {
          CampaignVersion.cachedGet({
            campaignId: response.id,
            tenantId: Session.tenant.tenantId,
            versionId: response.latestVersion
          }).$promise.then(function (campVersion) {
            csc.versionSettings = campVersion;
            convertDefaultExpiryToFormValue(csc.versionSettings);
            csc.versionSettings.defaultLeadRetryInterval = convertTimestampToFormVal(csc.versionSettings.defaultLeadRetryInterval);
            parseSchedule();

            csc.versionSettings.defaultLeadRetryInterval = checkConditionals(csc.versionSettings.defaultLeadRetryInterval);
            csc.versionSettings.defaultMaxRetries = checkConditionals(csc.versionSettings.defaultMaxRetries, 1);
            csc.loading = false;
          });
        } else {
          csc.versionSettings = new CampaignVersion({
            tenantId: Session.tenant.tenantId
          });

          csc.scheduleStartAmPm = 'am';
          csc.scheduleEndAmPm = 'pm';
          csc.loading = false;
          csc.leadExpiry = 0;
          csc.versionSettings.defaultLeadRetryInterval = 0;
          csc.versionSettings.defaultMaxRetries = 1;
        }

        csc.fetchDispositionList();
        csc.loadTimezones();
        csc.fetchFlows();
        csc.fetchDNCList();
        initHours();
      });

      // TODO: Centralize this
      csc.fetchFlows = function () {
        csc.flows = Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        csc.flows.$promise.then(function () {
          _.remove(csc.flows, function (flow) {
            return flow.tenantId !== Session.tenant.tenantId;
          });
        });
      };

      csc.fetchDispositions = function () {
        var dispositions = Disposition.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
        return dispositions;
      };

      csc.currentDispositionName = [];

      csc.fetchDispositionList = function () {

        DispositionList.cachedQuery({
          tenantId: Session.tenant.tenantId
        }).$promise.then(function (lists) {
          csc.dispositionLists = lists.filter(function (list) {
            return list.active;
          });
        });
      };

      csc.loadTimezones = function () {
        csc.timezones = Timezone.query();
      };

      csc.cancel = function () {
        $state.go('content.configuration.campaigns');
      };

      csc.fetchDNCList = function () {
        csc.dncLists = DncLists.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        csc.dncLists.$promise.then(function () {

          // if there is anything in the dnc array, then generate a list of selected
          // dnc lists to use for the dnc selection dropdown
          if (angular.isDefined(csc.versionSettings.doNotContactLists)) {
            csc.selectedLists = _.filter(csc.dncLists, function (val, key) {
              return csc.versionSettings.doNotContactLists.indexOf(val.id) !== -1;
            });
          } else {
            // otherwise, set the selected and saved dnc lists to be empty
            csc.selectedLists = [];
            csc.versionSettings.doNotContactLists = [];
          };
        });
      };

      function validateSchedule (currentForm) {
        // If any fields haven't been filled out, don't validate, they will get "required" error messages.
        if (currentForm.startHour.$error.required || currentForm.startMinutes.$error.required || currentForm.startAmPm.$error.required || currentForm.endHour.$error.required || currentForm.endMinutes.$error.required || currentForm.endAmPm.$error.required) {
            return;
        }

        startEndIsInvalid(form);
      }

      csc.changeDispoMap = function (value, name, index) {
        if (value === 'dnc') {
          $scope.showDispoDNC = true;
        } else {
          $scope.showDispoDNC = false;
        }

        csc.selectedDncName = name;
        csc.dncIndex = index;
      };

      csc.gotoDispoMap = function (dispoId) {
        var newScope = $scope.$new();
        newScope.dispoLoading = true;

        DispositionList.get({
          tenantId: Session.tenant.tenantId,
          id: dispoId
        }).$promise.then(function (currentList) {
          csc.currentDispositionList = currentList.dispositions.sort(function (a, b) {
            return a.sortOrder - b.sortOrder;
          });
          var categoriesAdded = [];
          var dispositionListCopy = csc.currentDispositionList.slice(0);

          // add hierarchy headers
          dispositionListCopy.forEach(function (disposition, index) {
            if (angular.isDefined(disposition.hierarchy)) {
              disposition.hierarchy.forEach(function (category) {
                if (categoriesAdded.indexOf(category) === -1) {
                  csc.currentDispositionList.splice(index + categoriesAdded.length, 0, {
                    name: category,
                    type: 'category'
                  });
                  categoriesAdded.push(category);
                }
              });
            }
          });

          parseDispositionMap();

          newScope.dispoLoading = false;
        });

        newScope.modalBody = 'app/components/configuration/campaigns/settings/dispoMapping.modal.html';
        newScope.title = 'Disposition Mapping';

        newScope.cancelCallback = function () {
          $scope.showDispoDNC = false;
          $document.find('modal').remove();
        };

        newScope.submitDispositionMapping = function () {
          csc.versionSettings.dispositionMappings = {};
          var mapsModel = csc.dispositionMappingList;
          var mapsAPI = csc.versionSettings.dispositionMappings;
          var list = csc.currentDispositionList;

          for (var i = 0; i < list.length; i++) {
            if (angular.isDefined(list[i].type) || mapsModel[i].action === 'success') {
              continue;
            }
            if (mapsModel[i].action === 'retry') {
              mapsAPI[list[i].dispositionId] = {
                action: 'retry',
                interval: convertToTimestamp(csc.versionSettings.defaultLeadRetryInterval)
              };
            } else {
              mapsAPI[list[i].dispositionId] = {
                action: 'dnc',
                listIds: csc.dispositionMappingList[i].listIds
              };
            }
          }

          $document.find('modal').remove();
        };
        $scope.$emit('childFormChange');

        var element = $compile('<modal></modal>')(newScope);
        $document.find('html > body').append(element);
      };

      csc.enableDisableDncAddBtn = function (selectedList) {
        if (!selectedList) {
          return true;
        } else {
          return false;
        }
      }

      function parseDispositionMap() {
        csc.dispositionMappingList = [];
        var dispoList = csc.currentDispositionList;
        var dispoMap = csc.versionSettings.dispositionMappings || [];
        dispoList.forEach(function (disposition) {
          if (angular.isDefined(disposition.type)) {
            csc.dispositionMappingList.push({});
          } else if (angular.isDefined(dispoMap[disposition.dispositionId])) {
            if (dispoMap[disposition.dispositionId].action === 'retry') {
              csc.dispositionMappingList.push({
                action: 'retry'
              });
            } else {
              csc.dispositionMappingList.push({
                action: 'dnc',
                listIds: dispoMap[disposition.dispositionId].listIds
              });
            }
          } else {
            csc.dispositionMappingList.push({
              action: 'success'
            });
          }
        });
      }

      csc.cancelDispoDnc = function () {
        if (angular.isUndefined(csc.dispositionMappingList[csc.dncIndex].listIds)) {
          csc.dispositionMappingList[csc.dncIndex].action = 'success';
        }
        $scope.showDispoDNC = false;
      };

      csc.submitDispoDnc = function () {
        csc.dispositionMappingList[csc.dncIndex].listIds = [];
        csc.selectedLists.forEach(function (dncList) {
          if (angular.isDefined(dncList.checked) && dncList.checked === true) {
            csc.dispositionMappingList[csc.dncIndex].listIds.push(dncList.id);
          }
        });

        $scope.showDispoDNC = false;
      };

      $scope.$on('childFormChange', function () {
        $scope.forms.settingsForm.$setDirty();
      });

      csc.isChecked = function (dncListId) {
        if (angular.isDefined(csc.dispositionMappingList[csc.dncIndex].listIds)) {
          if (csc.dispositionMappingList[csc.dncIndex].listIds.indexOf(dncListId) !== -1) {
            return true;
          }
        }
        return false;
      };

      csc.addDNC = function (newDncListId) {
        // first find the index of this new DNC list id
        var indexOfListToRemove = _.findIndex(csc.dncLists, {
            id: newDncListId
          })
          // now that we've got the index, add it to the selected DNC lists
        var addedDncObj = csc.dncLists[indexOfListToRemove];
        csc.selectedLists.push(addedDncObj);
        // using that same index, remove it from the list of ALL DNC lists
        csc.dncLists.splice(indexOfListToRemove, 1);
        csc.selectedLists = _.sortBy(csc.selectedLists, 'name');
        csc.selectedDncList = '';
      };

      csc.removeDNC = function ($index) {
        // first add this back to the list of all DNC lists
        csc.dncLists.push(csc.selectedLists[$index]);
        // now remove it the list of selected DNC lists
        csc.selectedLists.splice($index, 1);
        csc.selectedLists = _.sortBy(csc.selectedLists, 'name');
        csc.selectedDncList = '';
      };

      csc.getIds = function (list) {
        return _.map(list, 'id')
      };

      csc.addHoursException = function (currentForm) {
        var DATE_STRING_LENGTH = 10;

        if (!csc.exceptions) {
          csc.exceptions = [];
        }

        currentForm.date.$setTouched();
        currentForm.startHour.$setTouched();
        currentForm.startMinutes.$setTouched();
        currentForm.startAmPm.$setTouched();
        currentForm.endHour.$setTouched();
        currentForm.endMinutes.$setTouched();
        currentForm.endAmPm.$setTouched();

        if (angular.isUndefined(csc.newExceptionHour) || angular.isUndefined(csc.newExceptionHour.date) || csc.newExceptionHour.date.length !== DATE_STRING_LENGTH) {
          $scope.exceptionsDateError = $translate.instant('campaigns.details.settings.date.invalid');
          currentForm.date.$setValidity("date", false);
        } else {
          $scope.exceptionsDateError = undefined;
          currentForm.date.$setValidity("date", true);
        }

        if (csc.newExceptionHour && !csc.newExceptionHour.allDay) {
          csc.validateTimeAndDate(currentForm, 'true');
        }

        if (csc.exceptionTimeIsInvalid || !currentForm.date.$valid) {
          return;
        }

        var exception = {
          blackout: true,
          date: csc.newExceptionHour.date
        };

        if (csc.newExceptionHour.allDay) {
          exception.startTime = "00:00:00";
          exception.endTime = "23:59:59";
        } else {
          if (angular.isUndefined(csc.newExceptionHour.startHour) || angular.isUndefined(csc.newExceptionHour.startMinutes) || angular.isUndefined(csc.newExceptionHour.endHour) || angular.isUndefined(csc.newExceptionHour.endMinutes)) {
            return;
          }
          exception.startTime = convertToMilitaryHours(csc.newExceptionHour.startHour, 'exception', 'Start') + ':' + csc.newExceptionHour.startMinutes + ':00';
          exception.endTime = convertToMilitaryHours(csc.newExceptionHour.endHour, 'exception', 'End') + ':' + csc.newExceptionHour.endMinutes + ':00';
        }

        csc.exceptions.push(exception);
        $scope.forms.settingsForm.$setDirty();
      };


      function startEndIsInvalid (form, schedExep) {
        var scheduleOrException = schedExep ? 'exception' : 'schedule';

        // Ensure that start time is earlier than end time
        var startHour = parseInt(convertToMilitaryHours(form.startHour.$modelValue, scheduleOrException, 'Start'));
        var endHour = parseInt(convertToMilitaryHours(form.endHour.$modelValue, scheduleOrException, 'End'));


        if (startHour > endHour) {
          return true;
        }
        if (startHour < endHour) {
          return false;
        }

        // startHour === endHour, so check minutes
        var startMinutes = parseInt(form.startMinutes.$modelValue);
        var endMinutes = parseInt(form.endMinutes.$modelValue);

        if (startMinutes >= endMinutes) {
          return true;
        }
      }

      function timeFieldsInvalid (currentForm) {
        if (currentForm.startHour.$error.required || currentForm.startMinutes.$error.required || currentForm.startAmPm.$error.required || currentForm.endHour.$error.required || currentForm.endMinutes.$error.required || currentForm.endAmPm.$error.required) {
            return true;
        }
        return false;
      }

      csc.validateTimeAndDate = function (currentForm, isException) {
        csc.exceptionTimeIsInvalid = false;
        csc.scheduleTimeIsInvalid = false;

        // If any fields haven't been filled out, don't validate, they will get "required" error messages.
        if (timeFieldsInvalid(currentForm)) {
          return;
        }

        if (isException) {
          csc.exceptionTimeIsInvalid = startEndIsInvalid(currentForm, 'true');
        } else {
          if (startEndIsInvalid(currentForm)) {
            csc.scheduleTimeIsInvalid = startEndIsInvalid(currentForm);
          }
        }
      }

      csc.removeException = function (index) {
        csc.exceptions.splice(index, 1);
        $scope.forms.settingsForm.$setDirty();
      };

      csc.submit = function () {
        convertExpiryToTimestamp();

        csc.versionSettings.defaultLeadRetryInterval = convertToTimestamp(csc.versionSettings.defaultLeadRetryInterval);
        generateSchedule();

        if (csc.noDaysChecked) {
          return;
        }

        // Deleting id and created so that we can force the API to create a new version,
        // since versions are not to be editable
        delete csc.versionSettings.id;
        delete csc.versionSettings.created;

        if (angular.isUndefined(csc.versionSettings.dispositionMappings)) {
          csc.versionSettings.dispositionMappings = {};
        }

        csc.versionSettings.doNotContactLists = _.map(csc.selectedLists, 'id');
        csc.versionSettings.save({
          tenantId: Session.tenant.tenantId,
          campaignId: getCampaignId
        }).then(function (response) {
          $state.go('content.configuration.campaigns');
        });
      };
    }
  ]);

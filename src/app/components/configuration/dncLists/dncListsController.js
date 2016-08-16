'use strict';

angular.module('liveopsConfigPanel')
  .controller('dncListsController', ['$scope', '$state', '$timeout', '$translate', 'Session', 'apiHostname', 'DncLists', 'Upload', '$q', '$moment', 'loEvents', 'Alert', 'dncListsTableConfig',
    function ($scope, $state, $timeout, $translate, Session, apiHostname, DncLists, Upload, $q, $moment, loEvents, Alert, dncListsTableConfig) {
      var dnc = this,
        DncListService = new DncLists();

      $scope.forms = {};

      function convertDateToMySqlFormat(date) {
        var convertedDate = date;
        if (date) {
          var newDate = new Date(date);
          var tomorrow = $moment(newDate).add(1, 'days')._d;
          convertedDate = $moment(tomorrow).format('YYYY-MM-DD') + ' 00:00:00';
        }

        return convertedDate;

      }

      function convertDateFromMySqlFormat(date) {
        if (date !== null) {
          if (date) {
            var indivDate = date;
            return indivDate.substr(0, 10);
          }
        } else {
          return '';
        }
      }

      function uploadListFile(fileObj) {
        if (angular.isDefined(fileObj)) {
          dnc.selectedDncList.expiration = convertDateFromMySqlFormat(dnc.selectedDncList.expiration);

          var upload = Upload.upload({
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/dnclists/' + dnc.selectedDncList.id + '/upload',
            method: 'POST',
            file: fileObj
          });

          return upload;
        }
      }


      dnc.updateActive = function () {
        var dncListcopy = new DncLists({
          id: dnc.selectedDncList.id,
          tenantId: Session.tenant.tenantId,
          active: !dnc.selectedDncList.active,
          name: dnc.selectedDncList.name,
          description: dnc.selectedDncList.description
        });

        return dncListcopy.save().then(function(result){
          dnc.selectedDncList.$original.active = result.active;
        });
      };

      dnc.dncLists = DncLists.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      dnc.onListFileSelect = function (fileData) {
        delete dnc.selectedDncList.listFileUpload;
        dnc.selectedDncList.listFileUpload = fileData;
        $scope.forms.detailsForm.$setDirty();
      };

      dnc.downloadDncList = function (dncListId) {
        DncListService.download(dncListId, Session);
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        dnc.selectedDncList = null;
        dnc.selectedDncList = new DncLists({
          tenantId: Session.tenant.tenantId,
          active: true,
          expiration: null
        });
      });

      $scope.$on(loEvents.bulkActions.close, function () {
        dnc.forceClose = true;
      });

      $scope.$watch('dnc.selectedDncList', function () {
        if (dnc.selectedDncList) {
          dnc.selectedDncList.listFileUpload = null;
          dnc.selectedDncList.expiration = convertDateFromMySqlFormat(dnc.selectedDncList.expiration);
        }
      });

      dnc.submit = function () {
        var listFileData = dnc.selectedDncList.listFileUpload;
        if (!dnc.selectedDncList.expiration) {
          delete dnc.selectedDncList.expiration;
        } else {
          dnc.selectedDncList.expiration = convertDateToMySqlFormat(dnc.selectedDncList.expiration);
        }

        if (!angular.isDefined(dnc.selectedDncList.id)) {
          return dnc.selectedDncList.save({
            tenantId: Session.tenant.tenantId
          }, function (response) {
            dnc.dncLists.push(response);
            Alert.success($translate.instant('value.saveSuccess'));
            dnc.duplicateError = false;
          }, function (err) {
            Alert.error($translate.instant('value.saveFail'));
            if (err.data.error.attribute.name) {
              dnc.duplicateError = true;
              dnc.duplicateErrorMessage = err.data.error.attribute.name.capitalize();
            }
          }).
          then(function () {
            uploadListFile(listFileData);
          });
        } else {
          uploadListFile(listFileData);
        }
      };

      // individual list not being used at this time,
      // keeping this route change function in for the future
      dnc.manageList = function (currentlySelectedList) {
        $state.go('content.configuration.dncEdit', {
          id: JSON.stringify(currentlySelectedList)
        });
      };

      //Init date to tomorrow
      // TODO: this should be globalized somehow, as it is used in the other dnc list controller
      function provideDateTomorrow() {
        var newLocalDate = new Date();
        var newUTCDate = $moment.utc([
          newLocalDate.getFullYear(), newLocalDate.getMonth(), newLocalDate.getDate()
        ]).add('2', 'days');
        var today = new Date(newUTCDate);
        return $moment(today).format('YYYY-MM-DD');
      }

      dnc.provideDateTomorrow = provideDateTomorrow();
      dnc.tableConfig = dncListsTableConfig;
    }
  ]);

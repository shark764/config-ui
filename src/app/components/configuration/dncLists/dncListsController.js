'use strict';

angular.module('liveopsConfigPanel')
  .controller('dncListsController', ['$scope', '$state', '$timeout', '$translate',  'Session', 'apiHostname', 'DncLists', 'Upload', '$q', '$moment', 'loEvents', 'Alert', 'dncListsTableConfig',
    function ($scope, $state, $timeout, $translate, Session, apiHostname, DncLists, Upload, $q, $moment, loEvents, Alert, dncListsTableConfig) {
      var dnc = this,
          DncListService = new DncLists();

      $scope.forms = {};

      function convertDateToMySqlFormat(date) {
        var newDate = new Date(date);
        var tomorrow = $moment(newDate).add(1, 'days')._d;
        return $moment(tomorrow).format('YYYY-MM-DD') + ' 00:00:00';
      }

      function convertDateFromMySqlFormat(date) {
        if (date.expiration) {
          var indivDate = date.expiration;
          date.expiration = indivDate.substr(0,10);
        }
      }

      function uploadListFile(fileObj) {
        if (angular.isDefined(fileObj)) {
          var upload = Upload.upload({
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/dnclists/' + dnc.selectedDncList.id + '/upload',
            method: 'POST',
            file: fileObj
          });

          upload.then(function (response) {
            // TBD
          });
        }
      }

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

      $scope.$watch('dnc.selectedDncList', function (currentlySelectedList) {
        if (currentlySelectedList) {
          dnc.selectedDncList.listFileUpload = null;
          convertDateFromMySqlFormat(currentlySelectedList);
        }
      });

      dnc.submit = function () {
        var listFileData = dnc.selectedDncList.listFileUpload;
        dnc.selectedDncList.expiration = convertDateToMySqlFormat(dnc.selectedDncList.expiration);
        console.log('submitted dnc.selectedDncList', dnc.selectedDncList);
        if (!angular.isDefined(dnc.selectedDncList.id)) {
          return dnc.selectedDncList.save({
            tenantId: Session.tenant.tenantId
          }, function(response) {
            dnc.dncLists.push(response);
            Alert.success($translate.instant('value.saveSuccess'));
            dnc.duplicateError = false;
          }, function(err) {
            Alert.error($translate.instant('value.saveFail'));
            if(err.data.error.attribute.name) {
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

      dnc.manageList = function (currentlySelectedList) {
        $state.go('content.configuration.dncEdit', {
          id: JSON.stringify(currentlySelectedList)
        });
      };

      //Init date to tomorrow
      // TODO: this should be globalized somehow, as it is used in the other dnc list controller
      function provideDateToday() {
        var newLocalDate = new Date();
        var newUTCDate = $moment.utc([
          newLocalDate.getFullYear(), newLocalDate.getMonth(), newLocalDate.getDate()
        ]).add('2', 'days');
        var today = new Date(newUTCDate);
        return $moment(today).format('YYYY-MM-DD');
      }

      dnc.provideDateToday = provideDateToday();
      dnc.tableConfig = dncListsTableConfig;
    }
  ]);

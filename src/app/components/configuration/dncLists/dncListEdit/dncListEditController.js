'use strict';

angular.module('liveopsConfigPanel')
  .controller('dncListEditController', ['$scope', '$state', 'Session', 'Tenant', 'TenantUser', 'DncListEdit', 'UserPermissions', 'AuthService', '$q', '$moment', 'loEvents', 'PermissionGroups', 'Alert', 'dncListEditTableConfig', 'getCurrentDncList', 'Upload', 'apiHostname',
    function ($scope, $state, Session, Tenant, TenantUser, DncListEdit, UserPermissions, AuthService, $q, $moment, loEvents, PermissionGroups, Alert, dncListEditTableConfig, getCurrentDncList, Upload, apiHostname) {
      var dncEdit = this;

      dncListEditTableConfig.getName(getCurrentDncList.name);

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        dncEdit.selectedContact = new DncListEdit({
          tenantId: Session.tenant.tenantId,
          expiration: ''
        });
      });

      $scope.$on(loEvents.bulkActions.close, function () {
        dncEdit.forceClose = true;
      });

      var sampleContact1 = new DncListEdit({
        id: 134325,
        contact: '976-444-2414',
        expiration: '2020-08-25T21:10:32Z',
        $original: new DncListEdit({
          id: 134325,
          contact: '976-444-2414',
          expiration: '2020-08-25T21:10:32Z'
        })
      });

      var sampleContact2 = new DncListEdit({
        id: 25366,
        contact: '976-444-5565',
        expiration: '2020-11-25T21:10:32Z',
        $original: new DncListEdit({
          id: 25366,
          contact: '976-444-5565',
          expiration: '2020-11-25T21:10:32Z'
        })
      });

      var sampleContact3 = new DncListEdit({
        id: 362666,
        contact: '976-444-3653',
        expiration: '2020-06-25T21:10:32Z',
        $original: new DncListEdit({
          id: 362666,
          contact: '976-444-3653',
          expiration: '2020-06-25T21:10:32Z'
        })
      });

      var sampleContact4 = new DncListEdit({
        id: 73747477,
        contact: '976-444-7378',
        expiration: '2017-10-25T21:10:32Z',
        $original: new DncListEdit({
          id: 73747477,
          contact: '976-444-7378',
          expiration: '2017-10-25T21:10:32Z'
        })
      });

      $scope.$on(loEvents.tableControls.showListMgmt, function () {
        $state.go('content.configuration.dnc')
      });

      $scope.$on(loEvents.fileImported, function (event, csvFileName) {
        var upload = Upload.upload({
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          //url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/media/upload',
          url: getCurrentDncList.apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/dnclists/' + getCurrentDncList.id + '/upload',
          method: 'POST',
          file: csvFileName.name
        });

        upload.then(function (response) {
          $timeout(function () {
            dncEdit.contacts = [sampleContact1, sampleContact2, sampleContact3, sampleContact4];
          });
        });

        return upload;
      });

      $scope.$watch('dncEdit.selectedContact', function (currentlySelectedList) {
        if (currentlySelectedList) {
          // if the panel is set to close and we still have a full record,
          // allow the panel to display
          if (dncEdit.forceClose && dncEdit.selectedContact.id) {
            dncEdit.forceClose = false;
          }
        }
      });

      //Init date to tomorrow
      // TODO: this should be globalized somehow, as it is used in the other dnc list controller
      function provideDateToday() {
        var newLocalDate = new Date();
        var newUTCDate = $moment.utc([
          newLocalDate.getFullYear(), newLocalDate.getMonth(), newLocalDate.getDate()
        ]);
        newUTCDate.add(1, 'days');
        var today = new Date(newUTCDate._d);
        return $moment(today).format('YYYY-MM-DD');
      }

      dncEdit.provideDateToday = provideDateToday();

      dncEdit.tableConfig = dncListEditTableConfig;
      dncEdit.contacts = [sampleContact1, sampleContact2, sampleContact3, sampleContact4];
    }
  ]);

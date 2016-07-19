'use strict';

angular.module('liveopsConfigPanel')
  .controller('dncListsController', ['$scope', '$state', 'Session', 'Tenant', 'TenantUser', 'DncLists', 'UserPermissions', 'AuthService', 'Region', '$q', '$moment', 'loEvents', 'Timezone', 'PermissionGroups', 'Alert', 'dncListsTableConfig',
  function ($scope, $state, Session, Tenant, TenantUser, DncLists, UserPermissions, AuthService, Region, $q, $moment, loEvents, Timezone, PermissionGroups, Alert, dncListsTableConfig) {
      var dnc = this,
        dncListsService = new DncLists(),
        currentlySelectedList;

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        dnc.selectedDncList = new DncLists({
          tenantId: Session.tenant.tenantId,
          expiration: ''
        });
      });


      $scope.$on(loEvents.bulkActions.close, function () {
        dnc.forceClose = true;
      });

      $scope.$watch('dnc.selectedDncList', function (currentlySelectedList) {
        if (currentlySelectedList) {
          // if the panel is set to close and we still have a full record,
          // allow the panel to display
          if (dnc.forceClose && dnc.selectedDncList.id) {
            dnc.forceClose = false;
          }

          currentlySelectedList = dnc.selectedDncList;
        }
      });

      var dncList1 = new DncLists({
        tenantId: "04a20ca0-dbe9-11e5-a479-5347eb4882ad",
        id: "000000000000002",
        name: "Doron",
        expiration: "2020-12-25T21:10:32Z",
        action: "",
        number: 34,
        description: "Doron's DncList",
        active: true,
        createdBy: "f51b96e0-c3ae-11e5-9596-c1ae7ae4ed37",
        externalId: "doron-dnc-list",
        updatedBy: "f51b96e0-c3ae-11e5-9596-c1ae7ae4ed37",
        created: "2016-02-25T17:55:55Z",
        updated: "2016-02-25T17:55:55Z",
        $original: new DncLists({
          "tenantId": "04a20ca0-dbe9-11e5-a479-5347eb4882ad",
          expiration: "2020-12-25T21:10:32Z",
          id: "000000000000002",
          name: "Doron",
          description: "Doron's DncList",
          active: true,
          updatedBy: "f51b96e0-c3ae-11e5-9596-c1ae7ae4ed37",
          createdBy: "f51b96e0-c3ae-11e5-9596-c1ae7ae4ed37",
          created: "2016-02-25T17:55:55Z",
          updated: "2016-02-25T17:55:55Z"
        })
      });

      var dncList2 = new DncLists({
        tenantId: "04a20ca0-dbe9-11e5-a479-5347eb4882ad",
        id: "000000000000012",
        name: "Gristophet",
        expiration: "2018-02-15T21:10:32Z",
        action: "",
        number: 102,
        description: "Gristophet's DncList",
        active: true,
        createdBy: "f51b96e0-c3ae-11e5-9596-c1ae7ae4ed37",
        externalId: "doron-dnc-list",
        updatedBy: "f51b96e0-c3ae-11e5-9596-c1ae7ae4ed37",
        created: "2016-02-25T17:55:55Z",
        updated: "2016-02-25T17:55:55Z",
        $original: new DncLists({
          "tenantId": "04a20ca0-dbe9-11e5-a479-5347eb4882ad",
          id: "000000000000012",
          expiration: "2018-02-15T21:10:32Z",
          number: 102,
          name: "Gristophet",
          description: "Gristophet's DncList",
          active: true,
          updatedBy: "f51b96e0-c3ae-11e5-9596-c1ae7ae4ed37",
          createdBy: "f51b96e0-c3ae-11e5-9596-c1ae7ae4ed37",
          created: "2016-02-25T17:55:55Z",
          updated: "2016-02-25T17:55:55Z"
        })
      });

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
        ]);
        newUTCDate.add(1, 'days');
        var today = new Date(newUTCDate._d);
        return $moment(today).format('YYYY-MM-DD');
      }

      dnc.provideDateToday = provideDateToday();
      dnc.tableConfig = dncListsTableConfig;
      dnc.dncLists = [dncList1, dncList2];

      // dnc.loadDncLists = function () {
      //   dnc.dncLists = DncLists.cachedQuery({
      //     tenantId: Session.tenant.tenantId
      //   });
      //
      //   return dnc.dncLists;
      // };
      //
      // dnc.loadDncLists();
    }
  ]);

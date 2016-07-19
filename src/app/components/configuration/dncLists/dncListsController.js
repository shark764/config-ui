'use strict';

angular.module('liveopsConfigPanel')
  .controller('dncListsController', ['$scope', '$state', 'Session', 'Tenant', 'TenantUser', 'DncLists', 'UserPermissions', 'AuthService', 'Region', '$q', '$moment', 'loEvents', 'Timezone', 'PermissionGroups', 'Alert', 'dncListsTableConfig',
  function ($scope, $state, Session, Tenant, TenantUser, DncLists, UserPermissions, AuthService, Region, $q, $moment, loEvents, Timezone, PermissionGroups, Alert, dncListsTableConfig) {
      var dnc = this,
        dncListsService = new DncLists(),
        currentlySelectedList = dnc.selectedDncList;

      function convertDateToMySqlFormat (date) {
        return date + ' 00:00:00'
      };

      dnc.dncLists = DncLists.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        dnc.selectedDncList = new DncLists({
          tenantId: Session.tenant.tenantId,
          active: true
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

      if(angular.isDefined(dnc.selectedDncList)) {
        console.log('it is defined!');
        dnc.selectedDncList.onChange = function (newVal, oldVal) {
          console.log('newVal, oldVal', newVal, oldVal);
          if (newVal === oldVal) {
            dnc.forms.detailsForm.expiration.$setdirty();
          }
        }
      };


      dnc.submit = function () {
        //dnc.selectedDncList.expiration = convertDateToMySqlFormat(dnc.selectedDncList.expiration);
        //dnc.selectedDncList.expiration = '2020:01:01 00:00:00';
        console.log('dnc.selectedDncList', dnc.selectedDncList);
        return dnc.selectedDncList.save({
          tenantId: Session.tenant.tenantId
        })
        .then(function (response) {
          //dnc.dncLists.push(response);
          //console.log('response', response)
        });
      }

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

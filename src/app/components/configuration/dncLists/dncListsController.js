'use strict';

angular.module('liveopsConfigPanel')
  .controller('dncListsController', ['$scope', '$state', '$timeout', '$translate', 'Session', 'apiHostname', 'DncLists', '$q', '$moment', 'loEvents', 'Alert', 'dncListsTableConfig',
    function ($scope, $state, $timeout, $translate, Session, apiHostname, DncLists, $q, $moment, loEvents, Alert, dncListsTableConfig) {
      var dnc = this;

      $scope.forms = {};
      dnc.tableConfig = dncListsTableConfig;

      function convertDateToMySqlFormat(date) {
        var convertedDate = date;
        if (date) {
          var newDate = new Date(date);
          var tomorrow = $moment(newDate).add(1, 'days')._d;
          convertedDate = $moment(tomorrow).format('YYYY-MM-DD') + ' 00:00:00';
        }

        return convertedDate;
      };

      function convertDateFromMySqlFormat(date) {
        if (date !== null) {
          if (date) {
            var indivDate = date;
            return indivDate.substr(0, 10);
          }
        } else {
          return '';
        }
      };

      dnc.updateActive = function () {
        var dncListcopy = new DncLists({
          id: dnc.selectedDncList.id,
          tenantId: Session.tenant.tenantId,
          active: !dnc.selectedDncList.active,
          name: dnc.selectedDncList.name,
          description: dnc.selectedDncList.description
        });

        return dncListcopy.save().then(function (result) {
          dnc.selectedDncList.$original.active = result.active;
        });
      };

      dnc.dncLists = DncLists.cachedQuery({
        tenantId: Session.tenant.tenantId
      });

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        dnc.selectedDncList = null;
        dnc.create();
      });

      dnc.create = function () {
        dnc.selectedDncList = new DncLists({
          tenantId: Session.tenant.tenantId,
          active: true,
          expiration: null
        });
      };

      $scope.$on(loEvents.bulkActions.close, function () {
        dnc.forceClose = true;
      });

      $scope.$watch('dnc.selectedDncList', function () {
        if (dnc.selectedDncList) {
          dnc.selectedDncList.expiration = convertDateFromMySqlFormat(dnc.selectedDncList.expiration);
        }
      });

      dnc.submit = function () {
        if (!dnc.selectedDncList.expiration) {
          delete dnc.selectedDncList.expiration;
        } else {
          dnc.selectedDncList.expiration = convertDateToMySqlFormat(dnc.selectedDncList.expiration);
        }

        return dnc.selectedDncList.save({
          tenantId: Session.tenant.tenantId
        }, function (response) {
          dnc.duplicateError = false;
        }, function (err) {
          if (err.data.error.attribute.name) {
            dnc.duplicateError = true;
            dnc.duplicateErrorMessage = err.data.error.attribute.name.capitalize();
          }
        })
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
      };

      dnc.provideDateTomorrow = provideDateTomorrow();

      dnc.dateWatch = function () {
        var unwatch = $scope.$watch('dnc.selectedDncList.expiration', function () {});
        $scope.$watch('dnc.selectedDncList.expiration', function (newVal, oldVal) {
          if (oldVal === null) {
            $scope.forms.detailsForm.$setDirty();
            unwatch();
          } else {
            if (newVal && angular.isDefined(oldVal)) {
              if (oldVal.substring(0, 10) !== newVal.substring(0, 10)) {
                $scope.forms.detailsForm.$setDirty();
                unwatch();
              }
            }
          }
        });
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel')
.directive('userTransferLists', ['_', 'TenantUserTransferList', 'TenantTransferListUser', 'TransferList', 'Session', '$timeout', '$filter', '$translate', 'Alert', '$q', 'queryCache',
  function (_, TenantUserTransferList, TenantTransferListUser, TransferList, Session, $timeout, $filter, $translate, Alert, $q, queryCache) {
      return {
        restrict: 'E',
        scope: {
          user: '='
        },
        templateUrl: 'app/components/management/users/userTransferLists/userTransferLists.html',
        link: function ($scope, $element) {
          var tagWrapper = angular.element(document.querySelector('#tags-inside'));

          $scope.reset = function () {
            $scope.saving = false;
            $scope.selectedTransferList = null;

            if (angular.isDefined($scope.addTransferList.name)) {
              $scope.addTransferList.name.$setUntouched();
              $scope.addTransferList.name.$setPristine();
            }

            $scope.newTransferListUser = new TenantTransferListUser({
              transferListId: null,
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id
            });
          };

          $scope.save = function (selectedTransferList) {
            if (selectedTransferList === null || selectedTransferList === '') {
              return;
            }

            var promise;
            $scope.saving = true;

            if (angular.isString(selectedTransferList)) {
              var transferList = new TransferList({
                name: selectedTransferList,
                tenantId: Session.tenant.tenantId,
                description: '',
                active: true,
                shared: false
              });

              promise = transferList.save().then(function(result){
                return $scope.saveUserTransferList(result);
              }, function (response) {
                $scope.saving = false;
                return $q.reject(response);
              });
            } else {
              promise = $scope.saveUserTransferList(selectedTransferList);
            }

            return promise;
          };

          $scope.saveUserTransferList = function (selectedTransferList) {
            $scope.newTransferListUser.transferListId = selectedTransferList.id;

            return $scope.newTransferListUser.$save(function (data) {
              var newUserTransferList = new TenantTransferListUser(data);
              newUserTransferList.name = selectedTransferList.name;
              newUserTransferList.id = data.transferListId;
              $scope.userTransferLists.push(newUserTransferList);

              $timeout(function () { //Timeout prevents simultaneous $digest cycles
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);

              $scope.reset();
              return data;
            }, function (response) {
              $scope.saving = false;
              return $q.reject(response);
            });
          };

          $scope.remove = function (userTransferList) {


            var tgu = new TenantUserTransferList({
              userId: $scope.user.id,
              transferListId: userTransferList.id,
              tenantId: Session.tenant.tenantId
            });


            tgu.$delete(function (TenantTransferListUser) {
              for(var transferIndex in $scope.user.$transfers) {
                var transfer = $scope.user.$transfers[transferIndex];
                if(transfer.id === TenantTransferListUser.transferId) {
                  $scope.user.$transfers.removeItem(transfer);
                  break;
                }
              }

              $scope.userTransferLists.removeItem(userTransferList);
              $timeout(function () {
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);

              //TODO: remove once transfers api returns members list
              //Reset cache of users for this transfer
              queryCache.remove('transfers/' + tgu.transferId + '/users');
            }).then(function() {
              Alert.success($translate.instant('transfer.table.remove.member'));
            });
          };

          $scope.fetch = function () {
            if (!Session.tenant.tenantId) {
              return;
            }

            $scope.userTransferLists = TenantUserTransferList.query({
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id
            }, $scope.reset);

            $q.all([$scope.fetchTransferLists().$promise, $scope.userTransferLists.$promise]).then(function () {

              $timeout(function () {
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);
            });
          };

          $scope.fetchTransferLists = function () {
            return TransferList.cachedQuery({
              tenantId: Session.tenant.tenantId
            });
          };

          $scope.$watch('user', function (newSelection) {
            if (!newSelection || !Session.tenant.tenantId) {
              return;
            }

            $scope.reset();
            $scope.fetch();
          });

          $scope.filterTransferLists = function(item) {
            var matchingLists = $scope.userTransferLists.filter(function(transferList) {
              return transferList.id === item.id;
            });
            return matchingLists.length === 0;
          };

          $scope.removeDefaultTransfers = function(item) {
            return !item.isDefault;
          };

          $scope.removeDisabledItems = function(item) {
            return item.active;
          };

          $scope.onEnter = function(){
            //Trigger the lo-submit handler that is attached to the type-ahead
            //Normally they are only triggered by click, but it does support custom events
            $element.find('type-ahead').trigger('transfers.enter.event');
          };

          //This is just for presentation, to only show the expander thing when there is more than three rows of data
          $scope.collapsed = true;
          $scope.hideCollapseControls = true;

          $scope.$on('resizehandle:resize', function () {
            $scope.updateCollapseState(tagWrapper.height());
          });

          $scope.updateCollapseState = function (wrapperHeight) {
            var maxCollapsedHeight = 94; //TODO: This should be dynamically determined
            if (wrapperHeight < maxCollapsedHeight && wrapperHeight > 0) {
              $scope.$apply(function () {
                $scope.hideCollapseControls = true;
              });
            } else {
              $scope.$apply(function () {
                $scope.hideCollapseControls = false;
              });
            }
          };
        }
      };
    }
  ]);

'use strict';

angular.module('liveopsConfigPanel')
  .controller('listsController', ['$scope', '$filter', '$q', 'Session', 'List', 'ListType', 'listTableConfig', 'UserPermissions',
    function ($scope, $filter, $q, Session, List, ListType, listTableConfig, UserPermissions) {

      $scope.create = function () {
        $scope.selectedList = new List();
      };

      $scope.fetchLists = function () {
        $scope.lists = List.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        return $scope.lists;
      };

      $scope.submit = function () {
        return $scope.selectedList.save({
          tenantId: Session.tenant.tenantId
        });
      };


      $scope.addListItem = function addListItem() {
        var newItem = {
          $edit: true
        };
        
        $scope.selectedList.items.push(newItem);
        $scope.selectedList.$original.items.push(newItem);
        
        return newItem;
      };
      
      $scope.removeListItem = function removeListItem(index) {
        $scope.selectedList.items.splice(index, 1);
        $scope.selectedList.$original.items.splice(index, 1);
        
        $scope.forms.detailsForm.$setDirty();
      };

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.$watchCollection('lists', function (lists) {
        if(!lists || !lists.length) {
          return;
        }
        
        ListType.cachedQuery({
          tenantId: Session.tenant.tenantId
        }).$promise.then(function (listTypes) {
          angular.forEach(lists, function (list) {
            var listType = $filter('filter')(listTypes, {
              id: list.listTypeId
            })[0];

            list.$listType = listType;
          });
        });
      });
      
      $scope.forms = {};
      $scope.tableConfig = listTableConfig;
    }
  ]);
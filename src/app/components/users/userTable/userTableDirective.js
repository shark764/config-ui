'use strict';

angular.module('liveopsConfigPanel')
  .directive('userTable', ['userStates', 'userStatuses', 'UserService', function(userStates, userStatuses, UserService) {
    return {
      restrict: 'E',
      link : function($scope) {
        $scope.states = userStates;
        $scope.statuses = userStatuses;
        $scope.selectedUser = null;
        $scope.filteredUsers = [];  // set by the ng-repeat on table

        UserService.query(function(data) {
          $scope.users = data.result;
        });

        $scope.selectUser = function(user){
          $scope.selectedUser = user;
        };

        $scope.regExpReplace = function(string) {
          string.replace(/([.+?^=!:${}()|\[\]\/\\])/g, '\\$1');
          return string.replace(/([*])/g, '.*');
        };

        $scope.search = function(user) {
          if (!$scope.searchQuery){
            return true
          }

          var wildCardQuery = new RegExp($scope.regExpReplace($scope.searchQuery), 'i');

          return wildCardQuery.test(user.firstName + ' ' + user.lastName);
        };
     	},
      templateUrl: 'app/components/users/userTable/userTable.html'
    };
  }])

  .filter('userFilter', function () {
    return function (users, items, field) {
      if (items.all && items.all.checked) {
        return users;
      }

      var selectedFilters = [];
      angular.forEach(items.filters, function (item) {
        if (item.checked) {
          selectedFilters.push(String(item.value));
        }
      });

      var filtered = [];
      angular.forEach(users, function (user) {
        if (selectedFilters.indexOf(String(user[field])) > -1) {
          filtered.push(user);
        }
      });

      return filtered;
    };
  });

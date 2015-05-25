'use strict';

angular.module('liveopsConfigPanel')
  .directive('userTable', ['userStates', 'userStatuses', function(userStates, userStatuses) {
    var controller = ['$scope', '$filter', function($scope, $filter) {
      $scope.states = userStates;
      $scope.statuses = userStatuses;
      
      $scope.updateUsers = function(){
        var filteredUsers = $scope.users;
        filteredUsers = $filter('userStatusFilter')(filteredUsers, $scope.statuses);
        filteredUsers = $filter('userStateFilter')(filteredUsers, $scope.states);
        filteredUsers = $scope.filter(filteredUsers);
        $scope.users = filteredUsers;
      };
    }];

    return {
      restrict: 'E',
      scope: {
        users: '=',
        selectUser: '=',
        filter: '='
      },
      templateUrl: 'app/components/users/userTable/userTable.html',
      controller : controller,
    };
  }])
  .filter('userFilter', function() {
    return function( users, items, field) {
      if (items.all && items.all.checked){
        return users;
      }

      var selectedFilters = [];
      angular.forEach(items.filters, function(item) {
        if(item.checked) {
          selectedFilters.push(String(item.value));
        }
      });

      var filtered = [];
      angular.forEach(users, function(user) {
        if(selectedFilters.indexOf(String(user[field])) > -1) {
          filtered.push(user);
        }
      });

      return filtered;
    };
  })
 ;

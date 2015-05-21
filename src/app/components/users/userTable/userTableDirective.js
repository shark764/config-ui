'use strict';

angular.module('liveopsConfigPanel')
  .directive('userTable', function() {
    var controller = ['$scope', '$filter', function($scope, $filter) {
      $scope.statuses = {all : {display: 'All', value: 'all', checked: true}, filters : [{display: 'Disabled', value: 'false', checked: false}, {display: 'Enabled', value : 'true', checked: false}]};
      $scope.states = {all: {display: 'All', value: 'all', checked: true}, filters : [{display: 'Busy', value: 'BUSY', checked: false}, {display: 'Logout', value : 'LOGOUT', checked: false}, {display: 'Ready', value : 'READY', checked: false}, {display: 'Login', value : 'LOGIN', checked: false}, {display: 'Not Ready', value : 'NOT_READY', checked: false}, {display: 'Wrap', value : 'WRAP', checked: false}]};
      
      $scope.updateUsers = function(){
        var filteredUsers = $scope.users;
        filteredUsers = $filter('userStatusFilter')(filteredUsers, $scope.statuses);
        filteredUsers = $filter('userStateFilter')(filteredUsers, $scope.states);
        $scope.users = filteredUsers;
      };
    }];
    
    return {
      restrict: 'E',
      scope: {
        users: '='
      },
      templateUrl: 'app/components/users/userTable/userTable.html',
      controller : controller,
    };
  })
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

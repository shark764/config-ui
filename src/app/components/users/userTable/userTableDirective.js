'use strict';

angular.module('liveopsConfigPanel')
  .directive('userTable', ['userStates', 'userStatuses', function(userStates, userStatuses) {
    return {
      restrict: 'E',
      scope: {
        users: '='
      },
      link : function(scope) {
        scope.states = userStates;
        scope.statuses = userStatuses;
        scope.filteredUsers = [];
  
        scope.$watchCollection('filteredUsers', function(newList, oldList) {
          angular.forEach(scope.users, function(user) {
            if (newList.indexOf(user) === -1) {
              user.filtered = true;
              if (user.checked) {
                user.checked = false;
                scope.$emit('userList:user:unchecked');
              }
            } else {
              user.filtered = false;
            }
          });
        });
      
        scope.selectUser = function(selectedUser) {
          scope.selectedUser = selectedUser;
          scope.$emit('userTable:user:selected', selectedUser);
        };

        scope.checkChanged = function(value){
          if (value){
            scope.$emit('userList:user:checked');
          } else {
            scope.$emit('userList:user:unchecked');
          }
        }
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

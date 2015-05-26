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
        
        scope.selectUser = function(selectedUser) {
          scope.selectedUser = selectedUser;
          scope.$emit('userTable:user:selected', selectedUser);
        };

        scope.searchUser = function(user) {
          if (!scope.queryUser) {
            return true;
          }
          var wildCardQuery = new RegExp(scope.regExpReplace(scope.queryUser), 'i');
          
          // Search by displayName and location; location not defined yet
          // return (wildCardQuery.test(user.firstName + ' ' +
          // user.lastName) || wildCardQuery.test(user.location));
          return (wildCardQuery.test(user.firstName + ' ' + user.lastName));
        };
        
        scope.regExpReplace = function(string) {
          // Allow all characters in user search, use * as wildcard
          string.replace(/([.+?^=!:${}()|\[\]\/\\])/g, '\\$1');
          return string.replace(/([*])/g, '.*');
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
        } else {
          //Uncheck users that have been excluded by the filter, so they are not included in batch operations:
          user.checked = false;
        }
      });

      return filtered;
    };
  });
